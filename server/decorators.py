from functools import wraps
from flask import request, make_response, jsonify
from utils import get_user_groups, is_user_in_group

# Decorator wrapped into function which accepts required e-group level
def auth_user_group(group_level):
    def decorated_function(f):
        @wraps(f)
        def func_wrapper(*args, **kwargs):

            if not is_user_in_group(group_level):
                return make_response(jsonify({'error': 'not allowed'}), 403)

            return f(*args, **kwargs)
        return func_wrapper
    return decorated_function
