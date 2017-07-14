from flask import Flask, request, jsonify, make_response, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from time import gmtime, strftime
import json

from flask_cors import CORS

from validate import validate_model
from models.record import Record


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

@app.route('/api/xsdb', methods=['POST'])
def insert():

    if validate_model(request.data):

        valid_from = strftime("%Y-%m-%d", gmtime())
        # record = Record(request.get_json(), valid_from, "present", "YES")
        # record_id = collection.insert(record.__dict__)
        record_id = collection.insert(request.get_json())

        result = collection.find_one({'_id': record_id})
        result["id"]  = str(record_id)
        del result["_id"]

        return make_response(jsonify(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


@app.route('/api/xsdb/<record_id>', methods=['PUT'])
def update(record_id):
    if validate_model(request.data):
        record = request.get_json()
        del record["_id"]
        
        collection.update({'_id': ObjectId(record_id)}, record)
        
        result = collection.find_one({'_id': ObjectId(record_id)})
        print result
        result["id"]  = record_id
        del result["_id"]

        return make_response(jsonify(result), 201)
    else:
        return {'error': 'Incorrect data format'}, 400


@app.route('/api/xsdb/<record_id>', methods=['DELETE'])
def delete(record_id):
    return 'remove action'


@app.route('/api/search', methods=['POST'])
def search():
    query = json.loads(request.data)
    print type(query)

    cursor = collection.find(query)
    print cursor
    result = dumps(cursor)

    print result
    return make_response(jsonify(result), 200)

@app.route('/api/xsdb', methods=['GET'])
def get_all():
    cursor = collection.find()

    result = dumps(cursor)
    print result
    return make_response(jsonify(result), 200)
    # return make_response(jsonify(records), 200)

# STATIC PAGES #


@app.route('/query', methods=['GET'])
def query_page():
    return 'query page'


@app.route('/insert', methods=['GET'])
def insert_page():
    return 'insert page'


@app.route('/update', methods=['GET'])
def update_page():
    return 'update page'


@app.route('/remove', methods=['GET'])
def remove_page():
    return 'remove page'


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=4241)
