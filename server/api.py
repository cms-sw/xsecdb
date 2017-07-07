from flask import Flask

app = Flask(__name__)

@app.before_request
def before_request():
    print 'Before request'

@app.teardown_request
def teardown_request(exception):
    print 'after request (successful or not)'



@app.route('/', methods=['GET'])
def index():
    return 'index route'

@app.route('/api/insert', methods=['POST'])
def insert():
    return 'insert action'

@app.route('/api/update', methods=['POST'])
def update():
    return 'update action'

@app.route('/api/remove', methods=['POST'])
def delete():
    return 'remove action'

@app.route('/api/search/<key>/<value>', methods=['GET'])
def search(key, value):
    return 'search action'

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




