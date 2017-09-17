import json
import argparse

from  wrapper.request_wrapper import RequestWrapper

xsdb_req = RequestWrapper()

parser = argparse.ArgumentParser(description='Insert xsdb record fields')
parser.add_argument('--file', dest='file_path', required=True,
                    help='json file with xsdb records')
args = parser.parse_args()

''' Get file path'''
file_path = args.file_path

''' Check file type'''
if not file_path.endswith('.json'):
    raise TypeError('File parameter must point to .json file')

with open(file_path) as data_file:    
    data = json.load(data_file)

if 'records' not in data:
    raise TypeError('json must have attribute "records"')

record_list = data.get('records')

''' Send request to API '''
for record in record_list:
    xsdb_req.insert(keyval_dict=record)
