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
from config import CONFIG

app = Flask(__name__, static_folder="../client/dist", template_folder="../client/templates")
CORS(app)

client = MongoClient(CONFIG.DB_URL)
db = client.xsdb
collection = db.xsdbCollection

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/get/<record_id>', methods=['GET'])
def get_by_id(record_id):
    logger.debug("GET " + record_id)
    logger.debug(request.headers)

    record = collection.find_one({'_id': ObjectId(record_id)})
    del record['_id']

    result = {}
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

    return make_response(jsonify(result), 200)


@app.route('/api/get', methods=['GET'])
def get_empty():
    logger.debug("GET Empty record")

    return make_response(jsonify(record_structure), 200)

def validate_model(record):
    return True

@app.route('/api/insert', methods=['POST'])
def insert():
    #logger.insert(request.get_json())
    logger.debug("INSERT " + str(request.get_json()))

    if validate_model(request.data):
        record = request.get_json()

        curr_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        record['createdOn'] = curr_date
        record['changedOn'] = curr_date

        record_id = collection.insert(record)

        result = collection.find_one({'_id': record_id})
        result["id"] = str(record_id)
        del result["_id"]

        return make_response(jsonify(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


@app.route('/api/update/<record_id>', methods=['POST'])
def update(record_id):
    logger.update(request.get_json())
    logger.debug("UPDATE " + str(request.get_json()))

    if validate_model(request.data):

        record = request.get_json()
        record['changedOn'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())

        collection.update({'_id': ObjectId(record_id)}, record)

        result = collection.find_one({'_id': ObjectId(record_id)})
        result["id"] = record_id
        del result["_id"]

        return make_response(jsonify(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


@app.route('/api/delete/<record_id>', methods=['DELETE'])
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

    cursor = collection.find(search_dictionary).skip(
        current_page * page_size).limit(page_size)
    result = dumps(cursor)

    return make_response(result, 200)


@app.route('/api/fields', methods=['GET'])
def get_fields():
    result = record_structure.keys()
    return make_response(jsonify(result), 200)


@app.route('/api/approve', methods=['POST'])
def approve_records():
    recordIds = json.loads(request.data)

    logger.debug("APPROVE:" + str(recordIds))

    curr_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    object_ids = map(lambda x: ObjectId(x), recordIds)
    collection.update_many({'_id': {'$in': object_ids}}, {'$set': {'status': 'Approved', 'changedOn': curr_date}})

    return make_response('success', 200)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
    
