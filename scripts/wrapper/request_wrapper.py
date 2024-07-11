#!/usr/bin/env python3
import pycurl, json, os, io

class RequestWrapper:
    """ Wrapper for making http requests to xsdb api """

    base_url = 'https://xsecdb-xsdb-official.app.cern.ch'
    api_url = os.path.join(base_url, 'api')

    if not os.path.exists("~/private/xsdbdev-cookie.txt"):
        os.system(f"auth-get-sso-cookie -u {base_url} -o ~/private/xsdbdev-cookie.txt")

    c = pycurl.Curl()
    c.setopt(c.FOLLOWLOCATION, True)
    c.setopt(c.COOKIEJAR, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
    c.setopt(c.COOKIEFILE, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
    c.setopt(c.HTTPHEADER, ['Content-Type:application/json', 'Accept:application/json'])
    c.setopt(c.VERBOSE, False)

    def simple_search(self, keyval_dict):
        self._perform_post(os.path.join(self.api_url, 'search'), json.dumps(keyval_dict))

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

        self._perform_post(os.path.join(self.api_url, 'search'), json.dumps(query))

    def insert(self, keyval_dict={}):
        self._perform_post(os.path.join(self.api_url, 'insert'), json.dumps(keyval_dict))

    def update(self, keyval_dict, record_id):
        self._perform_post(os.path.join(self.api_url, f'update/{record_id}') , json.dumps(keyval_dict))

    def get_last_inserted_by_user(self, user_name):
        buffer = io.BytesIO()
        self.c.setopt(self.c.URL, os.path.join(self.api_url, f'get_last_by_user/{user_name}'))
        self.c.setopt(self.c.WRITEFUNCTION, buffer.write)
        self.c.perform()
        body = buffer.getvalue().decode('UTF-8')
        return json.loads(body)

    def _perform_post(self, url, post_fields):
        self.c.setopt(self.c.URL, url)
        self.c.setopt(self.c.POST, True)
        self.c.setopt(self.c.POSTFIELDS, post_fields)
        self.c.perform()
