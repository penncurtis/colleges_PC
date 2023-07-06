#!/usr/bin/env python3

import ipdb

from flask import Flask, make_response, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS

from models import db, University, Thread, User, Post

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///colleges.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

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
        university = University(university_name=data['university_name'])
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
    
    def post(self):
        data = request.get_json()
        university = University.query.filter_by(id=data['thread_university_id']).first().to_dict()

        new_thread = Thread(
            thread_university_id=university['id']
        )
        db.session.add(new_thread)
        db.session.commit()
        return jsonify({'message': 'Thread created!'}, 201)
    
api.add_resource(Threads, "/threads")

class ThreadsByUniversity(Resource):
    def get(self, schoolname):
        
        university = University.query.filter_by(university_name=schoolname).first()
        if not university:
            return {'errors': "university not found"}, 404
        threads = [thread.to_dict() for thread in university.threads]
        # ipdb.set_trace()
        return make_response(jsonify(threads), 200)

    def post(self):
        data = request.get_json()
        university = University.query.filter_by(id=data['thread_university_id']).first().to_dict()

        new_thread = Thread(
            thread_title=data['thread_title'],
            thread_university_id=university['id']
        )
        db.session.add(new_thread)
        db.session.commit()
        return jsonify({'message': 'Thread created!'}, 201)

    def patch(self, id):
        thread = Thread.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(thread, attr, data[attr])
        db.session.commit()
        response_body = thread.to_dict()
        return make_response(jsonify(response_body), 202)

    def delete(self, id):
        thread = Thread.query.filter_by(id=id).first()
        if not thread:
            return jsonify({'message': 'Thread not found'}), 404
        db.session.delete(thread)
        db.session.commit()
        return jsonify({'message': 'Thread deleted successfully'}, 204)

api.add_resource(ThreadsByUniversity, "/universities/<string:schoolname>/threads")

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

        data = request.get_json()

        new_post = Post(
            post_content=data['post_content'],
            post_thread_id=thread.id
        )

        db.session.add(new_post)
        db.session.commit()

        return jsonify({'message': 'Post created!'}, 201)

    def patch(self, id):
        post = Post.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(post, attr, data[attr])
        db.session.commit()
        response_body = post.to_dict()
        return make_response(jsonify(response_body), 202)

    def delete(self, id):
        post = Post.query.filter_by(id=id).first()
        if not post:
            return jsonify({'message': 'Post not found'}), 404
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'})

api.add_resource(PostByUniThread, "/universities/<string:schoolname>/threads/<int:threadId>/posts")

class Signup(Resource):
    def post(self):
        data = request.get_json()
        user = User(
            username=data['username'], 
            password=data['password']
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User signed up successfully'}, 201)
    
api.add_resource(Signup, "/signup")

# MAKE CHECK-SESSION / LOGIN STUFF

if __name__ == '__main__':
    app.run(port=7777, debug=True)