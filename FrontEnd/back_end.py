# Import Statements
import os
import sys
import time
from trendFollowing import *

import json
#from flask import Flask, render_template, request, jsonify,redirect, url_for
from flask import Flask, Response, jsonify, request

from flask_cors import CORS
app = Flask(__name__)

CORS(app)

'''
This function handles the POST request to the /upload endpoint 
and reads the contents of the uploaded file using Flask's request.files object
'''

'''@app.route("/upload", methods=['POST'])
def upload_file():
    selected_strings = request.form.getlist('strings[]')
    if len(selected_strings) == 0:
        return {'status': 'failure'}

    print(f'Selected Strings: {selected_strings}')

    JsonList = []

    for json_obj in runAlgorithm(selected_strings):
        JsonList = [json_obj]
        print(JsonList)
        yield json.dumps(JsonList)
    #json_returned = {'status':'success', 'JsonList': JsonList}
    #return json_returned'''

'''@app.route("/upload", methods=['POST'])
def upload_file():
    selected_strings = request.form.getlist('strings[]')
    if len(selected_strings) == 0:
        return {'status': 'failure'}

    print(f'Selected Strings: {selected_strings}')

    def generate_json():
        for json_obj in runAlgorithm(selected_strings):
            yield json.dumps(json_obj)
            #yield "\n"
    return Response(generate_json(), mimetype='text/json')'''

'''@app.route("/upload", methods=['POST'])
def upload_file():
    selected_strings = request.form.getlist('strings[]')
    if len(selected_strings) == 0:
        return {'status': 'failure'}

    print(f'Selected Strings: {selected_strings}')

    JsonList = []

    algorithm = runAlgorithm(selected_strings)

    try:
        while True:
            json_obj = next(algorithm)
            JsonList.append(json_obj)
            print(JsonList)
            return json.dumps(json_obj)
    except StopIteration:
        pass

    json_returned = {'status':'success', 'JsonList': JsonList}
    return json.dumps(json_returned)'''

@app.route("/upload", methods=['POST'])
def upload_file():
    selected_strings = request.form.getlist('strings[]')
    if len(selected_strings) == 0:
        return {'status': 'failure'} 
    return generate_json(selected_strings)
def generate_json(selected_strings):
    for json_obj in runAlgorithm(selected_strings):
        print(json_obj)  
        yield json_obj

if __name__ == "__main__":
    with open("config.json") as f:
        config = json.load(f)

    port = config["port"]
    print(f'App running on port {port}')
    app.run(host='localhost', port=port)