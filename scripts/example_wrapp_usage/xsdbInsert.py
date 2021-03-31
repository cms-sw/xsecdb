from request_wrapper import RequestWrapper

xsdb_request = RequestWrapper()

crossSection = input("Enter the Cross Section!!!")
totalUncertainty = input("Enter the total Uncertainty!!!")
shower = input("Enter the hadronization (shower) tool!!!")
das = input("Enter the DAS primary Dataset name!!!")
mcm = input("Enter the MCM prePID!!!")
accuracy = input("Enter the sample accuracy!!!")
energy = input("Enter the beam energy!!!")

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
