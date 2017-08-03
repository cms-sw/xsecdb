# compile frontend files
cd client && npm install && npm run compile && cd ..

# create logs directory if doesn't exist
mkdir -p logs

# run virtual env
. ../venv/bin/activate
# install pip dependencies
pip install -r requirements.txt
# run server
python server/api.py
