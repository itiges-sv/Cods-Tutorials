import tornado.ioloop
import tornado.web
from tornado import websocket

import json

GLOBALS = {
	'sockets':[]
}

class MainHandler(tornado.web.RequestHandler):
	def get(self):
		self.write('Utilizar Cualquiera de las siguientes URL: <br> /conectar: Para Conectarse al socket server <br> /tweet: Para enviar un tweet')

class ConectarSocket(websocket.WebSocketHandler):
	def open(self):
		GLOBALS['sockets'].append(self)
		print "Socket Abierto"
	def on_close(self):
		GLOBALS['sockets'].remove(self)
		print "Socket Cerrado"

class Tweet(tornado.web.RequestHandler):
	def get(self,*args,**kwargs):
		usuario = self.get_argument('usuario')
		foto = self.get_argument('foto')
		mensaje = self.get_argument('mensaje')

		respuesta = tornado.escape.json_encode({'usuario':usuario,'foto':foto,'mensaje':mensaje})

		for socket in GLOBALS['sockets']:
			socket.write_message(respuesta)
		self.write('Mensajes Notificados<br>')
		self.write('Mensaje Enviado a TODOS: ' + respuesta)

#configuracion de rutas
application = tornado.web.Application(
	[
		(r"/",MainHandler),
		(r"/conectar",ConectarSocket),
		(r"/tweet",Tweet),
	]
)

if __name__=="__main__":
	application.listen(1777)
	tornado.ioloop.IOLoop.instance().start()

