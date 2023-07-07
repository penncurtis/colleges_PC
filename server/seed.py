#!/usr/bin/env python3

from app import app
from models import db, University, Thread, User, Post

with app.app_context():
    
    db.drop_all()
    db.create_all()

    university_data = [
        {"university_name": "Harvard University", "university_color": "rgb(153, 0, 0)"},
        {"university_name": "Stanford University", "university_color": "rgb(170, 0, 0)"},
        {"university_name": "Massachusetts Institute of Technology (MIT)", "university_color": "rgb(163, 31, 52)"},
        {"university_name": "California Institute of Technology (Caltech)", "university_color": "rgb(139, 0, 0)"},
        {"university_name": "University of Chicago", "university_color": "rgb(131, 39, 41)"},
        {"university_name": "Princeton University", "university_color": "rgb(0, 47, 108)"},
        {"university_name": "Yale University", "university_color": "rgb(0, 32, 91)"},
        {"university_name": "Columbia University", "university_color": "rgb(185, 12, 48)"},
        {"university_name": "University of Pennsylvania", "university_color": "rgb(0, 21, 42)"},
        {"university_name": "University of California, Berkeley", "university_color": "rgb(0, 50, 98)"},
        {"university_name": "University of Michigan - Ann Arbor", "university_color": "rgb(0, 39, 76)"},
        {"university_name": "Johns Hopkins University", "university_color": "rgb(9, 46, 77)"},
        {"university_name": "University of California, Los Angeles (UCLA)", "university_color": "rgb(255, 255, 0)"},
        {"university_name": "Northwestern University", "university_color": "rgb(51, 0, 111)"},
        {"university_name": "New York University (NYU)", "university_color": "rgb(19, 34, 122)"},
        {"university_name": "Duke University", "university_color": "rgb(0, 26, 65)"},
        {"university_name": "University of California, San Diego (UCSD)", "university_color": "rgb(0, 59, 111)"},
        {"university_name": "University of Wisconsin - Madison", "university_color": "rgb(182, 0, 31)"},
        {"university_name": "University of Illinois at Urbana-Champaign", "university_color": "rgb(0, 13, 56)"},
        {"university_name": "University of Texas at Austin", "university_color": "rgb(188, 31, 63)"},
        {"university_name": "University of Washington", "university_color": "rgb(102, 204, 255)"},
        {"university_name": "Cornell University", "university_color": "rgb(31, 60, 114)"},
        {"university_name": "University of California, San Francisco (UCSF)", "university_color": "rgb(0, 75, 105)"},
        {"university_name": "University of North Carolina at Chapel Hill", "university_color": "rgb(134, 0, 56)"},
        {"university_name": "University of California, Davis (UC Davis)", "university_color": "rgb(0, 50, 98)"},
        {"university_name": "University of California, Santa Barbara (UCSB)", "university_color": "rgb(0, 82, 165)"},
        {"university_name": "University of California, Irvine (UCI)", "university_color": "rgb(0, 118, 183)"},
        {"university_name": "University of Pittsburgh", "university_color": "rgb(0, 41, 96)"},
        {"university_name": "University of Southern California (USC)", "university_color": "rgb(153, 0, 0)"},
        {"university_name": "University of Minnesota - Twin Cities", "university_color": "rgb(125, 0, 32)"},
        {"university_name": "University of Colorado Boulder", "university_color": "rgb(105, 155, 196)"},
        {"university_name": "University of Virginia", "university_color": "rgb(0, 33, 71)"},
        {"university_name": "University of Maryland, College Park", "university_color": "rgb(0, 60, 113)"},
        {"university_name": "Rice University", "university_color": "rgb(0, 51, 102)"},
        {"university_name": "Vanderbilt University", "university_color": "rgb(123, 36, 69)"},
        {"university_name": "Emory University", "university_color": "rgb(0, 82, 147)"},
        {"university_name": "Washington University in St. Louis", "university_color": "rgb(124, 30, 64)"},
        {"university_name": "University of Rochester", "university_color": "rgb(10, 68, 121)"},
        {"university_name": "Boston University", "university_color": "rgb(0, 32, 91)"},
        {"university_name": "University of Notre Dame", "university_color": "rgb(0, 0, 0)"},
        {"university_name": "Georgetown University", "university_color": "rgb(0, 24, 66)"},
        {"university_name": "Carnegie Mellon University", "university_color": "rgb(0, 68, 138)"},
        {"university_name": "Brown University", "university_color": "rgb(84, 40, 45)"},
        {"university_name": "Tufts University", "university_color": "rgb(67, 25, 55)"},
        {"university_name": "University of California, Santa Cruz (UCSC)", "university_color": "rgb(0, 102, 85)"},
        {"university_name": "University of Florida", "university_color": "rgb(0, 51, 102)"},
        {"university_name": "University of California, Riverside (UCR)", "university_color": "rgb(0, 68, 127)"},
        {"university_name": "University of California, San Francisco (UCSF)", "university_color": "rgb(0, 75, 105)"}
    ]

    def seed_universities():
        for data in university_data:
            university = University(**data)
            db.session.add(university)

        db.session.commit()

    
    thread_data = [
        {"thread_vote_count": 5, "thread_university_id": 1, "thread_title": "Sample Thread 1"},
        {"thread_vote_count": 10, "thread_university_id": 2, "thread_title": "Sample Thread 2"},
        {"thread_vote_count": 3, "thread_university_id": 1, "thread_title": "Sample Thread 3"},
        {"thread_vote_count": 8, "thread_university_id": 3, "thread_title": "Sample Thread 4"},
        {"thread_vote_count": 2, "thread_university_id": 2, "thread_title": "Sample Thread 5"},
        {"thread_vote_count": 7, "thread_university_id": 3, "thread_title": "Sample Thread 6"},
        {"thread_vote_count": 4, "thread_university_id": 1, "thread_title": "Sample Thread 7"},
        {"thread_vote_count": 6, "thread_university_id": 2, "thread_title": "Sample Thread 8"},
        {"thread_vote_count": 9, "thread_university_id": 3, "thread_title": "Sample Thread 9"},
        {"thread_vote_count": 1, "thread_university_id": 1, "thread_title": "Sample Thread 10"},
        {"thread_vote_count": 12, "thread_university_id": 2, "thread_title": "Sample Thread 11"},
        {"thread_vote_count": 5, "thread_university_id": 3, "thread_title": "Sample Thread 12"},
        {"thread_vote_count": 8, "thread_university_id": 1, "thread_title": "Sample Thread 13"},
        {"thread_vote_count": 3, "thread_university_id": 2, "thread_title": "Sample Thread 14"},
        {"thread_vote_count": 7, "thread_university_id": 3, "thread_title": "Sample Thread 15"},
        {"thread_vote_count": 4, "thread_university_id": 1, "thread_title": "Sample Thread 16"},
        {"thread_vote_count": 6, "thread_university_id": 2, "thread_title": "Sample Thread 17"},
        {"thread_vote_count": 9, "thread_university_id": 3, "thread_title": "Sample Thread 18"},
        {"thread_vote_count": 2, "thread_university_id": 1, "thread_title": "Sample Thread 19"},
        {"thread_vote_count": 11, "thread_university_id": 2, "thread_title": "Sample Thread 20"},
    ]

    def seed_threads():
        for data in thread_data:
            thread = Thread(**data)
            db.session.add(thread)

        db.session.commit()

    
    user_data = [
        {"username": "user1", "password": "password1", "user_university_id": 1},
    ]
    def seed_users():
        for data in user_data:
            user = User(**data)
            db.session.add(user)

        db.session.commit()

    
    post_data = [
        {"post_content": "Sample post 1", "post_vote_count": 2, "post_user_id": 1, "post_thread_id": 1},
        {"post_content": "Sample post 2", "post_vote_count": 5, "post_user_id": 2, "post_thread_id": 1},
        {"post_content": "Sample post 3", "post_vote_count": 3, "post_user_id": 3, "post_thread_id": 2},
        {"post_content": "Sample post 4", "post_vote_count": 1, "post_user_id": 1, "post_thread_id": 2},
        {"post_content": "Sample post 5", "post_vote_count": 4, "post_user_id": 2, "post_thread_id": 3},
        {"post_content": "Sample post 6", "post_vote_count": 2, "post_user_id": 3, "post_thread_id": 3},
        {"post_content": "Sample post 7", "post_vote_count": 4, "post_user_id": 1, "post_thread_id": 3},
        {"post_content": "Sample post 8", "post_vote_count": 3, "post_user_id": 2, "post_thread_id": 4},
        {"post_content": "Sample post 9", "post_vote_count": 2, "post_user_id": 3, "post_thread_id": 4},
        {"post_content": "Sample post 10", "post_vote_count": 1, "post_user_id": 1, "post_thread_id": 5},
        {"post_content": "Sample post 11", "post_vote_count": 3, "post_user_id": 2, "post_thread_id": 5},
        {"post_content": "Sample post 12", "post_vote_count": 5, "post_user_id": 3, "post_thread_id": 6},
        {"post_content": "Sample post 13", "post_vote_count": 2, "post_user_id": 1, "post_thread_id": 6},
        {"post_content": "Sample post 14", "post_vote_count": 4, "post_user_id": 2, "post_thread_id": 7},
        {"post_content": "Sample post 15", "post_vote_count": 3, "post_user_id": 3, "post_thread_id": 7},
        {"post_content": "Sample post 16", "post_vote_count": 1, "post_user_id": 1, "post_thread_id": 8},
        {"post_content": "Sample post 17", "post_vote_count": 2, "post_user_id": 2, "post_thread_id": 8},
        {"post_content": "Sample post 18", "post_vote_count": 3, "post_user_id": 3, "post_thread_id": 9},
        {"post_content": "Sample post 19", "post_vote_count": 1, "post_user_id": 1, "post_thread_id": 9},
        {"post_content": "Sample post 20", "post_vote_count": 4, "post_user_id": 2, "post_thread_id": 10},
    ]

    def seed_posts():
        for data in post_data:
            post = Post(**data)
            db.session.add(post)

        db.session.commit()

    def seed():
        seed_universities()
        seed_threads()
        seed_users()
        seed_posts()
    
    seed()
    print("🌱 Hotels, Customers, and Reviews successfully seeded! 🌱")
