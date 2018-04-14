from http.server import BaseHTTPRequestHandler
from urllib import parse
from socStyrelsenRequest.socRequest import SocRequest

class GetHandler(BaseHTTPRequestHandler):

    def do_GET(self):

        if(self.path == '/'):
            self.send_response(200)
            self.send_header('Content-Type',
                         'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(open("./app/index.html").read().encode('utf-8'))

        elif(self.path.startswith('/soc')):
            diagnose = self.path.strip('/soc')
            self.send_response(200)
            self.send_header('Content-Type',
                         'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(SocRequest().getDiagnoseJson(diagnose).encode('utf-8'))

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
