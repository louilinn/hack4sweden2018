import json
import requests

API_URL = 'http://sdb.socialstyrelsen.se/api/v1/sv/'
REGION = 1
GENDER = 3
YEAR = 1997
DIAGNOSE = 2026
MAX_ENTRIES = 100

requestURL = API_URL + 'dodsorsaker/resultat/matt/1'\
        + '/diagnos/' + str(DIAGNOSE) \
        + '/region/' + str(REGION) \
        + '/kon/' + str(GENDER) \
        + '/ar/' + str(YEAR) \
        + '/?per_sida=' + str(MAX_ENTRIES) + '&sida=1'

response = requests.get(requestURL)

if(response.status_code == 200):
    print("Request OK!\n")
    jsonDict = response.json()
    jsonData = jsonDict['data']

    totalVarde = 0
    for i in jsonData:
        totalVarde += int(i['varde'])

    print("Region:", REGION)
    print("Kön:", GENDER)
    print("År:", YEAR)
    print("Diagnos:", DIAGNOSE)
    print("Totalt värde:", totalVarde)

else:
    print("Request Failed (200)")
