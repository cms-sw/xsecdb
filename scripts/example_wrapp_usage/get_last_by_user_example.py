from request_wrapper import RequestWrapper

xsdb_req = RequestWrapper()

user_name = 'cmsxsec'
record = xsdb_req.get_last_inserted_by_user(user_name)

print('Last record by user [', user_name, '] inserted at [' ,record['createdOn'], ']')
