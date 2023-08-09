# install frontend dependencies
cd client && npm install && npm install --save history
# compile frontend files
npm run compile && cd ..

# run server
python main.py
