import re
import logger
from flask import request
from config import CONFIG
from models.fields import fields as record_structure


def get_user_groups():
    adfs_group = request.headers.get('Adfs-Group')
    groups = []

    if adfs_group is not None:
        groups = adfs_group.split(";")

    return groups


def is_user_in_group(group_level):
    # return True
    # Get minimum required groups
    required_groups = CONFIG.USER_ROLES[group_level:]
    # Get all groups user has
    groups = get_user_groups()
    # Check if user has atleast minimum required role
    result = any(role in required_groups for role in groups)
    return result

# Recursively compile all values into regex


def compile_regex(in_dic):
    for key, value in in_dic.iteritems():
        if key != "$or" and key != "$and":
            in_dic[key] = re.compile(value, re.I)
        else:
            for dic in in_dic[key]:
                compile_regex(dic)

    return in_dic

# Get fields order attribute
def get_field_order(key):
    if 'order' in record_structure[key]:
        return record_structure[key]['order']
    else:
        logger.debug(key)
        return 1024  # return big constant

def get_ordered_field_list(record_dict):
    logger.debug(record_dict)
    result = []
    result_ = sorted(record_dict.iteritems(), key=lambda x: get_field_order(x[0]))
    for tupl in result_:
        dic = tupl[1]
        dic['name'] = tupl[0]
        result.append(dic)

    return result
