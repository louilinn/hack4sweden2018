import json
import re
import requests

class scbRequest:

    API_URL = 'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401N/NAKUBefolkningLAr'

    def __init__(self):
        self.jsonContent = open('./scbSource/req.json', 'rb').read()
        self.dataPattern = r"(?<=DATA=).*(?=;)"
        self.regionPattern = r"(?<=CODES\(\"region\"\)=).*(?=;)"

    def getJSON(self):
        requestURL = self.API_URL

        headers = {'Content-Type' : 'application/json'}
        r = requests.post(requestURL, data=self.jsonContent, headers=headers)

        if(r.status_code == 200):
            data_match = re.search(self.dataPattern, r.text, re.DOTALL)
            data_str = data_match.group()
            region_match = re.search(self.regionPattern, r.text)
            region_keys = region_match.group()
            region_keys = region_keys.replace('\"', "")

            if data_str and region_keys:
                all_data_lines = data_str.split("\r\n")[1:-1]
                regions_str = region_keys.split(',')
                regions = [int(s) for s in regions_str]

                data_by_region = {}
                for i in range(0,len(regions)):#line in all_data_lines:
                    line = all_data_lines[i]
                    string_values = line.split()
                    values = [float(s) for s in string_values]
                    average = round(sum(values)/len(values),2)
                    data_by_region[regions[i]] = average

                response = {
                    'description': 'Genomsnittlig arbetslöshet 2005-2017 [%]',
                    'data': data_by_region
                }
                return json.dumps(response)
            else:
                print("NO MATCH!")
        else:
            print("Request Failed (200)")
