import json
import re
import requests
from .scbGeneralRequest import scbGeneralRequest

class scbFortuneRequest:

    def __init__(self):
        API_URL = 'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0104/TillgOversiktAldReg'
        description = 'Medelvärde, tillgångar och skulder för samtliga personer, tkr'
        self.request = scbGeneralRequest(API_URL, 'fortuneReq.json', description)

    def getJSON(self):
        return self.request.superGetJSON()
