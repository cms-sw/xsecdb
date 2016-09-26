from flask_wtf import Form
from wtforms import TextField, SubmitField, SelectField, DateField, StringField

from wtforms import validators, ValidationError

from datetime import datetime

#now = str(int(time.time()))

#today.strftime('%Y-%m-%d')

class InsertForm(Form):

    process_name = TextField("Process Name", [validators.DataRequired("Please Enter the Process Name!")])
    cross_section = TextField("Cross Section", [validators.DataRequired("Please Enter the Cross Section Value")])
    total_uncertainty = TextField("Total Uncertainty", [validators.DataRequired("Please Enter the Total Uncertainty")])
    other_uncertainty = TextField("Other Uncertainty", [validators.DataRequired("Please Enter the Other Uncertainty")])
    cuts = TextField("Cuts", [validators.DataRequired("Please Enter the Cuts")])
    reweighting = TextField("Reweighting", [validators.DataRequired("Please Enter the Reqeighting")])
    kFactor = TextField("k-Factor", [validators.DataRequired("Please Enter the Reweighting")])
    shower = SelectField("Shower Tool",choices=[("pythia8","Pythia8"),("sherpa","Sherpa")],validators = [validators.DataRequired()])
    matrix_generator = SelectField("Matrix Generator",choices=[("powheg","Powheg"),("madgraph","Madgraph")],validators = [validators.DataRequired()])
    accuracy = SelectField("Accuracy",choices=[("LO","LO"),("NLO","NLO"),("NNLO","NNLO"),("NNNLO","NNNLO"),("unknown","unknown")],validators = [validators.DataRequired()])
    contact = TextField("Contact", [validators.DataRequired("Please Enter the Contact")])
    DAS = TextField("DAS Link", [validators.DataRequired("Please Enter the DAS Primary Dataset Name")])
    MCM = TextField("MCM Link", [validators.DataRequired("Please Enter the MCM prePID")])
    refs = TextField("References", [validators.DataRequired("Please Enter References")])

    submit = SubmitField("Insert Data")
