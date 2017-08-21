import json
import re
import copy
import logger

from flask import Flask, request, jsonify, make_response, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from time import gmtime, strftime
from flask_cors import CORS

from models.fields import fields as record_structure
from mailing import send_mail, send_mail_approve
from utils import get_user_groups, is_user_in_group
from validate import validate_model
from decorators import auth_user_group
from config import CONFIG

app = Flask(__name__, static_folder="../client/dist",
            template_folder="../client/templates")
CORS(app)

client = MongoClient(CONFIG.DB_URL)
db = client.xsdb
collection = db.xsdbCollection


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# for [/edit/:id] url path when client doesn't have js (refresh on edit page does not work without this)
@app.route('/<path:path>', methods=['GET'])
def fallback(path):
    return render_template('index.html')


@app.route('/api/get/<record_id>', methods=['GET'])
def get_by_id(record_id):
    logger.debug("GET " + record_id)
    result = {}
    record = None

    if ObjectId.is_valid(record_id):
        record = collection.find_one({'_id': ObjectId(record_id)})

    if record is not None:
        del record['_id']

        result['id'] = {
            'name': 'id',
            'value': record_id,
            'type': 'not_render'
        }

        # Make a copy of field structure, to not mutate it
        structure = copy.deepcopy(record_structure)

        # Map record fields to information in record_structure (type, disabled, required)
        for key, value in record.iteritems():
            if key in structure:
                result[key] = structure[key]  # type, disabled, title
                # overwrite value with true value from db
                result[key]['value'] = value
            else:
                # if field does not exit in record structure default is:
                # enabled, not required text field
                result[key] = {
                    'title': key,
                    'type': 'text',
                    'value': value
                }

        # Add new fields (which are not in the record, but exist in record_structure)
        for key in structure:
            if key not in result:
                result[key] = structure[key]
    else:
        result = record_structure

    return make_response(jsonify(result), 200)

# Get empty record_structure
@app.route('/api/get', methods=['GET'])
@auth_user_group(0)  # Role: xsdb-user or higher
def get_empty():
    logger.debug("GET Empty record")
    return make_response(jsonify(record_structure), 200)


@app.route('/api/insert', methods=['POST'])
@auth_user_group(0)
def insert():
    record = request.get_json()
    logger.debug("INSERT " + str(record))

    # get list of invalid fields
    error_fields = validate_model(record)

    if len(error_fields) == 0:
        user_login = request.headers.get("Adfs-Login")
        curr_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())

        record['createdOn'] = curr_date
        record['modifiedOn'] = curr_date
        record['createdBy'] = user_login
        record['modifiedBy'] = user_login
        record['status'] = 'new'

        record_id = collection.insert(record)

        result = collection.find_one({'_id': record_id})
        result["id"] = str(record_id)

        send_mail_approve(record_id)

        return make_response(dumps(result), 201)
    else:
        return make_response(jsonify({
            'error_message': 'incorrect data format',
            'error_fields': error_fields
        }), 400)


@app.route('/api/update/<record_id>', methods=['POST'])
@auth_user_group(0)
def update(record_id):
    record = request.get_json()
    logger.debug("UPDATE " + str(record))

    error_fields = validate_model(record)

    if len(error_fields) == 0:
        user_login = request.headers.get("Adfs-Login")

        record['modifiedOn'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        record['modifiedBy'] = user_login

        # if user isn't xsdb-approval or xsdb-admin, reset status and send email
        do_send_mail = False
        if not is_user_in_group(1):
            record['status'] = 'new'
            do_send_mail = True

        collection.update({'_id': ObjectId(record_id)}, record)
        result = collection.find_one({'_id': ObjectId(record_id)})
        result["id"] = record_id

        if do_send_mail:
            send_mail_approve(record_id)

        return make_response(dumps(result), 201)
    else:
        return make_response(jsonify({
            'error_message': 'incorrect data format',
            'error_fields': error_fields
        }), 400)


@app.route('/api/delete/<record_id>', methods=['DELETE'])
@auth_user_group(2)  # Role: xsdb-admin or higher
def delete(record_id):
    logger.debug("DELETE " + record_id)

    collection.delete_one({'_id': ObjectId(record_id)})

    return make_response('success', 200)


@app.route('/api/search', methods=['POST'])
def search():
    json_data = json.loads(request.data)
    logger.debug("SEARCH " + str(json_data))

    # search query json object
    query = json_data['search']
    # pagination information
    page_size = json_data['pagination']['pageSize']
    current_page = json_data['pagination']['currentPage']
    search_dictionary = query#{}

    # compile regular expressions
    # for key in query:
    #     search_dictionary[key] = re.compile(query[key], re.I)

    logger.debug(query)

    cursor = collection.find(search_dictionary).skip(
        current_page * page_size).limit(page_size)
    result = dumps(cursor)

    return make_response(result, 200)

# get list of record_structure field names (for selecting visible columns)


@app.route('/api/fields', methods=['GET'])
def get_fields():
    result = record_structure.keys()
    return make_response(jsonify(result), 200)


@app.route('/api/approve', methods=['POST'])
@auth_user_group(1)  # Role: xsdb-approval or higher
def approve_records():
    # multiple record Ids
    record_ids = json.loads(request.data)
    user_login = request.headers.get("Adfs-Login") or ""

    logger.debug("APPROVE:" + str(record_ids) + " - USER " + user_login)

    curr_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    object_ids = map(lambda x: ObjectId(x), record_ids)
    collection.update_many({'_id': {'$in': object_ids}}, {
                           '$set': {
                               'status': 'approved',
                               'modifiedOn': curr_date,
                               'approvedBy': user_login,
                               'modifiedBy': user_login
                           }})

    return make_response('success', 200)

# get roles user has (used when react app loads)
@app.route('/api/roles', methods=['GET'])
def get_roles():
    groups = get_user_groups()
    # from all user groups take only relevant to xsdb
    roles = [x for x in groups if x in CONFIG.USER_ROLES]
    # roles = ['xsdb-admins']  # CONFIG.USER_ROLES

    return make_response(jsonify(roles), 200)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
