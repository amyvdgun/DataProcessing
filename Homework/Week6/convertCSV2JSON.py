import csv
import json
from collections import OrderedDict

# read data file and write json file
csvfile = open("alldata.csv", "r")
jsonfile = open("alldata.json", "w+")

names = ("StateName", "Population", "Births2011", "Births2012", "Births2013", "Births2014", "Births2015", "Births2016", "Births2017")

reader = csv.DictReader(csvfile, names, delimiter = ";")

storage = []
for row in reader:
    data = OrderedDict()
    for element in names:
        data[element] = row[element].strip()
    storage.append(data)

json.dump(storage, jsonfile, indent=4)

