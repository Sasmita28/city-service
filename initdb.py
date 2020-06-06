from citi_data_heroku.app import client,db

# db.drop_all()
db = client.citi_data
calls = db.calls
