# Data Collection
import requests
import pandas as pd

# response = requests.get("https://www.davidinouye.com/course/ece47300-spring-2023/", allow_redirects=True)

# print("Error code = ", response.status_code)      
# print("Response text = ",response.text)
# with open("test.html", "wt") as fptr:
#     fptr.write(response.text)

# data = pd.read_csv('https://github.com/vega/datalib/blob/master/test/data/stocks.csv')
# print(data)

# Import Statements
import csv
import urllib.request as urllib2
import codecs

url = 'http://winterolympicsmedals.com/medals.csv' # csv URL - TEST URL
response = urllib2.urlopen(url) # Get response from URL
# print(f"Status Code = {response.status_code}")

cr = csv.reader(codecs.iterdecode(response, 'utf-8')) # Read csv from URL
fptr = open('test.csv', 'w', newline ='') # File in which response is to be stored

# Storing response in csv file
for row in cr:
    writer = csv.writer(fptr, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL) 
    writer.writerow(row)

