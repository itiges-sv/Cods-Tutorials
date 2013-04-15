var usuarios = new Array();
usuarios[0] = {'usuario':'jblandon','pass':'12345','foto':'img/jblandon.jpg'};
usuarios[1] = {'usuario':'blandon.jaime','pass':'12345','foto':'img/blandon.jpg'};
usuarios[2] = {'usuario':'krann','pass':'12345','foto':'img/krann.jpg'};

var usuario = "";
var foto = "";

$(document).ready(inicio);

function inicio()
{
	$('#login_btn').on('click', mostrarTweets);
	$('#tweet_btn').on('click', enviarTweet);
}

function mostrarTweets()
{
	usuario = $('#usuario').val();
	var password = $('#pass').val();

	if(auth_login(usuario,password)){ //Verificando si el usuario y contraseña son válidos

		efectosCss();
		conectarseSocketServer();

	}else{
		//Si el Usuario y contraseña no son válidos, entonces limpiar las cajas de texto y colocar mensaje de error
		$('#error').html('Usuario y Contraseña no son Válidos');
	}
	
}


function conectarseSocketServer()
{
	var ws = new WebSocket("ws://localhost:1777/conectar");
	ws.onmessage = agregarTweet;
	console.log("conectado !");
}

function agregarTweet(mensaje)
{
	datos = $.parseJSON(mensaje.data);
	//console.log(mensaje);
	//console.log(datos);
	$('#tweets').prepend("<div class='tweet-container'>"
		+"@"+datos.usuario+": "+datos.mensaje + "<p class='tweet-date'>"+"<img src='"+datos.foto+"' />"+getFechaActual()+'</p>');
	$('#mensaje').val('');
	$('#mensaje').focus();
}


function enviarTweet()
{
	var mensaje = $('#mensaje').val();

	$.get('http://localhost:1777/tweet?usuario='+usuario+'&foto='+foto+'&mensaje='+mensaje, exito,fallo);

	/*TODO: implementar websocket

	$('#tweets').prepend("<div class='tweet-container'>"
		+"@"+usuario+": "+mensaje + "<p class='tweet-date'>"+"<img src='"+foto+"' />"+getFechaActual()+'</p>');
	$('#mensaje').val('');
	$('#mensaje').focus();*/
}

function exito(data)
{
	//IMPLEMENTAR
}
function fallo(e){
	alert("Ha Ocurrido un Error: " + e);
}

//Función para verificar login: OJO: Esta verificación es para fin práctico, pero NUNCA se debería de verificar el login del lado del Cliente
function auth_login(usuario,password)
{
	var encontrado = false;
	$.each(usuarios,function(indice, item){
		console.log('usuario = ' + item.usuario + item.pass);
		if(item.usuario==usuario && item.pass==password){
			foto = item.foto;
			encontrado = true;
			return false; //rompiendo el each
		}
	});
	return encontrado;
}

function getFechaActual(){
	var fullDate = new Date();
	var fecha =  fullDate.toLocaleDateString()+' '+fullDate.toLocaleTimeString()
	console.log('fecha = '+ fecha);
	return fecha;
}

function efectosCss(){
	var css = {'top':'12%'};
	
		$('#loginPane').hide(); //Se esconde el formulario de login

		//Efecto de entrada del text area y los divs de los tweets
		$('#tweetbox').css(css);
		css = {'position':'relative'};
		css = {'bottom':'7%'};
		$('#tweets').css(css);
		css = {'position':'relative'};

		//Colocando focus en textarea de envio de tweet
		$('#mensaje').val('');
		$('#mensaje').focus();
}