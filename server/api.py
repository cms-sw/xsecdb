import json
import re
import copy
import logger

from flask import Flask, request, jsonify, make_response, render_template, abort
from functools import wraps
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from time import gmtime, strftime
from flask_cors import CORS
from models.fields import fields as record_structure
from mailing import send_mail, send_mail_approve
from config import CONFIG

app = Flask(__name__, static_folder="../client/dist",
            template_folder="../client/templates")
CORS(app)

client = MongoClient(CONFIG.DB_URL)
db = client.xsdb
collection = db.xsdbCollection

##
def validate_model(record):
    return True

def get_user_groups():
    adfs_group = request.headers.get('Adfs-Group')
    groups = []

    if adfs_group is not None:
        groups = adfs_group.split(";")

    return groups

def is_user_in_group(group_level):
    # return True
    # Get minimum required groups
    required_groups = CONFIG.USER_ROLES[group_level:]

    # Get all groups user has
    groups = get_user_groups()

    result = any(role in required_groups for role in groups)
    return result

# Decorator wrapped into function which accepts required e-group level
def auth_user_group(group_level):
    def decorated_function(f):
        @wraps(f)
        def func_wrapper(*args, **kwargs):

            if not is_user_in_group(group_level):
                abort(403, "Insufficient permissions")

            return f(*args, **kwargs)
        return func_wrapper
    return decorated_function
##


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# for /edit/:id path when client doesn't have js (refresh edit in production env)
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
        dic_ = copy.deepcopy(record_structure)

        # Map record fields to structure
        for key, value in record.iteritems():
            if key in dic_:
                result[key] = dic_[key]  # type, disabled, title
                result[key]['value'] = value
            else:
                result[key] = {
                    'title': key,
                    'type': 'text',
                    'value': value
                }

        # Add keys of new fields (which currently are not in record)
        for key in dic_:
            if key not in result:
                result[key] = dic_[key]
    else:
        result = record_structure

    return make_response(jsonify(result), 200)


@app.route('/api/get', methods=['GET'])
@auth_user_group(0)  # Role: xsdb-user or higher
def get_empty():
    logger.debug("GET Empty record")

    return make_response(jsonify(record_structure), 200)


@app.route('/api/insert', methods=['POST'])
@auth_user_group(0)
def insert():
    logger.debug("INSERT " + str(request.get_json()))

    if validate_model(request.data):
        user_login = request.headers.get("Adfs-Login")
        curr_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        record = request.get_json()

        record['createdOn'] = curr_date
        record['modifiedOn'] = curr_date
        record['createdBy'] = user_login
        record['modifiedBy'] = user_login

        record_id = collection.insert(record)

        result = collection.find_one({'_id': record_id})
        result["id"] = str(record_id)

        send_mail_approve(record_id)

        return make_response(dumps(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


@app.route('/api/update/<record_id>', methods=['POST'])
@auth_user_group(0)
def update(record_id):
    logger.debug("UPDATE " + str(request.get_json()))

    if validate_model(request.data):
        user_login = request.headers.get("Adfs-Login")

        record = request.get_json()
        record['modifiedOn'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        record['modifiedBy'] = user_login

        collection.update_one({'_id': ObjectId(record_id)}, record)

        result = collection.find_one({'_id': ObjectId(record_id)})
        result["id"] = record_id

        send_mail_approve(record_id)

        return make_response(dumps(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


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

    query = json_data['search']
    page_size = json_data['pagination']['pageSize']
    current_page = json_data['pagination']['currentPage']
    search_dictionary = {}

    for key in query:
        search_dictionary[key] = re.compile(query[key], re.I)

    logger.debug(query)
    # search_dictionary = {
    #     # 'status': 'Approved',
    #     '$and': [
    #         {'$or': [{'status': 'Approved'}, {'status': 'New'}]},
    #         {'$or': [{'DAS': 'test DAS'}, {'equivalent_lumi': 'test lumif'}]}
    #     ]
    #     # '$or': [ {'status': 'Approved'}, {'status': 'New'} ],
    #     # '$or': [ {'DAS': 'test DAS'}, {'equivalent_lumi': 'test lumif'} ]
    # }

    cursor = collection.find(search_dictionary).skip(
        current_page * page_size).limit(page_size)
    result = dumps(cursor)

    return make_response(result, 200)


@app.route('/api/fields', methods=['GET'])
def get_fields():
    result = record_structure.keys()
    return make_response(jsonify(result), 200)


@app.route('/api/approve', methods=['POST'])
@auth_user_group(1)  # Role: xsdb-approval or higher
def approve_records():
    record_ids = json.loads(request.data)
    user_login = request.headers.get("Adfs-Login") or ""

    logger.debug("APPROVE:" + str(record_ids) + " - USER " + user_login)

    curr_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    object_ids = map(lambda x: ObjectId(x), record_ids)
    collection.update_many({'_id': {'$in': object_ids}}, {
                           '$set': {
                               'status': 'Approved',
                               'modifiedOn': curr_date,
                               'approvedBy': user_login
                           }})

    return make_response('success', 200)


@app.route('/api/roles', methods=['GET'])
def get_roles():
    groups = get_user_groups()
    # from all user groups take only relevant to xsdb
    roles = [x for x in groups if x in CONFIG.USER_ROLES]

    # roles = ['xsdb-admins']#CONFIG.USER_ROLES

    return make_response(jsonify(roles), 200)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
