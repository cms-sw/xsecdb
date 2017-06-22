from flask_wtf import Form
from wtforms import TextField, SubmitField, SelectField, DateField

from wtforms import validators, ValidationError


class UpdateForm(Form):

    object_id = TextField("Object ID", [validators.DataRequired("Please enter the Object ID")])
#    updateKey = TextField("Update Key", [validators.DataRequired()])
    updateKey = SelectField("Update Key", choices=[("process_name","Process Name"), ("cross_section", "Cross Section"), ("total_uncertainty", "Total Uncertainty"), ("other_uncertainty", "Other Uncertainty"), ("cuts", "Cuts"), ("energy", "Energy"), ("reweighting", "Reweighting"), ("kFactor", "k-factor"), ("shower", "Shower Tool"), ("matrix_generator", "Matrix Generator"), ("contact", "Contact(s)"), ("DAS", "DAS link"), ("MCM", "MCM link"), ("refs", "References"), ("comments", "Comments"), ("equivalent_lumi", "Equivalent Lumi"), ("fraction_negative_weight", "Fraction of Negative Weights")], validators = [validators.DataRequired()])
    updateValue = TextField("Update Value", [validators.DataRequired("Please Enter the Value")])

    submit = SubmitField("Update Data")
