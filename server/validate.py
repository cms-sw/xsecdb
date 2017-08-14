import logger
from models.fields import fields as record_structure

def validate_model(record):
    missing_keys = []
    # validate against required fiels from record structure
    for key, field in record_structure.iteritems():
        if(field['required']):
            value = record.get(key)

            if not value:
                missing_keys.append(key)
            elif field['type'] == 'select' and value not in field['options']:
                missing_keys.append(key)
            
    logger.debug(missing_keys)
    return missing_keys