""" Defines structure of the record

    Property purpose:
        title - used in record edit form for a label
        type - used to determine what type of field to render in edit form
        options - only for select type field
        value - default value. Field is filled with it if no other value is present
        disabled - True means that field is rendered as disabled in edit form
        required - True means that it is not allowed to save record without this field or with this field being empty

    Property types:
        title: string
        type: one of [text, number, select, checkbox, date]
        options: [string]
        value: string
        disabled: boolean
        required: boolean
"""

fields = {
    "DAS": {
        'title': "DAS",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': True,
    },
    "MCM": {
        'title': "MCM",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': True,
    },
    "refs": {
        'title': "refs",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
    },
    "accuracy": {
        'title': "accuracy",
        'type': "select",
        'options': ["LO", "NLO", "NNLO", "NNNLO", "unknown"],
        'value': "unknown",
        'disabled': False,
        'required': True
    },
    "contact": {
        'title': "contact",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "comments": {
        'title': "comments",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "cuts": {
        'title': "cuts",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "cross_section": {
        'title': "cross_section",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': True
    },
    "equivalent_lumi": {
        'title': "equivalent_lumi",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "energy": {
        'title': "energy",
        'type': "select",
        'options': ["6", "7", "8", "13", "14"],
        'value': "6",
        'disabled': False,
        'required': True
    },
    "isValid": {
        'title': "Is Valid",
        'type': "checkbox",
        'value': False,
        'disabled': False,
        'required': False
    },
    "fraction_negative_weight": {
        'title': "fraction_negative_weight",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "matrix_generator": {
        'title': "Matrix generator",
        'type': "select",
        'options': ["none", "none", "Sherpa", "Herwig++", "Herwig7", "Powheg", "Madgraph"],
        'value': "none",
        'disabled': False,
        'required': False
    },
    "kFactor": {
        'title': "kFactor",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "other_uncertainty": {
        'title': "Other uncertainity",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "process_name": {
        'title': "Process name",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "reweighting": {
        'title': "Reweighting",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False
    },
    "shower": {
        'title': "Shower",
        'type': "select",
        'options': ["none", "Pythia8", "Sherpa", "Herwig++", "Herwig7", "Powheg", "Madgraph"],
        'value': "none",
        'disabled': False,
        'required': True
    },
    "total_uncertainty": {
        'title': "Total uncertainty",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': True
    },
    "createdOn": {
        'title': "Created on",
        'type': "date",
        'value': "",
        'disabled': True,
        'required': False
    },
    "modifiedOn": {
        'title': "Modified on",
        'type': "date",
        'value': "",
        'disabled': True,
        'required': False
    },
    "createdBy": {
        'title': "Created by",
        'type': "text",
        'value': "",
        'disabled': True,
        'required': False
    },
    "modifiedBy": {
        'title': "Modified by",
        'type': "text",
        'value': "",
        'disabled': True,
        'required': False
    },
    "approvedBy": {
        'title': "Approved by",
        'type': "text",
        'value': "",
        'disabled': True,
        'required': False
    },
    "status": {
        'title': "status",
        'type': "select",
        'options': ["new", "approved"],
        'value': "new",
        'disabled': True,
        'required': False
    },
}
