from request_wrapper import RequestWrapper

xsdb_request = RequestWrapper()

crossSection = raw_input("Enter the Cross Section!!!")
totalUncertainty = raw_input("Enter the total Uncertainty!!!")
shower = raw_input("Enter the hadronization (shower) tool!!!")
das = raw_input("Enter the DAS primary Dataset name!!!")
mcm = raw_input("Enter the MCM prePID!!!")
accuracy = raw_input("Enter the sample accuracy!!!")
energy = raw_input("Enter the beam energy!!!")

query = {
    "cross_section": crossSection,
    "total_uncertainty": totalUncertainty,
    "accuracy": accuracy,
    "DAS": das,
    "MCM": mcm,
    "shower": shower,
    "energy": energy
}

xsdb_request.insert(query)
