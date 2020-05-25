import os
import pandas as pd
from matplotlib import pyplot as plt
import datetime as dt
import pymongo
os.chdir(r'C:\Users\bjros\OneDrive\Desktop\KU_Data_Analytics_Boot_Camp\Projects\Project_2\citi-service')

#GET DATA
citi_df = pd.read_csv("Resources/311_Call_Center_Service_Requests.csv")
citi_df_mod = citi_df[['SOURCE','DEPARTMENT','CATEGORY', 'TYPE', 'DETAIL', 'CREATION YEAR','CREATION DATE','CREATION TIME','STATUS','DAYS TO CLOSE','STREET ADDRESS','COUNCIL DISTRICT','LATITUDE', 'LONGITUDE']]

#CLEAN DATA
# 1) Rename Columns
citi_df_mod.columns = ['source', 'department', 'category', 'type', 'detail', 'creation_year', 'creation_date', 'creation_time', 'status', 'days_to_close', 'street_address', 'council_district','lat','lon']

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
#​
# 6) Rename values in department column
citi_df_mod["department"]  = citi_df_mod["department"].str.replace("IT","Information Technology")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("KCPD","Police")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks & Recreation","Parks & Rec")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks & Rec","Parks & Recreation")
citi_df_mod["department"] = citi_df_mod["department"].str.replace("Parks and Rec","Parks & Recreation")
#​
# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
#​
# Select database and collection to use
client.drop_database('citi_data')
db = client.citi_data
calls = db.calls
#​
#​
data = citi_df_mod.to_dict(orient='records')  # Here's our added param..
#​
calls.insert_many(data)
#
#Parse the Day & Month from the Date
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
#
#Reformat the 'CREATION DATE' Column
listy1 = []
#Loop through the 'CREATION DATE' data
for i in range(len(citi_df_mod['creation_date'])):
    #Use Split Function to Pull Out the Month & Day Values for Each Record
    months1 = citi_df_mod['creation_date'][i].split("/")[0]
    days1 = citi_df_mod['creation_date'][i].split("/")[1]
    years1 = citi_df_mod['creation_date'][i].split("/")[2]
    #Concatenate the Values
    years_month_days = str(years1) + "/" + str(months1) + "/" + str(days1)
    #Append Month/Day Value to List
    listy1.append(years_month_days)
