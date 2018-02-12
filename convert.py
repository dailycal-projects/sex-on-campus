# Convert responses sheet to json data
import json
import sys
import csv
import os

def convert_data(responses_filename, dest_data_filename):
    dest_data_file = open(dest_data_filename, 'w')
    dest_data_file.truncate()
    responses_file = open(responses_filename, 'r')

    fieldnames = ("timestamp","message","loc","name")
    reader = csv.DictReader(responses_file, fieldnames)
    next(reader, None)

    dest_data_file.write('{\"events\":[\n')
    first = True
    for row in reader:
        new_row = {}
        if row['message'] != '':
            if not first:
                dest_data_file.write(',\n')
            first = False
            new_row['message'] = row['message']
            new_row['lat'] = float(row['loc'].split(',')[0][7:])
            new_row['long'] = float(row['loc'].split(',')[1][:-1][1:])

            json.dump(new_row, dest_data_file)

    dest_data_file.write(']}')

def generate_new_row(old_row):
    local_path = old_row[1]

def main():
    if len(sys.argv) == 2:
        responses_filename = sys.argv[1]
        dest_data_filename = './src/data/data.json'
        convert_data(responses_filename, dest_data_filename)
    elif len(sys.argv) > 2:
        responses_filename = sys.argv[1]
        dest_data_filename = sys.argv[2]
        convert_data(responses_filename, dest_data_filename)
    else:
        print('Usage: python convert.py [responses_filename] [dest_data_filename]=./data.json')

if __name__ == "__main__":
    main()
