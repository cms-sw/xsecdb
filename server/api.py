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
from validate import validate_model
from models.record import Record
from models.fields import fields as record_structure

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://WorkingVM:27017/')
db = client.xsdb
collection = db.xsdbCollection

@app.route('/', methods=['GET'])
def index():
    # render public folder contents
    return 'index route'

@app.route('/api/get/<record_id>', methods=['GET'])
def get_by_id(record_id):
    logger.get(record_id)

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
            result[key] = dic_[key]
            result[key]['value'] = value
        else:
            result[key] = {
                'title': key,
                'type': 'text',
                'value': value
            }
    
    for key in dic_:
        if key not in result:
            result[key] = dic_[key]

    return make_response(jsonify(result), 200)

@app.route('/api/get', methods=['GET'])
def get_empty():
    logger.get("Empty record")

    return make_response(jsonify(record_structure), 200)


@app.route('/api/insert', methods=['POST'])
def insert():
    logger.insert(request.get_json())

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
    logger.delete(record_id)

    collection.delete_one({'_id': ObjectId(record_id)})

    return make_response('success', 200)


@app.route('/api/search', methods=['POST'])
def search():
    json_data = json.loads(request.data)
    logger.search(json_data)

    query = json_data['search']
    page_size = json_data['pagination']['pageSize']
    current_page = json_data['pagination']['currentPage']
    search_dictionary = {}

    for key in query:
        search_dictionary[key] = re.compile(query[key], re.I)

    cursor = collection.find(search_dictionary).skip(current_page * page_size).limit(page_size)
    result = dumps(cursor)

    return make_response(result, 200)

@app.route('/api/fields', methods=['GET'])
def get_fields():
    result = record_structure.keys()
    return make_response(jsonify(result), 200)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=4241, threaded=True)
