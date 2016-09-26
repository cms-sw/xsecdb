
from flask import Flask, Response, jsonify, abort, make_response, url_for
from flask import render_template, request, send_from_directory
from pymongo import MongoClient, ReturnDocument

#from pprint import pprint
import json

client = MongoClient()
db = client.dbTool
collection = db.crossSections

app = Flask(__name__)


@app.route("/")
def index():
    res = []
    for user in collection.find({"process_name": "WJetsToLNu"}):
        res.append('<br/>')
        res.append('<br/>')
        _tmp = user
        print _tmp
        print "\n"
        del(_tmp['_id'])
        res.append(_tmp)
    #   return json.dumps(pprint(res), indent=4)
    return json.dumps(res, indent=4)


    #for document in cursor:
        #return_data.append(document)
        #print(return_data)

   # cursor = db.testCollection.find_one({"process":"DYJets->LL"})
   # js = json.dumps(cursor)
   # resp = Response(js, status=200, mimetype='application/json')
   # return resp
    print 'xyz'

@app.route("/hello")
def hello():
   user = {'nickname' : 'Shawn'}
   return render_template('hello.html',
                          title='Home',
                          user=user)
@app.route("/search")
def search():
    return render_template('search.html',
                           title='Search')


if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
