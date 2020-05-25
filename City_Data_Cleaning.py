#!/usr/bin/env python
# coding: utf-8

# In[1]:

import os
import pandas as pd
from matplotlib import pyplot as plt
import datetime as dt
import pymongo
os.chdir(r'C:\Users\bjros\OneDrive\Desktop\KU_Data_Analytics_Boot_Camp\Projects\Project_2\citi-service')


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


# In[10]:


#Calculate Average & Count of 'DAYS TO CLOSE' Value for Each Date
avg_days_to_close = data.groupby(['CREATION MONTH-DAY', 'CREATION YEAR']).mean()
avg_days_to_close['DAYS TO CLOSE'] = avg_days_to_close['DAYS TO CLOSE'].round(2)
avg_days_to_close = avg_days_to_close.rename(columns={'DAYS TO CLOSE':'AVERAGE DAYS TO CLOSE'})
avg_days_to_close['30-60-90 Days Open Window'] = avg_days_to_close['30-60-90 Days Open Window'].round(2)
avg_days_to_close = avg_days_to_close.rename(columns={'30-60-90 Days Open Window':'Average 30-60-90 Days Open Window'})
avg_days_to_close = avg_days_to_close.reset_index(level=['CREATION MONTH-DAY', 'CREATION YEAR'])

count_days_to_close = data.groupby(['CREATION MONTH-DAY', 'CREATION YEAR']).count()
count_days_to_close['DAYS TO CLOSE'] = count_days_to_close['DAYS TO CLOSE'].round(2)
count_days_to_close = count_days_to_close.rename(columns={'DAYS TO CLOSE':'COUNT DAYS TO CLOSE'})
count_days_to_close['30-60-90 Days Open Window'] = count_days_to_close['30-60-90 Days Open Window'].round(2)
count_days_to_close = count_days_to_close.rename(columns={'30-60-90 Days Open Window':'Count 30-60-90 Days Open Window'})
count_days_to_close = count_days_to_close.reset_index(level=['CREATION MONTH-DAY', 'CREATION YEAR'])

agg_days_to_close = avg_days_to_close.join(count_days_to_close, how="inner", lsuffix="", rsuffix="_extra")
agg_days_to_close


# In[11]:


#Show the Data Types for Averages Table
avg_days_to_close.dtypes


# In[12]:


#Show the Data Types for Count Table
count_days_to_close.dtypes


# In[13]:


#Drop Unneeded Columns
agg_days_to_close = agg_days_to_close[['CREATION MONTH-DAY', 'CREATION YEAR', 'AVERAGE DAYS TO CLOSE', 'Average 30-60-90 Days Open Window', 'COUNT DAYS TO CLOSE', 'Count 30-60-90 Days Open Window']]
agg_days_to_close


# In[14]:


# get the data
citi_agg_df = agg_days_to_close
citi_agg_df_mod = citi_agg_df[['CREATION MONTH-DAY', 'CREATION YEAR', 'AVERAGE DAYS TO CLOSE', 'Average 30-60-90 Days Open Window', 'COUNT DAYS TO CLOSE', 'Count 30-60-90 Days Open Window']]


# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.citi_data
calls_agg = db.calls_agg

#Create Dictionary with Data
data_agg = citi_agg_df_mod.to_dict(orient='records')  # Here's our added param..

#Remove Existing Documents from Collection
calls_agg.remove()

#Insert Existing Documents into Collection
calls_agg.insert_many(data_agg)


# In[15]:


#Calculate Average & Count 'DAYS TO CLOSE' Value for Each Date Filtered by 'STATUS' and 'SOURCE'
avg_days_to_close_filtered = data.groupby(['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT']).mean()
avg_days_to_close_filtered['DAYS TO CLOSE'] = avg_days_to_close_filtered['DAYS TO CLOSE'].round(2)
avg_days_to_close_filtered = avg_days_to_close_filtered.rename(columns={'DAYS TO CLOSE':'AVERAGE DAYS TO CLOSE'})
avg_days_to_close_filtered['30-60-90 Days Open Window'] = avg_days_to_close_filtered['30-60-90 Days Open Window'].round(2)
avg_days_to_close_filtered = avg_days_to_close_filtered.rename(columns={'30-60-90 Days Open Window':'Average 30-60-90 Days Open Window'})
avg_days_to_close_filtered = avg_days_to_close_filtered.reset_index(level=['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT'])

count_days_to_close_filtered = data.groupby(['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT']).count()
count_days_to_close_filtered['DAYS TO CLOSE'] = count_days_to_close_filtered['DAYS TO CLOSE'].round(2)
count_days_to_close_filtered = count_days_to_close_filtered.rename(columns={'DAYS TO CLOSE':'COUNT DAYS TO CLOSE'})
count_days_to_close_filtered['30-60-90 Days Open Window'] = count_days_to_close_filtered['30-60-90 Days Open Window'].round(2)
count_days_to_close_filtered = count_days_to_close_filtered.rename(columns={'30-60-90 Days Open Window':'Count 30-60-90 Days Open Window'})
count_days_to_close_filtered = count_days_to_close_filtered.reset_index(level=['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT'])

agg_days_to_close_filtered = avg_days_to_close_filtered.join(count_days_to_close_filtered, how="inner", lsuffix="", rsuffix="_extra")
agg_days_to_close_filtered


# In[16]:


#Show the Average Days to Close for Each Day
avg_days_to_close_filtered.dtypes


# In[17]:


#Show the Average Days to Close for Each Day
count_days_to_close_filtered.dtypes


# In[18]:


#Drop Unneeded Columns
agg_days_to_close_filtered = agg_days_to_close_filtered[['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT', 'AVERAGE DAYS TO CLOSE', 'Average 30-60-90 Days Open Window', 'COUNT DAYS TO CLOSE', 'Count 30-60-90 Days Open Window']]
agg_days_to_close_filtered


# In[19]:


# get the data
citi_agg_filtered_df = agg_days_to_close_filtered
citi_agg_filtered_df_mod = citi_agg_filtered_df[['CREATION MONTH-DAY', 'CREATION YEAR', 'STATUS', 'SOURCE', 'DEPARTMENT', 'AVERAGE DAYS TO CLOSE', 'Average 30-60-90 Days Open Window', 'COUNT DAYS TO CLOSE', 'Count 30-60-90 Days Open Window']]


# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.citi_data
calls_agg_filtered = db.calls_agg_filtered

#Create Dictionary with Data
data_agg_filtered = citi_agg_filtered_df_mod.to_dict(orient='records')  # Here's our added param..

#Remove Existing Documents from Collection
calls_agg_filtered.remove()

#Insert Existing Documents into Collection
calls_agg_filtered.insert_many(data_agg_filtered)


# In[ ]:




