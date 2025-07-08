# install frontend dependencies
cd client
npm install --legacy-peer-deps webpack-cli

# compile frontend files
npm run compile && cd ..

# install pip dependencies
pip install -r requirements.txt

# run server
echo $PWD
python main.py
