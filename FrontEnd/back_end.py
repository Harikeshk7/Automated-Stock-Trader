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
    selected_algo = ' '
    #selected_algo = request.form.get('algorithm') This might be the way to get the string in the backend
                                                # I did not write this so I don't know. If it's correct, uncomment and delete comment
    if len(selected_strings) == 0:
        return {'status': 'failure'}

    print(f'Selected Strings: {selected_strings}')

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
    