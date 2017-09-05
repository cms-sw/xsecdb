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
        'order': 25
    },
    "MCM": {
        'title': "MCM",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': True,
        'order': 24
    },
    "refs": {
        'title': "refs",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 23
    },
    "accuracy": {
        'title': "accuracy",
        'type': "select",
        'options': ["LO", "NLO", "NNLO", "NNNLO", "unknown"],
        'value': "unknown",
        'disabled': False,
        'required': True,
        'order': 22
    },
    "contact": {
        'title': "contact",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 21
    },
    "comments": {
        'title': "comments",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 20
    },
    "cuts": {
        'title': "cuts",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 19
    },
    "cross_section": {
        'title': "cross_section",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': True,
        'order': 1
    },
    "equivalent_lumi": {
        'title': "equivalent_lumi",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 18
    },
    "energy": {
        'title': "energy",
        'type': "select",
        'options': ["6", "7", "8", "13", "14"],
        'value': "6",
        'disabled': False,
        'required': True,
        'order': 17
    },
    "isValid": {
        'title': "Is Valid",
        'type': "checkbox",
        'value': False,
        'disabled': False,
        'required': False,
        'order': 16
    },
    "fraction_negative_weight": {
        'title': "fraction_negative_weight",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 15
    },
    "matrix_generator": {
        'title': "Matrix generator",
        'type': "select",
        'options': ["none", "Sherpa", "Herwig++", "Herwig7", "Powheg", "Madgraph"],
        'value': "none",
        'disabled': False,
        'required': False,
        'order': 14
    },
    "kFactor": {
        'title': "kFactor",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 13
    },
    "other_uncertainty": {
        'title': "Other uncertainity",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 12
    },
    "process_name": {
        'title': "Process name",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 11
    },
    "reweighting": {
        'title': "Reweighting",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': False,
        'order': 10
    },
    "shower": {
        'title': "Shower",
        'type': "select",
        'options': ["none", "Pythia8", "Sherpa", "Herwig++", "Herwig7", "Powheg", "Madgraph"],
        'value': "none",
        'disabled': False,
        'required': True,
        'order': 9
    },
    "total_uncertainty": {
        'title': "Total uncertainty",
        'type': "text",
        'value': "",
        'disabled': False,
        'required': True,
        'order': 8
    },
    "createdOn": {
        'title': "Created on",
        'type': "date",
        'value': "",
        'disabled': True,
        'required': False,
        'order': 7
    },
    "modifiedOn": {
        'title': "Modified on",
        'type': "date",
        'value': "",
        'disabled': True,
        'required': False,
        'order': 6
    },
    "createdBy": {
        'title': "Created by",
        'type': "text",
        'value': "",
        'disabled': True,
        'required': False,
        'order': 5
    },
    "modifiedBy": {
        'title': "Modified by",
        'type': "text",
        'value': "",
        'disabled': True,
        'required': False,
        'order': 4
    },
    "approvedBy": {
        'title': "Approved by",
        'type': "text",
        'value': "",
        'disabled': True,
        'required': False,
        'order': 2
    },
    "status": {
        'title': "status",
        'type': "select",
        'options': ["new", "approved"],
        'value': "new",
        'disabled': True,
        'required': False,
        'order': 3
    },
}
