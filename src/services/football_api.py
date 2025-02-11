import requests
from datetime import datetime
from ..config import FOOTBALL_API_KEY, FOOTBALL_API_BASE_URL

class FootballAPIService:
    def __init__(self):
        self.headers = {'X-Auth-Token': FOOTBALL_API_KEY}
        self.base_url = FOOTBALL_API_BASE_URL

    async def get_matches(self, date=None):
        url = f"{self.base_url}/matches"
        params = {}
        
        if date:
            params['date'] = date
        
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    async def get_live_matches(self):
        url = f"{self.base_url}/matches"
        params = {
            'status': 'LIVE'  # LIVE, IN_PLAY, PAUSED
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    async def get_todays_matches(self):
        today = datetime.now().strftime('%Y-%m-%d')
        return await self.get_matches(date=today)

    async def get_standings(self, competition_id):
        url = f"{self.base_url}/competitions/{competition_id}/standings"
        response = requests.get(url, headers=self.headers)
        return response.json() 