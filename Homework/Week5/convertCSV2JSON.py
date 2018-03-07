import csv
import json
from collections import OrderedDict

# read data file and write json file
csvfile = open("data2016.csv", "r")
jsonfile = open("data2016.json", "w+")

names = ("Datum", "Immigratie", "Emigratie", "TotaleBevolkingsgroei")

reader = csv.DictReader(csvfile, names, delimiter = ";")

storage = []
for row in reader:
    data = OrderedDict()
    for element in names:
        data[element] = row[element].strip()
    storage.append(data)

json.dump(storage, jsonfile, indent=4)

