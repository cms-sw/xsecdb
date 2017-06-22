import json

from flask import Flask, render_template, make_response

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/search", methods=['POST', 'GET'])
def a_test1():
    response = make_response(json.dumps({'1':'a','2':'b'}, indent=4))
    response.headers['Content-Type'] = "application/json"
    return response

@app.route("/secondlink/<__input>", methods=['POST', 'GET'])
def a_test3(__input):
    response = make_response(json.dumps({'response': True, 'input': __input}, indent=4))
    response.headers['Content-Type'] = "application/json"
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)