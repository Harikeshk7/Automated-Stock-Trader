# Import Statements
import csv
import urllib.request as urllib2
import codecs
from pandas import *

stock_csv = read_csv('Stocks in the SP 500 Index.csv')

stock = stock_csv['Symbol'].tolist()

key = '63dbd073810b06.72223265'
for i in stock:
    url = "https://eodhistoricaldata.com/api/intraday/%s.US?api_token=%s&interval=1m" % (i, key) 
    req = urllib2.Request(url)
    req.add_header('User-Agent','Mozilla/5.0')
    response = urllib2.urlopen(req)

    cr = csv.reader(codecs.iterdecode(response, 'utf-8')) 
    fptr = open('test/%s.csv' % (i), 'w', newline ='') 

    for row in cr:
        writer = csv.writer(fptr, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL) 
        writer.writerow(row)