from http.server import BaseHTTPRequestHandler
from urllib import parse
from socStyrelsenRequest.socRequest import SocRequest

class GetHandler(BaseHTTPRequestHandler):

    def do_GET(self):


        if(self.path.startswith('/soc')):
            diagnose = self.path.strip('/soc')
            jsonData = None
            try:
                jsonData = SocRequest().getDiagnoseJson(diagnose).encode('utf-8')

                self.send_response(200)
                self.send_header('Content-Type',
                        'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(jsonData)

            except Exception as e:
                self.send_response(404)
                self.send_header('Content-Type',
                             'text/plain; charset=utf-8')
                self.end_headers()
                self.wfile.write("(404) Invalid Soc Diagnose Code".encode('utf-8'))

        elif(self.path.startswith('/')):
            if self.path == '/':
                self.path += 'index.html'

            self.send_response(200)
            self.send_header('Content-Type',
                         'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(open("./app" + self.path).read().encode('ISO-8859-1'))



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
