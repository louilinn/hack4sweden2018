import json
import re
import requests

class scbRequest:

    API_URL = 'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401N/NAKUBefolkningLAr'

    def __init__(self):
        self.jsonContent = open('req.json', 'rb').read()
        self.pattern = r"(?<=DATA=).*(?=;)"

    def getPercent(self):
        requestURL = self.API_URL

        headers = {'Content-Type' : 'application/json'}
        r = requests.post(requestURL, data=self.jsonContent, headers=headers)

        if(r.status_code == 200):
            print("request Successfull!")
            #print(r.text)
            #p = re.compile('^(\d+)?([.]?\d{0,2})?$')
            #print(r.text)
            matches = re.search(self.pattern, r.text, re.DOTALL)

            if matches:
                print ("Match was found at {start}-{end}: {match}".format(start = matches.start(), end = matches.end(), match = matches.group()))

                for groupNum in range(0, len(matches.groups())):
                    groupNum = groupNum + 1

                    print ("Group {groupNum} found at {start}-{end}: {group}".format(groupNum = groupNum, start = matches.start(groupNum), end = matches.end(groupNum), group = matches.group(groupNum)))

            else:
                print("NO MATCH!"

        else:
            print("Request Failed (200)")
