from citi_data.app import db
import os
import pymongo
from flask import Flask
# from config1 import password,username

# db.drop_all()
MONGO_URL = os.environ.get('MONGO_URL')
if not MONGO_URL:

    MONGO_URL =  "mongodb://heroku_zfsn3qks:c1hld8ptmpggthea742tcbuc95@ds131109.mlab.com:31109/heroku_zfsn3qks"
   

app = Flask(__name__)


app.config['MONGO_URI'] = MONGO_URL
client = pymongo.MongoClient(MONGO_URL)

db = client.citi_data
calls = db.calls
