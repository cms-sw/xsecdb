import json
import re
import copy
import os

from flask import Flask, request, jsonify, make_response, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from time import gmtime, strftime
from flask_cors import CORS

from . import logger
from .fields import fields as record_structure
from .mailing import send_mail, send_mail_approve
from .utils import compile_regex, get_ordered_field_list,\
    get_user_groups, is_user_in_group, get_field_order, remove_readonly_fields
from .validate import validate_model, validate_model_update
from .decorators import auth_user_group
from .config import CONFIG

app = Flask(__name__, static_folder="../client/dist",
            template_folder="../client/templates")
# CORS(app)

client = MongoClient(CONFIG.DB_URL)
db = client.xsdb
collection = db.xsdbCollection


@app.route('/', methods=['GET'])
def index():
    logger.debug(os.listdir('./'))
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def fallback(path):
    """ for [/edit/:id] url path when client doesn't have js 
        (refreshing edit page does not work without this endpoint) """
    return render_template('index.html')


@app.route('/api/get/<record_id>', methods=['GET'])
def get_by_id(record_id):
    logger.debug("GET " + record_id)
    result_dic = {}
    result = []
    record = None

    if ObjectId.is_valid(record_id):
        record = collection.find_one({'_id': ObjectId(record_id)})

    if record is not None:
        del record['_id']

        # Make a copy of field structure, to not mutate it
        structure = copy.deepcopy(record_structure)

        # Map record fields to information in record_structure (type, disabled, required, order)
        for key, value in record.items():
            if key in structure:
                result_dic[key] = structure[key]  # type, disabled, title
                # overwrite value with true value from db
                result_dic[key]['value'] = value
            else:
                # if field does not exit in record structure default is:
                # enabled, not required text field
                result_dic[key] = {
                    'title': key,
                    'type': 'text',
                    'value': value
                }

        # Add new fields (which are not in the record, but exist in record_structure)
        for key in structure:
            if key not in result_dic:
                result_dic[key] = structure[key]

        # Order fields by record_structures [order] field and for list structure
        result = get_ordered_field_list(result_dic)

        # Add ID field
        result.append({
            'name': 'id',
            'value': record_id,
            'type': 'not_render'
        })

    else:
        result = get_ordered_field_list(record_structure)

    return make_response(jsonify(result), 200)


@app.route('/api/get', methods=['GET'])
@auth_user_group(0)  # Role: xsdb-user or higher
def get_empty():
    """ get empty record_structure """
    logger.debug("GET Empty record")
    result = get_ordered_field_list(record_structure)
    return make_response(jsonify(result), 200)


@app.route('/api/insert', methods=['POST'])
@auth_user_group(1)
def insert():
    record = request.get_json()
    logger.debug("INSERT " + str(record))

    # get error dictionary and pass it to frontend
    error_obj = validate_model(record)

    if not error_obj:
        # user_login = request.headers.get("Adfs-Login")
        user_login = request.headers.get("X-Forwarded-User")
        curr_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())

        remove_readonly_fields(record)

        record['createdOn'] = curr_date
        record['modifiedOn'] = curr_date
        record['createdBy'] = user_login
        record['modifiedBy'] = user_login
        record['status'] = 'new'

        record_id = collection.insert_one(record).inserted_id

        result = collection.find_one({'_id': record_id})
        result["id"] = str(record_id)

        send_mail_approve(record_id)

        return make_response(dumps(result), 201)
    else:
        return make_response(jsonify({
            'error_message': 'incorrect data format',
            'error_fields': error_obj
        }), 400)


@app.route('/api/update/<record_id>', methods=['POST'])
@auth_user_group(1)
def update(record_id):
    record = request.get_json()
    logger.debug("UPDATE " + str(record))

    error_obj = validate_model_update(record)

    if not error_obj:
        # user_login = request.headers.get("Adfs-Login")
        user_login = request.headers.get("X-Forwarded-User")
        remove_readonly_fields(record)

        record['modifiedOn'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        record['modifiedBy'] = user_login

        old_status = collection.find_one({'_id': ObjectId(record_id)})['status']
        # logger.debug(old_status)
        # if user isn't xsdb-approval or xsdb-admin, reset status and send email
        do_send_mail = False
        if not is_user_in_group(1) and old_status == 'approved':
            record['status'] = 'new'
            do_send_mail = True

        collection.update_one({'_id': ObjectId(record_id)}, {'$set': record})
        result = collection.find_one({'_id': ObjectId(record_id)})
        result["id"] = record_id

        # to not send email before update. In case record does not get inserted
        if do_send_mail:
            send_mail_approve(record_id)

        return make_response(dumps(result), 201)
    else:
        return make_response(jsonify({
            'error_message': 'incorrect data format',
            'error_fields': error_obj
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
    query = json_data.get('search', json_data)
    # pagination information
    page_size = json_data.get('pagination', {}).get('pageSize', 50)
    current_page = json_data.get('pagination', {}).get('currentPage', 0)
    order_by = json_data.get('orderBy', {})

    # compile regular expressions
    search_dictionary = compile_regex(dict(query))

    # to enable searching by _id
    if 'id' in query:
        search_dictionary['_id'] = ObjectId(query['id'])
        del search_dictionary['id']

    cursor = collection.find({'$query': search_dictionary, '$orderby': order_by}).skip(
        current_page * page_size).limit(page_size)

    result = dumps(cursor)

    return make_response(result, 200)


@app.route('/api/fields', methods=['GET'])
def get_fields():
    """ get list of record_structure field names (for selecting visible columns) """
    result = sorted(record_structure.keys(), key=get_field_order)
    return make_response(jsonify(result), 200)


@app.route('/api/approve', methods=['POST'])
@auth_user_group(1)  # Role: xsdb-approval or higher
def approve_records():
    record_ids = json.loads(request.data)
    # user_login = request.headers.get("Adfs-Login") or ""
    user_login = request.headers.get("X-Forwarded-User") or ""
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


@app.route('/api/get_last_by_user/<user_name>', methods=['GET'])
def get_last_by_user(user_name):
    """ get last record created by specific user """
    logger.debug("GET last record by user: " + str(user_name))

    result = collection.find({'$query': {'createdBy': user_name}, '$orderby': {'createdOn': -1}}).limit(1)

    return make_response(dumps(result), 200)


@app.route('/api/roles', methods=['GET'])
def get_roles():
    """ get roles user has (used when react app loads) """
    groups = get_user_groups()
    # from all user groups take only relevant to xsdb
    roles = [x for x in groups if x in CONFIG.USER_ROLES]
    # roles = ['xsdb-admins']  # For testing

    return make_response(jsonify(roles), 200)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
