import os
import pandas as pd
import pymongo
os.chdir(r'C:\Users\bjros\OneDrive\Desktop\KU_Data_Analytics_Boot_Camp\Projects\Project_2\citi-service')

# get the data
citi_df = pd.read_csv("Resources/311_Call_Center_Service_Requests.csv")
citi_df_mod = citi_df[['SOURCE','DEPARTMENT','CATEGORY', 'TYPE', 'DETAIL', 'CREATION DATE','CREATION TIME','STATUS','DAYS TO CLOSE','STREET ADDRESS','COUNCIL DISTRICT','LATITUDE', 'LONGITUDE']]
citi_df_mod = citi_df_mod.fillna("unknown")
# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
# Select database and collection to use
db = client.citi_data
calls = db.calls
data = citi_df_mod.to_dict(orient='records')  # Here's our added param..
calls.insert_many(data)
client.close()
print("Data Uploaded!")