from http.server import BaseHTTPRequestHandler
from urllib import parse
from socStyrelsenRequest.socRequest import SocRequest
from scbSource.scbRequest import scbRequest
from scbSource.scbFortuneReq import scbFortuneRequest

class GetHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        # Socialstyrelsens diagnos data
        if(self.path.startswith('/socDiagnoses')):
            self.send_response(200)
            self.send_header('Content-Type',
                    'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(SocRequest().getDiagnoseIdAndName().encode('utf-8'))

        # Socialstyrelsens data
        elif(self.path.startswith('/soc')):
            diagnose = self.path.strip('/soc')
            jsonData = None
            try:
                jsonData = SocRequest().getDiagnoseJson(diagnose).encode('utf-8')

                self.send_response(200)
                self.send_header('Content-Type',
                        'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(jsonData)

            except RuntimeError as e:
                self.send_response(404)
                self.send_header('Content-Type',
                             'text/plain; charset=utf-8')
                self.end_headers()
                self.wfile.write("(404) Invalid Soc Diagnose Code".encode('utf-8'))

        # Statistiska Central Byrans data
        elif(self.path.startswith('/scb')):
            dataset = self.path.strip('/scb')
            jsonData = None
            try:
                if (dataset.startswith('Unemployment')):
                    jsonData = scbRequest().getJSON().encode('utf-8')
                elif (dataset.startswith('Fortune')):
                    jsonData = scbFortuneRequest().getJSON().encode('utf-8')
                else:
                    raise RuntimeError('Invalid scb request.')

                self.send_response(200)
                self.send_header('Content-Type',
                        'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(jsonData)

            except RuntimeError as e:
                self.send_response(404)
                self.send_header('Content-Type',
                             'text/plain; charset=utf-8')
                self.end_headers()
                self.wfile.write("(404) Invalid SCB Request.".encode('utf-8'))

        # HTML 
        elif(self.path.startswith('/')):
            if self.path == '/':
                self.path += 'index.html'

            self.send_response(200)
            self.send_header('Content-Type',
                         'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(open("./app" + self.path).read().encode('utf-8'))

        else:
            self.send_response(404)
            self.send_header('Content-Type',
                         'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write("(404) Invalid API Path".encode('utf-8'))

if __name__ == '__main__':
    from http.server import HTTPServer
    server = HTTPServer(('localhost', 8080), GetHandler)
    print('Starting server, use <Ctrl-C> to stop')
    server.serve_forever()
