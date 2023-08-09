from server.api import app

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000, threaded=True)
