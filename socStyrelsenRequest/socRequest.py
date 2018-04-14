import json
import requests

class SocRequest:

    API_URL = 'http://sdb.socialstyrelsen.se/api/v1/sv/'

    def __init__(self):
        self.REGION = 0
        self.GENDER = 3
        self.YEAR = 2016
        self.DIAGNOSE = 2026
        self.MAX_ENTRIES = 100

    def printHeader(self):
        print("Region:", self.REGION)
        print("Kön:", self.GENDER)
        print("Diagnos:", self.DIAGNOSE)
        print("År\tAntal")

    def printYearTotal(self, year):
        requestURL = self.API_URL + 'dodsorsaker/resultat/matt/2'\
                + '/diagnos/' + str(self.DIAGNOSE) \
                + '/region/' + str(self.REGION) \
                + '/kon/' + str(self.GENDER) \
                + '/ar/' + str(year) \
                + '/?per_sida=' + str(self.MAX_ENTRIES) + '&sida=1'

        response = requests.get(requestURL)

        if(response.status_code == 200):
            jsonDict = response.json()
            jsonData = jsonDict['data']

            totalVarde = 0
            for i in jsonData:
                totalVarde += float(i['varde'].replace(',', '.', 1))

            print(year, "\t" + str(round(totalVarde, 2)))

        else:
            print("Request Failed (200)")
