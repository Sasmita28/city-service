
from flask import Flask, render_template, request, jsonify, json, redirect
from bson.json_util import loads, dumps
import pymongo
app = Flask(__name__)
# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
# connect to mongo db and collection
db = client.citi_data
calls = db.calls
@app.route("/")
def index():
    # return render_template("index.html", data=calls_info1)
    return render_template("index.html")
@app.route("/query")
def query():
    # # write a statement that finds all the items in the db and sets it to a variable
    calls_info = list(calls.find({}, {'_id': 0}).limit(400000))
    # render an index.html template and pass it the data you retrieved from the database
    return jsonify(calls_info)
if __name__ == "__main__":
    app.run(debug=True)