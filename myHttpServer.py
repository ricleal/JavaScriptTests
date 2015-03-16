#!/usr/bin/python

"""
Save this file as server.py
>>> python server.py 0.0.0.0 8001
serving on 0.0.0.0:8001

or simply

>>> python server.py
Serving on localhost:8000

You can use this to test GET and POST methods.

"""

import SimpleHTTPServer
import SocketServer
import logging
import cgi
import argparse
import sys

def set_command_line_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument('--verbose', '-v', action='store_true', help='verbose flag', default=False)
    parser.add_argument('--host', '-n', action='store', help='host name', default="localhost")
    parser.add_argument('--port', '-p', action='store', help='port', type=int, default=8000)
    params = parser.parse_args()
    return params


class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_GET(self):
        logging.info("============ GET STARTED ==========")
        logging.debug("*********** Headers **************")
        logging.debug(self.headers)
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        logging.info("============ POST STARTED ==========")
        logging.debug("*********** Headers **************")
        logging.debug(self.headers)
        logging.debug("*********** Post Content **************")
        length = int(self.headers.getheader('content-length'))
        data = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)

        logging.debug("%s\n"%data)
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)



class MyTCPServer(SocketServer.TCPServer):
    """
    Server that makes sure the socket closes down when
    Ctrl+C is hit 
    """
    allow_reuse_address = True

def main():
    params = set_command_line_arguments();

    if params.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    else:
        logging.getLogger().setLevel(logging.INFO)

    Handler = ServerHandler
    httpd = MyTCPServer((params.host, params.port), Handler)
    logging.info("Serving at: http://%s:%d" %(params.host, params.port) )
    httpd.serve_forever()
    
    
    

if __name__ == "__main__":
    main()