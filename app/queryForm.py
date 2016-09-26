from flask_wtf import Form
from wtforms import TextField, SubmitField, SelectField, DateField, StringField

from wtforms import validators, ValidationError

from datetime import datetime

#now = str(int(time.time()))

#today.strftime('%Y-%m-%d')

class QueryForm(Form):

    key = SelectField("Search Key",choices=[("process_name","Process Name"),("cross_section","Cross Section"),("total_uncertainty","Total Uncertainty"),("other_uncertainty","Other Uncertainty"),("cuts","Cuts"),("reweighting","Reweighting"),("kFactor","k-Factor"),("shower","Parton Shower Tool"),("matrix_generator","Matrix Generator"),("accuracy","Accuracy"),("contact","Contact(s)"),("DAS","DAS link"),("MCM","MCM link"),("refs","References")],validators = [validators.DataRequired()])
    value = TextField("Search Value", [validators.DataRequired("Please Enter References")])

    submit = SubmitField("Query Data")
