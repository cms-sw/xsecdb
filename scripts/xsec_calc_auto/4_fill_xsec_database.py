#!/usr/bin/env python3
import os


def insert_xsdb_records(json_dir='./json', log_dir='./insert_xsdb_logs'):
    os.system(f'rm -rf {log_dir}')
    os.makedirs(log_dir, exist_ok=True)
    for filename in os.listdir(json_dir):
        if not filename.endswith(".json"): 
            continue
        process_name = filename.split(".")[0]
        print(process_name)
        
        json_file = os.path.join(json_dir, filename)
        insert_xsdb_log = f'./{log_dir}/{process_name}.log'
        if os.path.exists(insert_xsdb_log):
            with open(insert_xsdb_log, 'r', encoding='utf-8') as f:
                content = f.read()
            if '{"status": "new"' in content: 
                print('filldb report existing and valid, skipping dataset')
                continue

        with open(json_file, 'r', encoding='utf-8') as f:
            content = f.read()
        if '$' in content:
            print("json corrupted, skipping")
            continue
        else:
            print("json OK, uploading")
            os.system(f"python3 ../xsdb_insert_file.py --file {json_file} 2>&1 | tee {insert_xsdb_log}")


if __name__ == "__main__":
    insert_xsdb_records(json_dir='./json', log_dir='./insert_xsdb_logs')
