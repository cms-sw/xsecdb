from request_wrapper import RequestWrapper

xsdb_request = RequestWrapper()

key = input("Enter the search key that you want!!!")
value = input("Enter the search value that you would like to query!!!")

query = {}
query[key] = value

xsdb_request.simple_search(query)