#Create a New Series to Unpack the Year/Month/Day Values
citi_df_mod['creation_year-month-day'] = pd.Series(listy1)
#
#Create Column with Concatenated Values for Creation Date-Time
citi_df_mod['creation_date-time'] = citi_df_mod['creation_year-month-day'] + " " + citi_df_mod['creation_time']
#
#Sort the Values by Creation Date-Time
citi_df_mod = citi_df_mod.sort_values('creation_date-time', ascending=False).reset_index(drop=True)
#
#Change Data Type of 'DAYS TO CLOSE' Column
#Found Method to Replace Values from Strings at https://stackoverflow.com/questions/37919479/removing-characters-from-a-string-in-pandas
citi_df_mod['days_to_close'] = citi_df_mod['days_to_close'].str.replace(",", "")
citi_df_mod['days_to_close'] = citi_df_mod['days_to_close'].astype(float)
citi_df_mod['days_to_close'].dtype
#
#Set Up Collection for Cleaned Data
db = client.citi_data
calls_cleaned = db.calls_cleaned
#​
#​
data = citi_df_mod.to_dict(orient='records')  # Here's our added param..
#​
calls_cleaned.insert_many(data)
#
#Calculate Average & Count of 'DAYS TO CLOSE' Value for Each Date
avg_days_to_close = citi_df_mod.groupby(['creation_month-day', 'creation_year']).mean()
avg_days_to_close['days_to_close'] = avg_days_to_close['days_to_close'].round(2)
avg_days_to_close = avg_days_to_close.rename(columns={'days_to_close':'average_days_to_close'})
avg_days_to_close = avg_days_to_close.reset_index(level=['creation_month-day', 'creation_year'])
#
count_days_to_close = citi_df_mod.groupby(['creation_month-day', 'creation_year']).count()
count_days_to_close['days_to_close'] = count_days_to_close['days_to_close'].round(2)
count_days_to_close = count_days_to_close.rename(columns={'days_to_close':'count_days_to_close'})
count_days_to_close = count_days_to_close.reset_index(level=['creation_month-day', 'creation_year'])
#
agg_days_to_close = avg_days_to_close.join(count_days_to_close, how="inner", lsuffix="", rsuffix="_extra")
#
#Show the Data Types for Averages Table
avg_days_to_close.dtypes
#
#Show the Data Types for Count Table
count_days_to_close.dtypes
#
#Drop Unneeded Columns
agg_days_to_close = agg_days_to_close[['creation_month-day', 'creation_year', 'average_days_to_close', 'count_days_to_close']]
#
# get the data
citi_agg_df = agg_days_to_close
citi_agg_df_mod = citi_agg_df[['creation_month-day', 'creation_year', 'average_days_to_close', 'count_days_to_close']]
#
# Select database and collection to use
db = client.citi_data
calls_agg = db.calls_agg
#
#Create Dictionary with Data
data_agg = citi_agg_df_mod.to_dict(orient='records')  # Here's our added param..
#
#Remove Existing Documents from Collection
calls_agg.remove()
#
#Insert Existing Documents into Collection
calls_agg.insert_many(data_agg)
#​
#​#Calculate Average & Count 'DAYS TO CLOSE' Value for Each Date Filtered by 'STATUS' and 'SOURCE'
avg_days_to_close_filtered = citi_df_mod.groupby(['creation_month-day', 'creation_year', 'status', 'source', 'department']).mean()
avg_days_to_close_filtered['days_to_close'] = avg_days_to_close_filtered['days_to_close'].round(2)
avg_days_to_close_filtered = avg_days_to_close_filtered.rename(columns={'days_to_close':'average_days_to_close'})
avg_days_to_close_filtered = avg_days_to_close_filtered.reset_index(level=['creation_month-day', 'creation_year', 'status', 'source', 'department'])
#
count_days_to_close_filtered = citi_df_mod.groupby(['creation_month-day', 'creation_year', 'status', 'source', 'department']).count()
count_days_to_close_filtered['days_to_close'] = count_days_to_close_filtered['days_to_close'].round(2)
count_days_to_close_filtered = count_days_to_close_filtered.rename(columns={'days_to_close':'count_days_to_close'})
count_days_to_close_filtered = count_days_to_close_filtered.reset_index(level=['creation_month-day', 'creation_year', 'status', 'source', 'department'])
#
agg_days_to_close_filtered = avg_days_to_close_filtered.join(count_days_to_close_filtered, how="inner", lsuffix="", rsuffix="_extra")
#​
#Show the Average Days to Close for Each Day
avg_days_to_close_filtered.dtypes
#
#Show the Average Days to Close for Each Day
count_days_to_close_filtered.dtypes
#
#Drop Unneeded Columns
agg_days_to_close_filtered = agg_days_to_close_filtered[['creation_month-day', 'creation_year', 'status', 'source', 'department', 'average_days_to_close', 'count_days_to_close']]
#
# get the data
citi_agg_filtered_df = agg_days_to_close_filtered
citi_agg_filtered_df_mod = citi_agg_filtered_df[['creation_month-day', 'creation_year', 'status', 'source', 'department', 'average_days_to_close', 'count_days_to_close']]
#
# Select database and collection to use
db = client.citi_data
calls_agg_filtered = db.calls_agg_filtered
#
#Create Dictionary with Data
data_agg_filtered = citi_agg_filtered_df_mod.to_dict(orient='records')  # Here's our added param..
#
#Remove Existing Documents from Collection
calls_agg_filtered.remove()
#
#Insert Existing Documents into Collection
calls_agg_filtered.insert_many(data_agg_filtered)
#
client.close()
#
print("Data Uploaded!")