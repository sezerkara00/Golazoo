from dotenv import load_dotenv
import os
import firebase_admin
from firebase_admin import credentials

load_dotenv()

# Football API yapılandırması
FOOTBALL_API_KEY = "239b33d39ec84db68c5938e79b16eb8f"
FOOTBALL_API_BASE_URL = "http://api.football-data.org/v4"

# Firebase yapılandırması
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "iddaa-app-8011f",
    "private_key_id": "your-private-key-id",  # Firebase Console'dan alınacak
    "private_key": "your-private-key",  # Firebase Console'dan alınacak
    "client_email": "firebase-adminsdk-xxxxx@iddaa-app-8011f.iam.gserviceaccount.com",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "your-cert-url"
})

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://iddaa-app-8011f-default-rtdb.europe-west1.firebasedatabase.app'
}) 