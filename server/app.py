#!/usr/bin/env python3

import ipdb

from flask import Flask, make_response, jsonify, request, session, g
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from models import db, University, Thread, User, Post

app = Flask(__name__)
app.secret_key = 'CactusCactus'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///colleges.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

bcrypt = Bcrypt(app)

migrate = Migrate(app, db)

db.init_app(app)

CORS(app)

api = Api(app)

class Universities(Resource):

    def get(self):
        universities = [university.to_dict() for university in University.query.all()]
        return make_response(jsonify(universities), 200)
    
    def post(self):
        data = request.get_json()
        university = University(
            university_name=data['university_name'],
            university_color=data['university_color'])
        db.session.add(university)
        db.session.commit()
        return jsonify({'message': 'University created!'}, 201)

api.add_resource(Universities, "/universities")

class UniversityByID(Resource):

    def get(self, id):
        university = University.query.filter_by(id=id).first()
        return make_response(jsonify(university.to_dict()), 200)

api.add_resource(UniversityByID, "/universities/<int:id>")

class Threads(Resource):
    def get(self):
        threads = [thread.to_dict() for thread in Thread.query.all()]
        return make_response(jsonify(threads), 200)
    
api.add_resource(Threads, "/threads")

class ThreadsByUniversity(Resource):
    def get(self, schoolname):
        
        university = University.query.filter_by(university_name=schoolname).first()
        if not university:
            return {'errors': "university not found"}, 404
        threads = [thread.to_dict() for thread in university.threads]
        # ipdb.set_trace()
        return make_response(jsonify(threads), 200)

    def post(self, schoolname):
        data = request.get_json()
        
        university = University.query.filter_by(university_name=schoolname).first()
        new_thread = Thread(
            thread_title=data['thread_title'],
            thread_university_id=university.id
        )

        db.session.add(new_thread)
        db.session.commit()
        return jsonify({'message': 'Thread created!'}, 201)

api.add_resource(ThreadsByUniversity, "/<string:schoolname>/threads")

class ThreadsByUniByID(Resource):

    def get(self, schoolname, id):
        university = University.query.filter_by(university_name=schoolname).first()
        thread = Thread.query.filter_by(id=id, thread_university_id=university.id).first()

        return make_response(jsonify(thread.to_dict()), 200)
    
    def patch(self, schoolname, id):
        university = University.query.filter_by(university_name=schoolname).first()
        thread = Thread.query.filter_by(id=id, thread_university_id=university.id).first()
        
        data = request.get_json()
        for attr in data:
            setattr(thread, attr, data[attr])
        db.session.commit()
        response_body = thread.to_dict()
        return make_response(jsonify(response_body), 202)

    def delete(self, schoolname, id):
        university = University.query.filter_by(university_name=schoolname).first()
        thread = Thread.query.filter_by(id=id, thread_university_id=university.id).first()

        db.session.delete(thread)
        db.session.commit()
        return jsonify({'message': 'Thread deleted successfully'}, 204)

api.add_resource(ThreadsByUniByID, "/<string:schoolname>/threads/<int:id>")

class Posts(Resource):
    def get(self):
        posts = [post.to_dict() for post in Post.query.all()]
        return make_response(jsonify(posts), 200)
    
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(id=data['post_user_id']).first().to_dict()

        new_post = Post(
            post_user_id=user['id'], 
            post_thread_id=data['post_thread_id'], 
            post_content=data['post_content']
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'message': 'Post created!'}, 201)
    
api.add_resource(Posts, "/posts")

class PostByUniThread(Resource):
    def get(self, schoolname, threadId):
        thread = Thread.query.filter_by(id=threadId).first()

        if not thread or thread.university.university_name != schoolname:
            return jsonify({'message': 'Thread not found'}), 404

        posts = [post.to_dict() for post in thread.posts]

        return make_response(jsonify(posts), 200)

    def post(self, schoolname, threadId):
        thread = Thread.query.filter_by(id=threadId).first()

        if not thread or thread.university.university_name != schoolname:
            return jsonify({'message': 'Thread not found'}), 404

        user_id = session["user_id"] 
        
        user = User.query.filter_by(id=user_id).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()
        
        new_post = Post(
            post_content=data['post_content'],
            post_thread_id=thread.id,
            post_user_id=user.id
        )

        db.session.add(new_post)
        db.session.commit()

        return jsonify({'message': 'Post created!'}, 201)

api.add_resource(PostByUniThread, "/<string:schoolname>/threads/<int:threadId>/posts")

class PostByUniByID(Resource):

    def get(self, schoolname, threadId, id):
        university = University.query.filter_by(university_name=schoolname).first()
        if not university:
            return {'errors': "University not found"}, 404

        thread = Thread.query.filter_by(id=threadId, thread_university_id=university.id).first()
        if not thread:
            return {'errors': "Thread not found"}, 404

        post = Post.query.filter_by(id=id, post_thread_id=thread.id).first()
        if not post:
            return {'errors': "Post not found"}, 404

        return make_response(jsonify(post.to_dict()) if post else {'errors': "Post not found"}, 200)

    def patch(self, schoolname, threadId, id):
        university = University.query.filter_by(university_name=schoolname).first()
        thread = Thread.query.filter_by(id=threadId, thread_university_id=university.id).first()
        post = Post.query.filter_by(id=id, post_thread_id=thread.id).first()
        
        data = request.get_json()
        for attr in data:
            setattr(post, attr, data[attr])
        db.session.commit()
        response_body = post.to_dict()
        return make_response(jsonify(response_body), 202)

    def delete(self, schoolname, threadId, id):
        university = University.query.filter_by(university_name=schoolname).first()
        thread = Thread.query.filter_by(id=threadId, thread_university_id=university.id).first()
        post = Post.query.filter_by(id=id, post_thread_id=thread.id).first()

        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'})

api.add_resource(PostByUniByID, "/<string:schoolname>/threads/<int:threadId>/posts/<int:id>")

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)

api.add_resource(Users, "/users")
# USER SIGNUP #

def get_current_user():
    return User.query.where( User.id == session.get("user_id") ).first()

def logged_in():
    return bool( get_current_user() )

# USER SIGNUP #

@app.post('/users')
def create_user():
    json = request.json
    pw_hash = bcrypt.generate_password_hash(json['password']).decode('utf-8')
    university_id = json['universityId']
    new_user = User(username=json['username'], password=pw_hash, user_university_id=university_id)
    db.session.add(new_user)
    db.session.commit()
    session['user_id'] = new_user.id
    return new_user.to_dict(), 201

# SESSION LOGIN/LOGOUT#

@app.post('/login')
def login():
    json = request.json
    user = User.query.where(User.username == json["username"]).first()
    if user and bcrypt.check_password_hash(user.password, json['password']):
        session['user_id'] = user.id
        return user.to_dict(), 201
    else:
        return {'message': 'Invalid username or password'}, 401

@app.get('/current_session')
def check_session():
    if logged_in():
        return get_current_user().to_dict(), 200
    else:
        return {}, 401

@app.delete('/logout')
def logout():
    session['user_id'] = None
    return {}, 204

# MAKE CHECK-SESSION / LOGIN STUFF

if __name__ == '__main__':
    app.run(port=7777, debug=True)