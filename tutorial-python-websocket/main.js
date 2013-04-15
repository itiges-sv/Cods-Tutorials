$(document).ready(inicio);

function inicio(){
	//Primero le decimos a nuestro cliente que abra una conexión con el servidor
	//para ello se colocara la url de conectar, OJO, en lugar de poner http se pone
	//ws
	var wsocket = new WebSocket("ws://localhost:8000/conectar");
	//Cuando reciba un mensaje del lado del servidor. Esto es cuando
	//alguien haga uso de la ruta "/enviar?mensaje=" entonces
	//se recibirá el mensaje y se ejecutará la funcion mostrarMensaje
	wsocket.onmessage = mostrarMensaje;
	$('#enviar_btn').on('click',enviarMensaje);
}

function enviarMensaje()
{
	var mensaje = $('#mensaje').val();
	//Cuando se vaya a ejecutar en dominios diferentes o en computadoras distintas mejor utilizar $.ajax 
	//en lugar de get. seguir consejos en este link 
	//http://stackoverflow.com/questions/11463688/cross-origin-resource-sharing-cors-with-jquery-and-tornado
	$.get('http://localhost:8000/enviar?mensaje='+mensaje);	
}

function mostrarMensaje(mensaje)
{
	//Se agrega el mensaje en el cuerpo del html, 
	//dentro del objeto "mensaje" hay un atributo llamado "data"
	//en el cual vienen los datos que se replican del servidor
	$('body').append("<p>" + mensaje.data + "</p>");
}

