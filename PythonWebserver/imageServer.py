from http.server import BaseHTTPRequestHandler, HTTPServer
import socketserver
import time
import os
import requests

hostName = "localhost"
serverPort = 8080


params = {'get': 'true', 'id': '04287df2-8676-411f-85f7-9e019fc99bf5'}

response = requests.get('http://127.0.0.1:8080', params=params)
print(response.url)
print(response.params)

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        file = open("index.html", 'r')
        self.wfile.write(bytes(file.read(), "utf-8") )

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")