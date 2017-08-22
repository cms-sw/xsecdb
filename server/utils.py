from flask import request
from config import CONFIG
import re
import logger

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
        logger.debug("key " + str(key) + " value "+ str(value))
        if key != "$or" and key != "$and":
            in_dic[key] = re.compile(value, re.I)
        else:
            for dic in in_dic[key]:
                compile_regex(dic)

    return in_dic