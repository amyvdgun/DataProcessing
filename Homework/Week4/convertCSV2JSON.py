import csv
import json
from collections import OrderedDict

# read data file and write json file
csvfile = open("data.csv", "r")
jsonfile = open("data.json", "w")

names = ("Country", "Region", "LifeExpectancy", "GPA")

reader = csv.DictReader(csvfile, names, delimiter = ";")

storage = []
for row in reader:
    data = OrderedDict()
    for element in names:
        data[element] = row[element].strip()
    storage.append(data)

json.dump(storage, jsonfile, indent=4)

