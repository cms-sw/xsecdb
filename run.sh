# install frontend dependencies
cd client && npm install && npm install --save history
# compile frontend files
npm run compile && cd ..

# create logs directory if doesn't exist
mkdir -p logs

# run virtual env
. ../venv/bin/activate
# install pip dependencies
pip install -r requirements.txt
# run server
python main.py

