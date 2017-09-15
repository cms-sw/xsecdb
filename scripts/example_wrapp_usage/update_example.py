from request_wrapper import RequestWrapper

xsdb_req = RequestWrapper()

""" 4. UPDATE RECORD """

query = {
    "process_name": "testing update using script",
    "status": "approved",
    "isValid": "False",
    "cross_section": "xs",
    "total_uncertainty": "0",
    "other_uncertainty": "",
    "accuracy": "unknown",
    "contact": "",
    "DAS": "testDAS",
    "MCM": "tetsMCM",
    "equivalent_lumi": "",
    "fraction_negative_weight": "none",
    "reweighting": "",
    "cuts": "",
    "kFactor": "",
    "shower": "none",
    "matrix_generator": "none",
    "energy": "6",
    "comments": "",
    "refs": "",
    "modifiedOn": "2017-08-23 13:47:17",
    "createdOn": "2017-08-18 14:17:50",
    "modifiedBy": "",
    "approvedBy": "",
    "createdBy": "szaleski"
}

xsdb_req.update(keyval_dict=query, record_id="5996f70ef20ea557af15bb06")

