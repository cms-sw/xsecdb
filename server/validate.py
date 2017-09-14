import logger
import re
from fields import fields as record_structure


def validate_model(record):
    '''
        Checks for required fields and for whitespace where it is not allowed
    '''
    error_obj = {}
    re_whitespace = re.compile(r'\s+')
    # validate against required fields from record structure
    for key, field in record_structure.iteritems():
        if(field.get('required')):
            value = record.get(key)

            if not value:
                error_obj[key] = 'required field'
                # error_fields.append({key: })
            elif field.get('type') == 'select' and value not in field['options']:
                error_obj[key] = 'incorrect option selected'
                # error_fields.append({key: })                

        if(field.get('no_whitespace')):
            value = record.get(key)
            match_value = re_whitespace.search(value)

            if match_value is not None:
                error_obj[key] = 'whitespace not allowed'
                # error_fields.append({key: })

            
    logger.debug(error_obj)
    return error_obj