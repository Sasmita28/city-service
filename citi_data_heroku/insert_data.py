import pymongo
import pandas as pd
import os
from flask import Flask

# from config1 import password,username

#GET DATA
citi_df = pd.read_csv("Resources/311_Call_Center_Service_Requests.csv",low_memory=False)
citi_df_mod = citi_df[['SOURCE','DEPARTMENT','CATEGORY', 'TYPE', 'DETAIL','CREATION DATE','CREATION TIME','STATUS','DAYS TO CLOSE','ZIP CODE','STREET ADDRESS','COUNCIL DISTRICT','LATITUDE', 'LONGITUDE']]

#CLEAN DATA
# 1) Rename Columns & convert year to string
citi_df_mod.columns = ['source', 'department', 'category', 'type', 'detail','creation_date', 'creation_time','status', 'days_to_close', 'zip_code','street_address', 'council_district','lat','lon']



# citi_df_mod['year']= citi_df_mod['year'].astype(str)

# 3) Fill in NaN
citi_df_mod = citi_df_mod.fillna("unknown")


# 2) Add a month-date column 

listy = []
listy1 = []
#Loop through the 'CREATION DATE' data
for i in range(len(citi_df_mod['creation_date'])):
    #Use Split Function to Pull Out the Month & Day Values for Each Record
    months_days_list= citi_df_mod['creation_date'][i].split("/")[:2]
    month_days = '/'.join(months_days_list)
    year = citi_df_mod['creation_date'][i].split("/")[-1]
    # #Append Month/Day Value to List
    listy.append(month_days)
    listy1.append(year)
    # listy1.append(year)
#Create a New Series to Unpack the Month/Day Values
citi_df_mod['creation_month-day'] = pd.Series(listy)
citi_df_mod['year'] = pd.Series(listy1)


# citi_df_mod = citi_df_mod.dropna(how='any')

# 4) Filter by Source
citi_df_mod = citi_df_mod.loc[(citi_df_mod["source"] == "WEB") | (citi_df_mod["source"] == "PHONE") |(citi_df_mod["source"] == "EMAIL") |(citi_df_mod["source"] == "WALK") | (citi_df_mod["source"] == "MAIL") ]


# 5) Rename values in source column
citi_df_mod["source"] = citi_df_mod["source"].str.replace("WEB","Online")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("PHONE","Phone")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("EMAIL","Email")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("MAIL","Mail")
citi_df_mod["source"] = citi_df_mod["source"].str.replace("WALK","Walk-in")

# 6) Rename values in status column
citi_df_mod["status"] = citi_df_mod["status"].str.replace("OPEN","Open")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("RESOL","Resolved")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("DUP","Duplicate")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("ASSIG","Assigned")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("CANC","Cancelled")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("FAIL","Failed")
citi_df_mod["status"] = citi_df_mod["status"].str.replace("HOLD","On Hold")

# 7) Rename values in department column
citi_df_mod["department"]  = citi_df_mod["department"].str.replace("IT","Information Technology")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("KCPD","Police")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks & Recreation","Parks & Rec")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks & Rec","Parks & Recreation")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks and Rec","Parks & Recreation")



app = Flask(__name__)




client = pymongo.MongoClient("mongodb+srv://kansascity311data:datadashboard@cluster0-04po8.mongodb.net/citi_data?retryWrites=true&w=majority")
client.drop_database('citi_data')
db = client.citi_data


calls = db.calls


data = citi_df_mod.to_dict(orient='records')  # Here's our added param..

calls.insert_many(data)
client.close()



print("Data Uploaded!")