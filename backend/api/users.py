from flask import request, jsonify
from flask.views import MethodView
from flask.ext.login import current_user, login_user
from sqlalchemy import and_

from backend import db, app
from backend.database.models import User, Presence
from backend.api.sessionauth import current_user_props, hash_password
import validation



def create_new_user(username, password, email, first_name, last_name):
    new_user = User(username = username,
        password =      hash_password(password),
        email =         email,
        first_name =    first_name,
        last_name =     last_name,
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user
# changes the user data in the database, changing only the named parameters
def change_user_data(username, password=None, email=None, first_name=None, last_name=None):
    user = User.query.filter(username==username).first()
 
    if user is None:
        return jsonify(**{'success': False, 'error': 'no username specified'}), 401
    
    # update user obj with the data passed to the function
    if first_name is not None:
        user.first_name = first_name
    if last_name is not None:
        user.last_name = last_name

    # add the current user to the data to be committed to the database
    db.session.add(user)
    db.session.commit()
    return jsonify(**{'success': True})

class ChangeDetailsAPI(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            request_data = {}

        if('username' in request_data and ('password' in request_data 
                                    or 'first_name' in request_data 
                                    or 'last_name' in request_data 
                                    or 'email' in request_data)):
            # at least one entry is changed
            username = request_data['username']
            password = None
            first_name = None
            last_name = None
            email = None

            if 'password' in request_data and len(request_data['password']) != 0:
                password = request_data['password']
            if 'first_name' in request_data and len(request_data['first_name']) != 0:
                first_name = request_data['first_name']
            if 'last_name' in request_data and len(request_data['last_name']) != 0:
                last_name = request_data['last_name']
            if 'email' in request_data and len(request_data['email']) != 0:
                email = request_data['email']
            # pass parsed parameters to the database method
            return change_user_data(username, password, email, first_name, last_name);



class RegisterAPI(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            request_data = {}

        errors, cleaned_data = self.validate_data(request_data)

        if errors:
            return jsonify(**{'success': False, 'errors': errors}), 422

        user = create_new_user(**cleaned_data)

        new_presence = Presence(user_id = user.id)
        db.session.add(new_presence)
        db.session.commit()

        login_user(user)

        return jsonify(**{'success': True, 'authenticated': current_user.is_authenticated(), 'user': current_user_props()})

    def validate_data(self, request_data):
        errors = {}
        cleaned_data = {}

        props = ['username', 'password', 'email', 'first_name', 'last_name']

        # Check missing arguments
        missing = validation.missing_props(props, request_data)
        if missing:
            errors['missing'] = {prop: prop + ' is missing' for prop in missing}

        # Check type of arugments
        bad_types = validation.bad_types({prop: str for prop in props}, request_data)
        if bad_types:
            errors['invalid_types'] = {prop: prop + ' has an invalid type' for prop in bad_types}

        # Check for valid lengths
        bad_lengths = validation.bad_lengths({
            'username':     (5, 20), 
            'password':     (6, 40), 
            'email':        (None, 60), 
            'first_name':   (1, 40), 
            'last_name':    (1, 40)
        }, request_data)
        if bad_lengths:
            errors['invalid_lengths'] = {prop: prop + ' has an invalid length' for prop in bad_lengths}

        # Check if valid email
        if ('email' in request_data) and (not validation.valid_email(request_data['email'])):
            errors['invalid_email'] = 'email is not valid'

        # Check if valid password
        if ('password' in request_data) and (not validation.valid_password(request_data['password'])):
            errors['weak_password'] = 'password did not meet minimum strength requirements'

        # Check uniqueness
        if User.query.filter_by(username=request_data['username']).first():
            errors['username_taken'] = request_data['username']
			
        if User.query.filter_by(email=request_data['email']).first():
            errors['email_taken'] = request_data['email']

		#check if valid user name
        if ('username' in request_data) and (not validation.valid_username(request_data['username'])):
		    errors['invalid_username'] = 'username contained restricted symbol' 

        # Quick and easy dict comprehension to convert all data to strings
        cleaned_data = {prop: str(request_data[prop]) for prop in props if prop in request_data}

        return errors, cleaned_data

class PasswordChangeApi(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': "none" }), 401
        if('user' in request_data and 'password' in request_data and 'tok' in request_data):
            data = {'username': request_data['user'], 'verification': request_data['tok']}
            user = User.query.filter_by(**data).first()
 
            if user is None:
                return jsonify(**{'success': False}), 401
            user.password = hash_password(request_data['password'])   
            db.session.add(user)
            db.session.commit()
            return jsonify(**{'success': True})

        return jsonify(**{'success': False}), 401

class VerifyUserAPi(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': "none" }), 401
        if('user' in request_data and 'tok' in request_data):
            data = {'username': request_data['user'], 'verification': request_data['tok']}
            user = User.query.filter_by(**data).first()
 
            if user is None:
                return jsonify(**{'success': False, 'user': request_data['user'],'key': request_data['tok']}), 401
            user.new_user = 0        
            db.session.add(user)
            db.session.commit()
            return jsonify(**{'success': True})

        return jsonify(**{'success': False}), 401

change_details_view = ChangeDetailsAPI.as_view('change_details')
register_view = RegisterAPI.as_view('register_api')
password_change_view = PasswordChangeApi.as_view('password_change_api')
verify_user_view = VerifyUserAPi.as_view('verify_user_api')
app.add_url_rule('/api/users/change_details/', view_func=change_details_view, methods=['POST'])
app.add_url_rule('/api/users/register/', view_func=register_view, methods=['POST'])
app.add_url_rule('/api/users/changepass/', view_func=password_change_view, methods=['POST'])
app.add_url_rule('/api/users/verifyuser/', view_func=verify_user_view, methods=['POST'])