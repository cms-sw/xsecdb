import subprocess
import pycurl
import json
from StringIO import StringIO 
from urllib import urlencode


class RequestWrapper:
    """ Wrapper for making http requests to xsdb api """

    subprocess.Popen(['cern-get-sso-cookie', '-u', 'https://cms-gen-dev.cern.ch/xsdb',
                      '-o', 'cookie.txt', '-krb'], stdout=subprocess.PIPE).communicate()[0]

    c = pycurl.Curl()
    c.setopt(pycurl.FOLLOWLOCATION, 1)
    c.setopt(pycurl.COOKIEJAR, "cookie.txt")
    c.setopt(pycurl.COOKIEFILE, "cookie.txt")
    c.setopt(pycurl.HTTPHEADER, ['Content-Type:application/json', 'Accept:application/json'])
    c.setopt(pycurl.VERBOSE, 0)

    def simple_search(self, keyval_dict):
        self._perform_post('https://cms-gen-dev.cern.ch/xsdb/api/search', json.dumps(keyval_dict))

    def adv_search(self, keyval_dict={}, page_size=20, current_page=0, orderby_field="", order_direction=1):
        order_by = {}
        
        if orderby_field != "":
            order_by[orderby_field] = order_direction

        query = {
            'search': keyval_dict,
            'pagination':{
                'pageSize': page_size,
                'currentPage': current_page
            },
            'orderBy': order_by
        }

        self._perform_post('https://cms-gen-dev.cern.ch/xsdb/api/search', json.dumps(query))

    def insert(self, keyval_dict={}):
        self._perform_post('https://cms-gen-dev.cern.ch/xsdb/api/insert', json.dumps(keyval_dict))

    def update(self, keyval_dict, record_id):
        self._perform_post('https://cms-gen-dev.cern.ch/xsdb/api/update/' + record_id, json.dumps(keyval_dict))

    def get_last_inserted_by_user(self, user_name):
        buffer = StringIO()
        self.c.setopt(self.c.URL, 'https://cms-gen-dev.cern.ch/xsdb/api/get_last_by_user/' + user_name)
        self.c.setopt(self.c.WRITEFUNCTION, buffer.write)
        self.c.perform()
        body = buffer.getvalue()
        return json.loads(body)

    def _perform_post(self, url, post_fields):
        self.c.setopt(self.c.URL, url)
        self.c.setopt(pycurl.POST, 1)
        self.c.setopt(self.c.POSTFIELDS, post_fields)
        self.c.perform()
