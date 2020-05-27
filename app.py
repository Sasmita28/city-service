from flask import Flask, render_template, request, jsonify, json, redirect
from bson.json_util import loads, dumps
import pymongo
import json
import ast

app = Flask(__name__)

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# connect to mongo db and collection
db = client.citi_data
calls = db.calls_cleaned

@app.route("/")
def index():
    # return render_template("index.html", data=calls_info1)
    return render_template("index.html")

@app.route("/query")
def query():

    # get arguments that were passed to query url
    args = request.args

    # create empty lists for keys and values
    keys = []
    values = []

    #iterate through arg items and extra keys and values 
    for key, value in args.items():
        keys.append(key)
        values.append(value)
    
    #create empty list for mongodb query, that starts with a bracket
    mongo_query = ["{"]

    #iterate through keys and values, adding them to the mongo_query list
    for i in range(0,len(keys)):
        if i == 0:
            mongo_query.append(f'"{keys[i]}": "{values[i]}"')
        else:
            mongo_query.append(f', "{keys[i]}": "{values[i]}"')

    # close off the list of a bracket
    mongo_query.append("}")

    #turn the list into a string
    mongo_query_string = "".join(mongo_query)

    #from the string, back out the dictionary
    mongo_query_dict = ast.literal_eval(mongo_query_string) 

    # pass the dictionary to the query
    calls_info = list(calls.find(mongo_query_dict,  {'_id': 0}).limit(500000))

    # jsonify the response
    return jsonify(calls_info)

if __name__ == "__main__":
    app.run(debug=True)