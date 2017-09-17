import logger
import re
from fields import fields as record_structure

re_whitespace = re.compile(r'\s+')

def validate_model(record):
    '''
        Checks for required fields and for whitespace where it is not allowed
    '''
    error_obj = {}
    
    # validate against required fields from record structure
    for key, field in record_structure.iteritems():
        validate_field_(field, key=key, value=record.get(key), error_obj=error_obj)

    logger.debug(error_obj)
    return error_obj


def validate_model_update(record_part):
    '''
        Update does not required all fields to be filled. But the passed ones
          (record_part) must satisfy the same rules
    '''
    error_obj = {}

    for key, value in record_part.iteritems():
        field = record_structure.get(key)

        validate_field_(field, key, value, error_obj)

    return error_obj

def validate_field_(field, key, value, error_obj):
    '''
        Validate sent key and value against defined field from record_structure
    '''
    if field.get('required'):
        if not value:
            error_obj[key] = 'required field'
        elif field.get('type') == 'select' and value not in field.get('options'):
            error_obj[key] = 'incorrect option selected. Allowed: ' + str(field.get('options'))

    if field.get('no_whitespace'):
        if value:
            match_value = re_whitespace.search(value)

            if match_value is not None:
                error_obj[key] = 'whitespace not allowed'
