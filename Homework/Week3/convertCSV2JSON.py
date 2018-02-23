import csv
import json
from collections import OrderedDict

# read data file and write json file
csvfile = open("data.csv", "r")
jsonfile = open("data.json", "w")

names = ("Year","Babies")

reader = csv.DictReader(csvfile, names)

storage = []
for row in reader:
    data = OrderedDict()
    for element in names:
        data[element] = row[element].strip()
    storage.append(data)

json.dump(storage, jsonfile, indent=4)

#for row in reader:
#    if "Year" not in row[0]:
#        row = row[0].split(";")
#        if len(row) > 1:
#           data[row[0]] = row[1]

#output = json.dump(data, jsonfile, indent=4)


