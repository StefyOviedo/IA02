window.onload = function()
{
	//alert("Cargó");
	inicio();
}

function audios(audio)
	{
		var txt = "<audio autoplay>";
		txt += "<source src = '"+(audio)+"' type = 'audio/mpeg'></audio>";
		nom_div("sonido").innerHTML = txt;
	}

var debug = "";


//Inicio de la aplición...
function inicio()
{
	vectorMinMAX = []; //Nuevo..
	var terminaJuego = false; //Para saber si el juego ha terminado...
	var puntuaJuego = [0, 0]; //Guarda las puntuaciones de Juego...
	var turnos = 0; //Para dar turnos por usuario...
	var txtFichas = ["X", "O"];
	var fichaJugador = 1;
	var pc = 0;
	
		
	function creaEscenario()
	{
		var txt = "<table id = 'chess_board' cellpadding = '0' cellspacing = '0'>";
		var divTabla = "";
		for(var i = 0; i < 3; i++)
		{
			txt += "<tr>";
			for(var c = 0; c < 3; c++)
			{
				divTabla = i + "_" + c;
				txt += "<td id = '"+(divTabla)+"'></td>";
				vectorMinMAX.push(0); //Nuevo...
			}
			txt += "</tr>";
		}
		txt += "</table>";
		return txt;
	}
	nom_div("escenario").innerHTML = creaEscenario();
	for(var i = 0; i < 3; i++)
	{
		for(var c = 0; c < 3; c++)
		{
			nom_div(i + "_" + c).addEventListener('click', function(event)
			{
				//debug = event;
				var pos = event.target.id.split("_");
				//alert(pos);
				//alert("Ingresa");
				if(nom_div(this.id).innerHTML == "" && !terminaJuego)
				{
					 //Pone la ficha según la selección...
					nom_div(this.id).innerHTML = txtFichas[fichaJugador - 1];
					//Bloquear la selección de Jugada...
					nom_div("seleJugada").disabled = true;
					//Guarda la posición seleccionada...
					posMinMax(Number(pos[0]), Number(pos[1]), 1);
					procesarJugada(fichaJugador, 1);
				}
			});
		}
	}

	function posMinMax(fila, columna, jugador)
	{
		var ind = 0;
		console.log("Fila : " + fila + " columna : " + columna + " jugador: " + jugador);
		//ind = 2
		/*
		fila = 2
		columna = 1
		Matriz -> Vector
		Vector -> Matriz...
		*/
		if(fila == 0)
		{
			ind = columna; //2
		}
		else
		{
			if(fila == 1)
			{
				ind = columna + 3;
			}
			else
			{
				ind = columna + 6;
			}
		}
		vectorMinMAX[ind] = jugador;
	}

	function procesarJugada(fichaLlega, jugador)
	{
		var nomJugador = ["Humano", "PC"];
		var hayTriqui = revisarTriqui(jugador);
		var quedaTablas = entablas();
		var txtPuntua = "";
		
		//No hay triqui y además hay espacio
		if(!hayTriqui && !quedaTablas)
		{
			if(jugador == 1)
			{
				juegaPC();
			}
		}
		else
		{
			
			if(hayTriqui)
			{
				

				//Resalta el triqui del usuario...
				resaltarTriqui(fichaLlega);
				
				console.log("EL jugador triqui es: " + jugador);
				puntuaJuego[jugador - 1]++;
				txtPuntua = "Humano = "+(puntuaJuego[0])+" - PC = " + puntuaJuego[1] ;

				nom_div("puntuacion").innerHTML = txtPuntua;
				alert("Ha hecho triqui El " + nomJugador[jugador - 1]);

				if(nomJugador[jugador - 1] == "PC")
				{
					audios("002.mp3");
				}else
				{
					audios("001.mp3");
				}
			
			}
			else
			{

				alert("El juego ha quedao en Tablas");
			}
			terminaJuego = true;
		}
	}


	function entablas()
	{
		var empatados = true;
		for(var i = 0; i < vectorMinMAX.length; i++)
		{
			if(vectorMinMAX[i] == 0)
			{
				empatados = false;
				break;
			}
		}
		return empatados;
	}

	//Para revisar si hay triqui o no...
	function revisarTriqui(ficha)
	{
		//HORIZONTAL
		var estriqui = (vectorMinMAX[0] == ficha && vectorMinMAX[1] == ficha && vectorMinMAX[2]==ficha);
		estriqui = estriqui || (vectorMinMAX[3] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[5]==ficha);
		estriqui = estriqui || (vectorMinMAX[6] == ficha && vectorMinMAX[7] == ficha && vectorMinMAX[8]==ficha);
		//VERTICALES
		estriqui = estriqui || (vectorMinMAX[0] == ficha && vectorMinMAX[3] == ficha && vectorMinMAX[6]==ficha);
		estriqui = estriqui || (vectorMinMAX[1] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[7]==ficha);
		estriqui = estriqui || (vectorMinMAX[2] == ficha && vectorMinMAX[5] == ficha && vectorMinMAX[8]==ficha);
		//DIAGONAlES
		estriqui = estriqui || (vectorMinMAX[0] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[8]==ficha);
		estriqui = estriqui || (vectorMinMAX[2] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[6]==ficha);
		return estriqui;
	}

	function resaltarTriqui(ficha)
	{
		//console.log("LLega aca y Resalta");
		var cont = 0;
		var estriqui = false;
		var d = i = c = 0;
		var valCampo = 0;
		var celdasTriqui = []; //Guardará las celdas del triqui...
		//Horizontal y Vertical...
		for(d = 1; d <= 2; d++)
		{
			for(i = 0; i < 3; i++)
			{
				cont = 0;
				for(c = 0; c < 3; c++)
				{
					if(d == 1)//Horizontales...
					{
						valCampo = nom_div(i+"_"+c).innerHTML;
						celdasTriqui[cont] = i + "_" + c;
					}
					else
					{
						valCampo = nom_div(c+"_"+i).innerHTML;
						celdasTriqui[cont] = c + "_" + i;
					}
					if(valCampo === txtFichas[ficha - 1])
					{
						cont++;
					}
				}
				if(cont == 3)
				{
					estriqui = true;
					break;
				}
			}
			if(estriqui == true)
			{
				break;
			}
		}
		//Valida las diagonales...
		if(estriqui == false) // if(!estriqui)
		{
			//Buscar las diagonales...
			for(d = 1; d <= 2; d++)
			{
				cont = 0;
				for(i = 0, c = 2; i < 3; i++, c--)
				{
					if(d == 1)//Diaginal de izquierda a derecha...
					{
						valCampo = nom_div(i+"_"+i).innerHTML;
						celdasTriqui[cont] = i + "_" + i;
					}
					else
					{
						valCampo = nom_div(i+"_"+c).innerHTML;
						celdasTriqui[cont] = i + "_" + c;
					}
					if(valCampo === txtFichas[ficha - 1])
					{
						cont++;
					}
				}
				if(cont == 3)
				{
					estriqui = true;
					break;
				}
			}
		}
		if(estriqui)
		{
			//Resaltar el triqui...
			var parDatos = "";
			var celda = "";
			for(i = 0; i < 3; i++)
			{
				for(c = 0; c < 3; c++)
				{
					celda = nom_div(i+"_"+c);
					for(d = 0; d < 3; d++)
					{
						parDatos = celdasTriqui[d].split("_");
						if(Number(parDatos[0]) == i && Number(parDatos[1]) == c)
						{
							celda.style.color = "purple";
							celda.style.fontSize = "110px";
							celda.style.borderColor = "purple";
							break;
						}
						else
						{
							celda.style.color = "gray";
							celda.style.fontSize = "20px";
							celda.style.borderColor = "gray"
						} 
					}
				}
			}
		}
		return estriqui;
	}

	//Para hacer la jugada del PC...
	function juegaPC()
	{
		//Determinar la ficha que le corresponde al PC en 
		//función a la que tiene el juagdor...
		var fila = 0;
		var columna = 0;
		var pc = 0;
		var fichaPC = 1;
		//var valCampo = "";
		if(fichaJugador == 1)
		{
			fichaPC = 2;
		}
		/*
			Matriz -> Vector
			vector -> Matriz
		*/
		do
		{
			pc = Math.floor((Math.random() * 9) + 1);
			if(pc <= 3)
			{
				fila = 0;
				columna = pc - 1;
			}
			else
			{
				if(pc <= 6)
				{
					fila = 1;
					columna = pc - 4;
				}
				else
				{
					fila = 2;
					columna = pc - 7;
				}
			}
			console.log("Aleatorio: " + pc + " Fila: " + fila + " columna: " + columna);
			//console.log("Fila: " + fila + " columna: " + columna);
			if(nom_div(fila+"_"+columna).innerHTML == "" && !terminaJuego)
			{
				nom_div(fila+"_"+columna).innerHTML = txtFichas[fichaPC - 1];
				posMinMax(fila, columna, 2);
				procesarJugada(fichaPC, 2);
				break;
			}
		}while(1);
	}
	//Fin de la jugada del PC...
	nom_div("seleJugada").addEventListener('change', function(event)
	{
		fichaJugador = Number(this.value);
		console.log("La ficha es: " + txtFichas[fichaJugador - 1]);
	});
	var limpiaEscenario = function()
	{
		terminaJuego = false;
		var cont = 0;
		for(i = 0; i < 3; i++)
		{
			for(c = 0; c < 3; c++)
			{
				nom_div(i+"_"+c).style.color = "black";
				nom_div(i+"_"+c).style.fontSize = "80px";
				nom_div(i+"_"+c).style.borderColor = "blue";
				nom_div(i+"_"+c).innerHTML = "";
				vectorMinMAX[cont] = 0;
				cont++;
			}
		}
		if(turnos % 2 == 0)
		{
			nom_div("inicia").innerHTML = "Inicia el PC";
			juegaPC();
		}
		else
		{
			nom_div("inicia").innerHTML = "Inicia el Humano";
			nom_div("seleJugada").disabled = false;
		}
		turnos++;
	}

	nom_div("iniJuego").addEventListener('click', function(event)
	{
		limpiaEscenario();
	});
}
	
function nom_div(div)
{
	return document.getElementById(div);
}
		