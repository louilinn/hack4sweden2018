import json
import re
import requests
from .scbGeneralRequest import scbGeneralRequest

class scbRequest:

    def __init__(self):
        API_URL = 'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401N/NAKUBefolkningLAr'
        description = 'Genomsnittlig arbetslöshet 2005-2017 [%]'
        self.request = scbGeneralRequest(API_URL, 'req.json', description)

    def getJSON(self):
        return self.request.superGetJSON()
