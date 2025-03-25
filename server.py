from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        if self.path.endswith('.json'):
            try:
                with open(self.path[1:], 'r') as f:
                    data = json.load(f)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(data).encode())
            except Exception as e:
                self.send_error(500, str(e))
        else:
            super().do_GET()

httpd = HTTPServer(('localhost', 8000), CORSRequestHandler)
print("Server running at http://localhost:8000/")
httpd.serve_forever() 