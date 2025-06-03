import re
from flask import request
from . import logger
from .config import CONFIG
from .fields import fields as record_structure


def get_user_groups():
    '''
        get all groups user has from request header
    '''
    # adfs_group = request.headers.get('Adfs-Group')
    ## test here for new SSO
    
    groups = []

    # if adfs_group is not None:
    #     groups = adfs_group.split(";")

    # groups.append('xsdb-users')
    print(request.headers.get('X-Forwarded-User'))
    print(request.headers.get('X-Forwarded-Groups'))
    group_map = {
        'default-role':'xsdb-users',
        'admins-rule':'xsdb-admins',
        'approval-role':'xsdb-approval',
    }
    for group in request.headers.get('X-Forwarded-Groups').split(','):
        if group in group_map:
            groups.append(group_map[group])
    print(groups)
    return groups


def is_user_in_group(group_level):
    '''
        is user in specific xsdb group
    '''
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
    '''
        compile value strings in mongo search query
    '''
    for key, value in in_dic.items():
        if key != "$or" and key != "$and":
            in_dic[key] = re.compile(value, re.I)
        else:
            for dic in in_dic[key]:
                compile_regex(dic)

    return in_dic

# Get field's order attribute
def get_field_order(key):
    '''
        returns order of a record field
    '''
    if key in record_structure and 'order' in record_structure[key]:
        return record_structure[key]['order']
    else:
        logger.debug(key)
        return 1024  # return big constant

def get_ordered_field_list(record_dict):
    '''
        transform record_structure dictionary into ordered list
    '''
    result = []
    result_ = sorted(record_dict.items(), key=lambda x: get_field_order(x[0]))
    for tupl in result_:
        dic = tupl[1]
        dic['name'] = tupl[0]
        result.append(dic)

    return result

def remove_readonly_fields(record_request):
    '''
        remove read only fields from users request
    '''

    read_only_fields = [key for key, value in record_structure.items() if value.get('read_only', False)]
    
    for field_name in read_only_fields:
        record_request.pop(field_name, None)
