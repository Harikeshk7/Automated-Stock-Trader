# Import Statements
from trendFollowing import *

from flask import Flask, request
from flask_cors import CORS
import json
import importlib.util
import os

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

    print("Shifting Directories")
    if (selected_algo == 'custom'):
        custom_file = request.files['customFileInput']
        custom_file.save('customFile.py')
        
        spec = importlib.util.spec_from_file_location("custom_module", "customFile.py")
        custom_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(custom_module)
        custom_function = custom_module.customAlgorithm
        JsonList = custom_function(selected_strings, selected_algo)
        os.remove('customFile.py')

    else:
        JsonList = runAlgorithm(selected_strings, selected_algo)
    json_returned = {'status':'success', 'JsonList': JsonList}

    return json_returned

if __name__ == "__main__":
    with open("config.json") as f:
        config = json.load(f)

    port = config["port"]
    print(f'App running on port {port}')
    app.run(host='localhost', port=port)
    