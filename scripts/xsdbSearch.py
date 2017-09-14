from request_wrapper import RequestWrapper

xsdb_request = RequestWrapper()

key = raw_input("Enter the search key that you want!!!")
value = raw_input("Enter the search value that you would like to query!!!")

query = {}
query[key] = value

xsdb_request.simple_search(query)