from flask import Flask, request, jsonify, make_response, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from time import gmtime, strftime
import json
import re

from flask_cors import CORS

from validate import validate_model
import logger
from models.record import Record
from models.fields import fields

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://WorkingVM:27017/')
db = client.xsdb
collection = db.xsdbCollection


@app.before_request
def before_request():
    print 'Before request'


@app.teardown_request
def teardown_request(exception):
    print 'after request (successful or not)'


@app.route('/', methods=['GET'])
def index():
    return 'index route'


@app.route('/api/get/<record_id>', methods=['GET'])
def get_by_id(record_id):
    logger.get(record_id)
 
    result = collection.find_one({'_id': ObjectId(record_id)})
    result["id"] = record_id

    return make_response(jsonify(result), 200)

@app.route('/api/get', methods=['GET'])
def get_by_id_():
 
    result = fields

    return make_response(jsonify(result), 200)


@app.route('/api/insert', methods=['POST'])
def insert():
    logger.insert(request.get_json())

    if validate_model(request.data):
        valid_from = strftime("%Y-%m-%d", gmtime())
        record_id = collection.insert(request.get_json())

        result = collection.find_one({'_id': record_id})
        result["id"] = str(record_id)

        return make_response(jsonify(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


@app.route('/api/update/<record_id>', methods=['PUT'])
def update(record_id):
    logger.update(request.get_json())

    if validate_model(request.data):
        record = request.get_json()

        collection.update({'_id': ObjectId(record_id)}, record)

        result = collection.find_one({'_id': ObjectId(record_id)})
        result["id"] = record_id

        return make_response(jsonify(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


@app.route('/api/delete/<record_id>', methods=['DELETE'])
def delete(record_id):
    logger.delete(record_id)

    return 'remove action'


@app.route('/api/search', methods=['POST'])
def search():
    query = json.loads(request.data)
    search_dictionary = {}

    logger.debug(query)

    for key in query.keys():
        search_dictionary[key] = re.compile(query[key], re.I)

    cursor = collection.find(search_dictionary)
    result = dumps(cursor)

    return make_response(jsonify(result), 200)


@app.route('/api/xsdb', methods=['GET'])
def get_all():
    cursor = collection.find()

    result = dumps(cursor)
    return make_response(jsonify(result), 200)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=4241)
