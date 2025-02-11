from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth
from typing import List
from .services.football_api import FootballAPIService
from .services.firebase_service import FirebaseService
from .models.user import User, ForumPost
from datetime import datetime

app = FastAPI(title="Golazo API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

football_api = FootballAPIService()
firebase_service = FirebaseService()

# Firebase authentication middleware
async def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except:
        raise HTTPException(status_code=401, detail="Geçersiz kimlik doğrulama")

@app.get("/matches/live")
async def get_live_matches(current_user = Depends(get_current_user)):
    """Canlı maçları listeler"""
    try:
        matches = await football_api.get_live_matches()
        return {
            "status": "success",
            "matches": matches.get('matches', []),
            "count": len(matches.get('matches', []))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/matches/today")
async def get_todays_matches(current_user = Depends(get_current_user)):
    """Günün maçlarını listeler"""
    try:
        matches = await football_api.get_todays_matches()
        return {
            "status": "success",
            "matches": matches.get('matches', []),
            "count": len(matches.get('matches', [])),
            "date": datetime.now().strftime('%Y-%m-%d')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/matches/date/{date}")
async def get_matches_by_date(
    date: str,  # Format: YYYY-MM-DD
    current_user = Depends(get_current_user)
):
    """Belirli bir tarihteki maçları listeler"""
    try:
        matches = await football_api.get_matches(date=date)
        return {
            "status": "success",
            "matches": matches.get('matches', []),
            "count": len(matches.get('matches', [])),
            "date": date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/standings/{competition_id}")
async def get_competition_standings(
    competition_id: str,
    current_user = Depends(get_current_user)
):
    return await football_api.get_standings(competition_id)

@app.post("/forum/post")
async def create_forum_post(
    post: ForumPost,
    current_user = Depends(get_current_user)
):
    return await firebase_service.create_forum_post(
        user_id=current_user['uid'],
        title=post.title,
        content=post.content
    )

@app.get("/user/profile")
async def get_user_profile(current_user = Depends(get_current_user)):
    profile = await firebase_service.get_user_profile(current_user['uid'])
    if not profile:
        raise HTTPException(status_code=404, detail="Profil bulunamadı")
    return profile

@app.post("/forum/post/{post_id}/comment")
async def add_comment(
    post_id: str,
    comment: str,
    current_user = Depends(get_current_user)
):
    return await firebase_service.add_comment_to_post(
        post_id=post_id,
        user_id=current_user['uid'],
        comment=comment
    ) 