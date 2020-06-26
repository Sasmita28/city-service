# citi-service
The KCMO 311 Service Calls dataset has over 1.5million geolocated incidents, including the nature of the complaint and the agency that responded to it. With the data going back to 2006, that’s an average of 1 complaint every 5 minutes. Preliminary factors for this project included:

Who’s making the complaints?
What are they complaining about?
When are the complaints most occuring?
How long do they take to resolve?

Process Flow for this project :

1) Load the data using Pandas --> Clean the data using Pandas   
2) Set up a Mongo DataBase 
3) Create a connnection from Pandas to Mongo --> Load the data from Python to Mongo
4) Set up a Flask App and design a dynamic query to get data from Mongo to JavaScript 
5) Front End Calculations and plotting in JavaScript to show in dashboard.
