# Import Statements
from trendFollowing import *

from flask import Flask, request
from flask_cors import CORS
import json

app = Flask(__name__)

CORS(app)

'''
This function handles the POST request to the /upload endpoint 
and reads the contents of the uploaded file using Flask's request.files object
'''

@app.route("/upload", methods=['POST'])
def upload_file():
    print("Recieved")
    selected_strings = request.form.getlist('strings[]')
    selected_algo = request.form.get('algorithm')

    if ((len(selected_strings) == 0) or (selected_algo == 'Select')):
        return {'status': 'failure'}

    print(f'Selected Strings: {selected_strings}')
    print(f'Algorithm: {selected_algo}')

    # Call simple algorithm - Read jsons

    print("Shifting Directories")

    JsonList = runAlgorithm(selected_strings, selected_algo)
    json_returned = {'status':'success', 'JsonList': JsonList}

    return json_returned

if __name__ == "__main__":
    with open("config.json") as f:
        config = json.load(f)

    port = config["port"]
    print(f'App running on port {port}')
    app.run(host='localhost', port=port)
    