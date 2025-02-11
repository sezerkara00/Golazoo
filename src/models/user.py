from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    uid: str
    email: str
    username: str
    favorite_teams: List[str] = []
    favorite_leagues: List[str] = []

class ForumPost(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    created_at: str
    likes: int = 0
    comments: List[dict] = [] 