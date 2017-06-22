from flask_wtf import Form
from wtforms import TextField, SubmitField, SelectField, DateField, StringField

from wtforms import validators, ValidationError

from datetime import datetime

#now = str(int(time.time()))

#today.strftime('%Y-%m-%d')

class InsertForm(Form):

    process_name = TextField("Process Name", [validators.DataRequired("Please Enter the Process Name!")])
    cross_section = TextField("Cross Section [pb]", [validators.DataRequired("Please Enter the Cross Section Value")])
    total_uncertainty = TextField("Total Uncertainty", [validators.DataRequired("Please Enter the Total Uncertainty")])
    other_uncertainty = TextField("Other Uncertainty", [validators.DataRequired("Please Enter the Other Uncertainty")])
    cuts = TextField("Cuts", [validators.DataRequired("Please Enter the Cuts")])
    energy = SelectField("Total Beam Energy [TeV]", choices=[("none", "none"), ("6", "6"), ("7", "7"), ("8", "8"), ("13", "13"), ("14", "14")], validators=[validators.DataRequired("Please enter the beam energy")])
#    shower = SelectField("Shower Tool",choices=[("none", "none"),("pythia8","Pythia8"),("sherpa","Sherpa")],validators = [validators.DataRequired()])
    reweighting = TextField("Reweighting", [validators.DataRequired("Please Enter the Reqeighting")])
    kFactor = TextField("k-Factor", [validators.DataRequired("Please Enter the Reweighting")])
    shower = SelectField("Shower Tool",choices=[("none", "none"),("pythia","Pythia"),("pythia6","Pythia6"),("pythia8","Pythia8"),("sherpa","Sherpa"),("herwig","Herwig"),("herwig7","Herwig7"),("herwig++","Herwig++")],validators = [validators.DataRequired()])
    matrix_generator = SelectField("Matrix Generator",choices=[("none", "none"),("pythia8","Pythia8"),("sherpa","Sherpa"),("herwig++","Herwig++"),("herwig7","Herwig7"),("powheg","Powheg"),("madgraph","Madgraph")],validators = [validators.DataRequired()])
    accuracy = SelectField("Accuracy",choices=[("LO","LO"),("NLO","NLO"),("NNLO","NNLO"),("NNNLO","NNNLO"),("unknown","unknown")],validators = [validators.DataRequired()])
    contact = TextField("Contact", [validators.DataRequired("Please Enter the Contact")])
    DAS = TextField("DAS Primary Name", [validators.DataRequired("Please Enter the DAS Primary Dataset Name")])
    MCM = TextField("MCM GEN-SIM prepid", [validators.DataRequired("Please Enter the MCM prePID")])
    refs = TextField("References", [validators.DataRequired("Please Enter References")])
    comments = TextField("Comments", [validators.DataRequired("Please Eneter Comments")])
    equivalent_lumi = TextField("Equivalent Lumi", [validators.DataRequired("Please Enter Equivalent Lumi")])
    fraction_negative_weight = TextField("Fraction of Negative Weights", [validators.DataRequired("Please Enter Fraction of Negative Weights")])

    submit = SubmitField("Insert Data")
