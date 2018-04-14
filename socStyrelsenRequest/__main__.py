from http.server import BaseHTTPRequestHandler
from urllib import parse
from socRequest import SocRequest

class GetHandler(BaseHTTPRequestHandler):

    def do_GET(self):

        if(self.path == '/soc2026'):
            self.send_response(200)
            self.send_header('Content-Type',
                         'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(SocRequest().getDiagnoseJson('2026').encode('utf-8'))

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
