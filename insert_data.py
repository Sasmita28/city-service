import os
import pymongo
import pandas as pd
os.chdir(r'C:\Users\bjros\OneDrive\Desktop\KU_Data_Analytics_Boot_Camp\Projects\Project_2\citi-service')

#GET DATA
citi_df = pd.read_csv("Resources/311_Call_Center_Service_Requests.csv")
citi_df_mod = citi_df[['SOURCE','DEPARTMENT','CATEGORY', 'TYPE', 'DETAIL', 'CREATION DATE','CREATION TIME','STATUS','DAYS TO CLOSE','STREET ADDRESS','COUNCIL DISTRICT','LATITUDE', 'LONGITUDE']]

#CLEAN DATA
# 1) Rename Columns
citi_df_mod.columns = ['source', 'department', 'category', 'type', 'detail', 'creation_date', 'creation_time', 'status', 'days_to_close', 'street_address', 'council_district','lat','lon']

# 2) Fill in NaN
citi_df_mod = citi_df_mod.fillna("unknown")

# 3) Filter by Source
citi_df_mod = citi_df_mod.loc[(citi_df_mod["source"] == "WEB") | (citi_df_mod["source"] == "PHONE") |(citi_df_mod["source"] == "EMAIL") |(citi_df_mod["source"] == "WALK") | (citi_df_mod["source"] == "MAIL") ]

# 4) Rename values in source column
citi_df_mod["source"] = citi_df_mod["source"].str.replace("WEB","Online")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("PHONE","Phone")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("EMAIL","Email")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("MAIL","Mail")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("WALK","Walk-in")

# 5) Rename values in status column
citi_df_mod["status"] = citi_df_mod["status"].str.replace("OPEN","Open")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("RESOL","Resolved")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("DUP","Duplicate")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("ASSIG","Assigned")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("CANC","Cancelled")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("FAIL","Failed")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("HOLD","On Hold")

# 5) Rename values in department column
citi_df_mod["department"]  = citi_df_mod["department"].str.replace("IT","Information Technology")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("KCPD","Police")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks & Recreation","Parks & Rec")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks & Rec","Parks & Recreation")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks and Rec","Parks & Recreation")

# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
client.drop_database('citi_data')
db = client.citi_data
calls = db.calls

#Set the Records to a Variable
data = citi_df_mod.to_dict(orient='records')  # Here's our added param..

#Remove Old Records
calls.remove()

#Insert the Records into the Collection
calls.insert_many(data)
client.close()

client.close()

print("Data Uploaded!")