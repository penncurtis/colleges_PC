from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from flask_login import UserMixin

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class University(db.Model, SerializerMixin):
    __tablename__ = 'universities'

    id = db.Column(db.Integer, primary_key=True)
    university_name = db.Column(db.String)
    university_color = db.Column(db.String)

    threads = db.relationship('Thread', backref='university')
    users = db.relationship('User', backref='university')

    serialize_rules = ('-threads', '-users', )

class Thread(db.Model, SerializerMixin):
    __tablename__ = 'threads'

    id = db.Column(db.Integer, primary_key=True)
    thread_vote_count = db.Column(db.Integer, default=0)
    thread_title = db.Column(db.String)

    posts = db.relationship('Post', backref='thread')
    
    thread_university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=False)

    serialize_rules = ('-posts',)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    user_post_count = db.Column(db.Integer, default=0)

    posts = db.relationship('Post', backref='user')

    user_university_id = db.Column(db.Integer, db.ForeignKey('universities.id'))

    serialize_rules = ('-posts',)

    @validates('password')
    def validate_password(self, key, password):
        if len(password) > 30:
            raise ValueError('Password cannot exceed 30 characters.')
        return password
    

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    post_content = db.Column(db.String)
    post_vote_count = db.Column(db.Integer, default=0)
    post_reply_id = db.Column(db.Integer)

    post_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_thread_id = db.Column(db.Integer, db.ForeignKey('threads.id'), nullable=False)

    serialize_rules = ('-users', '-threads',)

    @validates('post_content')
    def validate_post_content(self, key, value):
        if len(value) > 250:
            raise ValueError("Post content must be maximum 250 characters.")
        return value