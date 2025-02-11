from firebase_admin import db
from datetime import datetime

class FirebaseService:
    def __init__(self):
        self.db = db.reference()

    async def create_forum_post(self, user_id: str, title: str, content: str):
        posts_ref = self.db.child('forum_posts')
        new_post = {
            'user_id': user_id,
            'title': title,
            'content': content,
            'created_at': datetime.now().isoformat(),
            'likes': 0,
            'comments': []
        }
        return posts_ref.push(new_post)

    async def get_user_profile(self, user_id: str):
        return self.db.child('users').child(user_id).get()

    async def update_user_profile(self, user_id: str, data: dict):
        return self.db.child('users').child(user_id).update(data)

    async def add_comment_to_post(self, post_id: str, user_id: str, comment: str):
        post_ref = self.db.child('forum_posts').child(post_id)
        comments = post_ref.child('comments').get() or []
        comments.append({
            'user_id': user_id,
            'comment': comment,
            'created_at': datetime.now().isoformat()
        })
        return post_ref.child('comments').set(comments) 