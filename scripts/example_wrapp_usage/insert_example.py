from request_wrapper import RequestWrapper

xsdb_req = RequestWrapper()

""" -- INSERT NEW RECORD -- """

query_incorrect = {'energy': '6'}
xsdb_req.insert(query_incorrect)  # It's missing required fields - http response is an error

query = {
    "cross_section": "testing insert from script",
    "total_uncertainty": "total",
    "accuracy": "unknown",
    "DAS": "KK",
    "MCM": "asd",
    "shower": "none",
    "matrix_generator": "none",
    "energy": "6"
}

xsdb_req.insert(query)