import os
import pandas as pd
import pymongo
os.chdir(r'C:\Users\bjros\OneDrive\Desktop\KU_Data_Analytics_Boot_Camp\Projects\Project_2\citi-service')

#GET DATA
citi_df = pd.read_csv("Resources/311_Call_Center_Service_Requests.csv")
citi_df_mod = citi_df[['SOURCE','DEPARTMENT','CATEGORY', 'TYPE', 'DETAIL', 'CREATION YEAR','CREATION DATE','CREATION TIME','STATUS','DAYS TO CLOSE', 'STREET ADDRESS', 'ZIP CODE', 'COUNCIL DISTRICT','LATITUDE', 'LONGITUDE']]

#CLEAN DATA
# 1) Rename Columns & convert year to string
citi_df_mod.columns = ['source', 'department', 'category', 'type', 'detail','year','creation_date', 'creation_time','status', 'days_to_close', 'street_address', 'zip code', 'council_district','lat','lon']
citi_df_mod['year'] = citi_df_mod['year'].astype(str)


# 2) Add a month-date column 

listy = []
#Loop through the 'CREATION DATE' data
for i in range(len(citi_df_mod['creation_date'])):
    #Use Split Function to Pull Out the Month & Day Values for Each Record
    months = citi_df_mod['creation_date'][i].split("/")[0]
    days = citi_df_mod['creation_date'][i].split("/")[1]
    #Concatenate the Values
    month_days = str(months) + "/" + str(days)
    #Append Month/Day Value to List
    listy.append(month_days)
#Create a New Series to Unpack the Month/Day Values
citi_df_mod['creation_month-day'] = pd.Series(listy)
citi_df_mod['creation_month-day']

# 3) Fill in NaN
citi_df_mod = citi_df_mod.dropna(how="any")

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

# 8) Sort the Data by Ascending Month-Day
citi_df_mod = citi_df_mod.sort_values("creation_month-day", ascending=True)
citi_df_mod

# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
client.drop_database('citi_data')
db = client.citi_data
calls = db.calls


data = citi_df_mod.to_dict(orient='records')  # Here's our added param..

calls.insert_many(data)
client.close()



print("Data Uploaded!")