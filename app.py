from flask import Flask, render_template
import pymongo

app = Flask(__name__)

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# connect to mongo db and collection
db = client.citi_data
calls = db.calls
calls_agg = db.calls_agg
calls_agg_filtered = db.calls_agg_filtered


@app.route("/")
def index():
    # write a statement that finds all the items in the db collections and sets them to variables
    #calls_info = list(calls.find())
    calls_agg_info = list(calls_agg.find())
    calls_agg_filtered_info = list(calls_agg_filtered.find())
    # print(calls_info.head())

    # render an index.html template and pass it the data you retrieved from the database
    return render_template("index.html", calls_info=[calls_agg_info, calls_agg_filtered_info])


if __name__ == "__main__":
    app.run(debug=True)