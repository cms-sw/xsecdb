from server.api import app

if __name__ == "__main__":
    app.run(debug=True, host='172.30.54.101', port=5000, threaded=True)
