import json
import argparse

from  wrapper.request_wrapper import RequestWrapper

xsdb_req = RequestWrapper()

parser = argparse.ArgumentParser(description='Update xsdb record fields')
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

''' Check if all records have id field '''
for index, record in enumerate(record_list):
    if 'id' not in record:
        raise ValueError('Record at index ' + str(index) + ' must have "id" field specified')


''' Send request to API '''
for record in record_list:
    record_id = str(record['id'])
    del record['id']

    xsdb_req.update(keyval_dict=record, record_id=record_id)
