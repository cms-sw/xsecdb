from request_wrapper import RequestWrapper

xsdb_req = RequestWrapper()

""" -- 1. SIMPLE QUERY - passing only search fields -- """

query = {'matrix_generator': 'Herw.*', 'energy': '[67]{1}'}
xsdb_req.simple_search(query)

"""
    More advanced mongo query
        same as querying:
            energy=[67]{1} && ( matrix_generator=Herw.* || createdBy=^krepecka$ )
        in GUI
"""
query = {
    '$and': [
        {'energy': '[67]{1}'},
        {
            '$or': [
                {'matrix_generator': 'Herw.*'},
                {'createdBy': '^krepecka$'}
            ]
        }
    ]
}

xsdb_req.simple_search(query)

""" -- 2. ADVANCED SEARCH: with pagination and ordering -- """

query = {'energy': '6'}
xsdb_req.adv_search(keyval_dict=query, page_size=13,
        current_page=0, orderby_field="createdOn", order_direction=-1)

""" Same query, but getting data page by page """
for page_num in range(0, 3):
    xsdb_req.adv_search(keyval_dict=query, page_size=13,
        current_page=page_num, orderby_field="createdOn", order_direction=-1)
