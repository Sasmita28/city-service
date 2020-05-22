#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
from matplotlib import pyplot as plt
import datetime as dt
import pymongo


# In[2]:


#Read in the CSV Data
data = pd.read_csv('Resources/311_Call_Center_Service_Requests.csv')
data.head()


# In[3]:


#Count the Rows of Each Column
row_count = data.count()
row_count


# In[4]:


#Parse the Day & Month from the Date
listy = []
#Loop through the 'CREATION DATE' data
for i in range(len(data['CREATION DATE'])):
    #Use Split Function to Pull Out the Month & Day Values for Each Record
    months = data['CREATION DATE'][i].split("/")[0]
    days = data['CREATION DATE'][i].split("/")[1]
    #Concatenate the Values
    month_days = str(months) + "/" + str(days)
    #Append Month/Day Value to List
    listy.append(month_days)
#Create a New Series to Unpack the Month/Day Values
data['CREATION MONTH-DAY'] = pd.Series(listy)
data


# In[5]:


#Reformat the 'CREATION DATE' Column
listy1 = []
#Loop through the 'CREATION DATE' data
for i in range(len(data['CREATION DATE'])):
    #Use Split Function to Pull Out the Month & Day Values for Each Record
    months1 = data['CREATION DATE'][i].split("/")[0]
    days1 = data['CREATION DATE'][i].split("/")[1]
    years1 = data['CREATION DATE'][i].split("/")[2]
    #Concatenate the Values
    years_month_days = str(years1) + "/" + str(months1) + "/" + str(days1)
    #Append Month/Day Value to List
    listy1.append(years_month_days)
#Create a New Series to Unpack the Year/Month/Day Values
data['CREATION YEAR-MONTH-DAY'] = pd.Series(listy1)
data


# In[6]:


#Create Column with Concatenated Values for Creation Date-Time
data['CREATION DATE-TIME'] = data['CREATION YEAR-MONTH-DAY'] + " " + data['CREATION TIME']
data


# In[7]:


#Sort the Values by Creation Date-Time
data = data.sort_values('CREATION DATE-TIME', ascending=False).reset_index(drop=True)
data


# In[8]:


#Change Data Type of 'DAYS TO CLOSE' Column
#Found Method to Replace Values from Strings at https://stackoverflow.com/questions/37919479/removing-characters-from-a-string-in-pandas
data['DAYS TO CLOSE'] = data['DAYS TO CLOSE'].str.replace(",", "")
data['DAYS TO CLOSE'] = data['DAYS TO CLOSE'].astype(float)
data['DAYS TO CLOSE'].dtype


# In[9]:


## Perform Check to Verify that Newest Data is Available
data.loc[data['CREATION DATE'] == '05/20/2020']


# In[15]:


#Calculate Average 'DAYS TO CLOSE' Value for Each Date
avg_days_to_close = data.groupby(['CREATION MONTH-DAY', 'CREATION YEAR']).mean()
avg_days_to_close['DAYS TO CLOSE'] = avg_days_to_close['DAYS TO CLOSE'].round(2)
avg_days_to_close['30-60-90 Days Open Window'] = avg_days_to_close['30-60-90 Days Open Window'].round(2)
avg_days_to_close = avg_days_to_close.reset_index(level=['CREATION MONTH-DAY', 'CREATION YEAR'])
avg_days_to_close


# In[18]:


#Show the Average Days to Close for Each Day
avg_days_to_close.dtypes


# In[19]:


#Drop Unneeded Columns
avg_days_to_close = avg_days_to_close[['CREATION MONTH-DAY', 'CREATION YEAR','DAYS TO CLOSE', '30-60-90 Days Open Window']]
avg_days_to_close


# In[17]:


# get the data
citi_avg_df = avg_days_to_close
citi_avg_df_mod = citi_avg_df[['CREATION MONTH-DAY', 'CREATION YEAR', 'DAYS TO CLOSE', '30-60-90 Days Open Window']]


# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.citi_data
calls_avg = db.calls_avg

#Create Dictionary with Data
data_avg = citi_avg_df_mod.to_dict(orient='records')  # Here's our added param..

#Remove Existing Documents from Collection
calls_avg.remove()

#Insert Existing Documents into Collection
calls_avg.insert_many(data_avg)


# In[29]:


#Calculate Average 'DAYS TO CLOSE' Value for Each Date Filtered by 'STATUS' and 'SOURCE'
avg_days_to_close_filtered = data.groupby(['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT']).mean()
avg_days_to_close_filtered['DAYS TO CLOSE'] = avg_days_to_close_filtered['DAYS TO CLOSE'].round(2)
avg_days_to_close_filtered['30-60-90 Days Open Window'] = avg_days_to_close_filtered['30-60-90 Days Open Window'].round(2)
avg_days_to_close_filtered = avg_days_to_close_filtered.reset_index(level=['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT'])
avg_days_to_close_filtered


# In[30]:


#Show the Average Days to Close for Each Day
avg_days_to_close_filtered.dtypes


# In[31]:


#Drop Unneeded Columns
avg_days_to_close_filtered = avg_days_to_close_filtered[['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT', 'DAYS TO CLOSE', '30-60-90 Days Open Window']]
avg_days_to_close_filtered


# In[35]:


# get the data
citi_avg_filtered_df = avg_days_to_close_filtered
citi_avg_filtered_df_mod = citi_avg_filtered_df[['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT', 'DAYS TO CLOSE', '30-60-90 Days Open Window']]


# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.citi_data
calls_avg_filtered = db.calls_avg_filtered

#Create Dictionary with Data
data_avg_filtered = citi_avg_filtered_df_mod.to_dict(orient='records')  # Here's our added param..

#Remove Existing Documents from Collection
calls_avg_filtered.remove()

#Insert Existing Documents into Collection
calls_avg_filtered.insert_many(data_avg_filtered)


# In[ ]:




