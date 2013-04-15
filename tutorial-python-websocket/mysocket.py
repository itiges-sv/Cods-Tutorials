#ACA ESTAMOS IMPORTANDO LAS LIBRERIAS QUE UTILIZAREMOS
import tornado.ioloop #libreria para crear una instancia de servidor
import tornado.web #Servira para levantar el servidor web
from tornado import websocket #libreria para usar websockets

#Clase Como HandlerPrincipal, debe heredar de tornado.web.RequestHandler
#Lo que hace esta clase es manejar un request del lado del servidor
class HandlerPrincipal(tornado.web.RequestHandler):
	def get(self): #Aca estamos definiendo lo que realizara el servidor al
	               #Recibir una peticion HTTP Get
		print "Hola Mundo" #Cuando reciba un GET, imprimira Hola Mundo

GLOBALS = { #Este sera nuestro listado de sockets o clientes conectados
	'sockets':[] #Cada item de la lista se considerara un cliente que esta
	             #esperando respuestas cuando se actualiza informacion
}

#Ahora creamos nuestro socket, para esto utilizamos una clase que hereda de 
#WebSocketHandler
class ConectarSocket(websocket.WebSocketHandler):
	def open(self): #Este metodo dice que se hara cuando un cliente abra un socket
		GLOBALS['sockets'].append(self) #en este caso solo agregamos el socket a
		print "Socket Abierto"          #la lista.
	def on_close(self):
		GLOBALS['sockets'].remove(self) #cuando un socket se cierra lo sacamos
		print "Socket Cerrado"          #de la lista

#Lo que hace esta clase es manejar un request del lado del servidor
class ReplicarMensajes(tornado.web.RequestHandler):
	def get(self,*args,**kwargs): #para manejar la peticion GET,
	                              #la peticion recibira parametros por la url
		mensaje = self.get_argument('mensaje') #obteniendo el valor del mensaje
		#recorriendo el listado de todos los sockets registrados y enviandoles
		#el mensaje
		for socket in GLOBALS['sockets']:
			socket.write_message(mensaje)
		#imprimiendo en el navegador el mensaje Replicado a Todos
		self.write("Replicado a Todos")

#Ahora agregamos la ruta con la cual deben conectarse los sockets
application = tornado.web.Application(
	[
		(r"/", HandlerPrincipal)# Aca estamos diciendo que si se invoca una url
		                    #y despues del puerto se encuentra un /, entonces
		                    #la peticion sera ejecutada por nuestra clase
		                    #HandlerPrincipal
		#cuando se ingrese a http://localhost:8000/conectar
		#se abrira una conexion o socket
		,(r"/conectar",ConectarSocket) 
		#cuando se ingrese a http://localhost:8000/enviar?mensaje=Algun Texto
		#entonces ese mensaje "Algun Texto" se enviara a todos los clientes
		,(r"/enviar",ReplicarMensajes)
	]
)

## Estas lineas es solo para ejecutar la aplicacion
if __name__== "__main__": 
	application.listen(8000)
	tornado.ioloop.IOLoop.instance().start()