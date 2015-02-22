#!/usr/bin/python

"""

"""

import SimpleHTTPServer
import SocketServer
import logging
import cgi

# Debug level
import sys
logging.getLogger().setLevel(logging.DEBUG)


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

if __name__ == '__main__':
    if len(sys.argv) > 2:
        PORT = int(sys.argv[2])
        HOST = sys.argv[1]
    elif len(sys.argv) > 1:
        PORT = int(sys.argv[1])
        HOST = ""
    else:
        PORT = 8000
        HOST = ""

    Handler = ServerHandler
    httpd = MyTCPServer((HOST, PORT), Handler)
    print "Serving at: http://%(interface)s:%(port)s" % dict(interface=HOST or "localhost", port=PORT)
    httpd.serve_forever()
