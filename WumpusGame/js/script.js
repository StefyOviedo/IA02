var debug;
window.onload = function()
{
	mundosWumpus = [];
	
	function loadJSON(path, success, error)
	{
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
	        if (xhr.readyState === 4)
	        {
	            if (xhr.status === 200)
	            {
	                if (success)
	                {
	                    success(JSON.parse(xhr.responseText));
	                }
	            }
	            else
	            {
	                if (error)
	                {
	                    error(xhr);
	                }
	            }
	        }
	    };
	    xhr.open("GET", path, true);
	    xhr.send();
	}
	loadJSON('js/mundos.json',
        function(data)
        {
        	mundosWumpus = data;
        	iniciaJuego(1); //Iniciar el juego índicando el número del mundo a jugar...
        	//Cargar el Combo con la cantidad de Mundos Displonibles...
        	for(var i = 1; i <= mundosWumpus.length; i++)
			{
			   var opt = document.createElement("option");
			   opt.value = i;
			   opt.innerHTML = "Mundo Número " + i;
			   nom_div("SelMundos").appendChild(opt);
			}
			//Cargar el mundo según se seleccione...
			nom_div("SelMundos").addEventListener('change', function(event)
			{
				iniciaJuego(this.value);
			});
        },
        function(xhr)
        {
        	console.error(xhr);
        }
    );

	
	//

	var llevaOro = false; //Si el personaje ya lleva el Oro...
	var wumpusMuere = false; //Sí el Wunpus ha muerto...
	var numFlechas = 0; //La cantidad de fechas disponibles...

	var muere = 0; //sí el personaje ha muerto...
	var mundo = 0; //El número del mundo a cargar...
	var numCeldas = 0; //las dimensiones del escenario...
	var dimensionesElementos = 64; //Dimensiones de los elementos del mundo
	var direccion = 0; //La dirección hacía la cual se moverá el aventurero...
	var caminar = false; //sí el aventurero está caminado o no...
	var animaMovimiento = false; //sí se está realizado la animación de movimiento...
	//Calcular el ancho del escenario...
	var anchoEscena = 0; //
	//límites de la escena...
	var maxEscena = 0;
	//var txtDirecciones = ["Izquierda", "Arriba", "Derecha", "Abajo"];
	var direcciones = ["left", "top", "right", "front"];
	posRevisa = [[0, -1], [-1, 0], [0, 1], [1, 0]];
	var paso = 1;
	posPersonaje = []; //Guardará la posición (fila, columna) donde se encuentra el personaje...
	numWunmpusVisibles = []; //Guardará los wumpus que están visibles...
	//iniciaJuego(1); //Iniciar el juego índicando el número del mundo a jugar...

	iniciaJuego = function(numMundo)
	{
		reinciavariables();
		mundo = numMundo - 1;
		numFlechas = mundosWumpus[mundo].posWumpus.length;
		nom_div("numflecha").innerHTML = numFlechas + " Disponible(s)";
		numCeldas = mundosWumpus[mundo].dimensiones;
		console.log("La cantidad de celdas es: " + numCeldas);
		nom_div("escenario").innerHTML = crea_escenario(numCeldas);
		anchoEscena = numCeldas * dimensionesElementos;
		//límites de la escena...
		maxEscena = anchoEscena - dimensionesElementos;
		nom_div("escenario").style.width = anchoEscena + "px";
	    nom_div("escenario").style.height = anchoEscena + "px";
	    //Poner al personaje en el escenario...
		var posX = mundosWumpus[mundo].posAventurero[1] * 64;
		var posY = mundosWumpus[mundo].posAventurero[0] * 64;
		nom_div("personaje").setAttribute("class", "basepersonaje front_1");
		nom_div("personaje").style.top = posY + "px";
		nom_div("personaje").style.left = posX + "px";		
		posPersonaje[0] = mundosWumpus[mundo].posAventurero[0];
		posPersonaje[1] = mundosWumpus[mundo].posAventurero[1];
		percePersonaje();
	}

	var reinciavariables = function()
	{
		nom_div("percibe").innerHTML = "";
		llevaOro = false; //Si el personaje ya lleva el Oro...
		wumpusMuere = false; //Sí el Wunpus ha muerto...
		numFlechas = 0; //La cantidad de fechas disponibles...
		muere = 0; //sí el personaje ha muerto...
		mundo = 0; //El número del mundo a cargar...
		numCeldas = 0; //las dimensiones del escenario...
		dimensionesElementos = 64; //Dimensiones de los elementos del mundo
		direccion = 0; //La dirección hacía la cual se moverá el aventurero...
		caminar = false; //sí el aventurero está caminado o no...
		animaMovimiento = false; //sí se está realizado la animación de movimiento...
		//Calcular el ancho del escenario...
		anchoEscena = 0; //
		//límites de la escena...
		maxEscena = 0;
		//txtDirecciones = ["Izquierda", "Arriba", "Derecha", "Abajo"];
		//direcciones = ["left", "top", "right", "front"];
		//posRevisa = [[0, -1], [-1, 0], [0, 1], [1, 0]];
		paso = 1;
		posPersonaje = []; //Guardará la posición (fila, columna) donde se encuentra el personaje...
		numWunmpusVisibles = []; //Guardará los wumpus que están visibles...
		//iniciaJuego(1); //Iniciar el juego índicando el número del mundo a jugar...
	}

	function percePersonaje()
	{
		//Revisar si hay avismos y wumpus cercanos...
		var hayAvismo = false; //Dirá si existe un avismo...
		var hayWumpus = false; //Índica si existe un wumpus...
		posTmp = [0, 0]; //La posición donde revisará los objetos adyacentes a la posición actual del personaje...
		var estilo = "piso"; //El valor por defecto si no encuentre percepción/inferencia...
		var txtPercibe = "<font color = 'purple'> No hay peligro en la cercanías"; //El texto de las percenpciones....
		
		var numWumpus = 0;
		var posY = 0;
		var posX = 0;

		var tieneOro = false; //Si el personaje ya tiene el oro...
		var caeWumpusMuerto = false; //si el wumpos est
		/*
		Saber si el personaje muere por que hay
		caído en un avismo (1) o por qué ha caído en la casilla del wumpus (2).
		Además verificar si ha tomado el ORO..
		
		NOTA
		
		Es necesario refactorizar el código para realizar las percepciones del agente de mejor manera...
		El código es funcional pero resulta redundate en algunas situaciones...
		*/
		for(var opc = 1; opc <= 2; opc++)
		{
			for(var i in posRevisa)
			{
				if(opc == 1)//Saber si muere...
				{
					posTmp[0] = posPersonaje[0]; //Fila 		5
					posTmp[1] = posPersonaje[1]; // Columna.. 	0
					//console.log("Valor I entra para opc 1: " + i);
				}
				else
				{
					//posRevisa = [[0, -1], [-1, 0], [0, 1], [1, 0]];
					posTmp[0] = posPersonaje[0] + posRevisa[i][0];//4
					posTmp[1] = posPersonaje[1] + posRevisa[i][1];//0
				}
				if((posTmp[0] >= 0 && posTmp[0] < numCeldas) && (posTmp[1] >= 0 && posTmp[1] < numCeldas))
				{
					//Buscar en el array de Avismos...
					//console.log(posTmp);
					//mundo
					for(var c in mundosWumpus[mundo].posAvismos)
					{
						if(posTmp[0] == mundosWumpus[mundo].posAvismos[c][0] && posTmp[1] == mundosWumpus[mundo].posAvismos[c][1])
						{
							if(opc == 1)
							{
								muere = 1;//El personaje está sobre un avimos...
							}
							else
							{
								hayAvismo = true; //refactor...
							}
							break;
						}
						//console.log("Avismo: " + mundosWumpus[mundo].posAvismos[c]);
					}
					//Saber si hay Wumpus cercano...
					if(muere == 0)
					{
						for(var c in mundosWumpus[mundo].posWumpus)
						{
							if(posTmp[0] == mundosWumpus[mundo].posWumpus[c][0] && posTmp[1] == mundosWumpus[mundo].posWumpus[c][1])
							{
								if(opc == 1)
								{
									if(!wumpusMuere)
									{
										muere = 2; //Cayó en la casilla del Wumpus...
									}
									else
									{
										caeWumpusMuerto = true; //refactor...
									}
									numWumpus = c; //El número del Wumpus que ha matado al aventurero...
								}
								else
								{
									hayWumpus = true;
								}
								break;
							}
							//console.log("Wumpus: " + mundosWumpus[mundo].posWumpus[c]);
						}
					}
					if(muere == 0 && opc == 1 && !llevaOro) //refactor...
					{
						//Saber si está en la casilla que contiene el oro...
						for(var c in mundosWumpus[mundo].posOro)
						{
							if(posTmp[0] == mundosWumpus[mundo].posOro[c][0] && posTmp[1] == mundosWumpus[mundo].posOro[c][1])
							{
								llevaOro = tieneOro = true;
								break;
							}
						}
					}
				}
				//Sólo realizará una vez el proceso...
				if(opc == 1)
				{
					break;
				}
			}
			if(muere != 0)
			{
				//console.log("Muere...");
				break;
			}
		}
		if(muere == 0)
		{
			if(hayAvismo && hayWumpus)
			{
				estilo = "viento_hedor";
				audios("sounds/union.mp3");
				txtPercibe = "<b><font color = 'orange'>Hay Viento y Hedor hay un avismo o  el Wumpus esta cerca</b>";
			}
			else
			{
				if(hayAvismo)

				{
					estilo = "viento";
					audios("sounds/viento.mp3");
					txtPercibe = "<b><font color = 'green'>Hay viento, existe un avismo cercano</font></b>";
				}
				else
				{
					if(hayWumpus)
					{
						estilo = "hedor";
						audios("sounds/wump.mp3");
						txtPercibe = "<b><font color = 'red'>Hay Hedor, el Wumpus está cerca<font></b>";
					}
				}
			}
			if(tieneOro)

			{
				var posY = mundosWumpus[mundo].posOro[0][0] * 64;
				var posX = mundosWumpus[mundo].posOro[0][1] * 64;
				nom_div("oro_0").setAttribute("class", "brillo basewumpus");
				nom_div("oro_0").style.top = posY + "px";
				nom_div("oro_0").style.left = posX + "px";
				audios("sounds/Star.mp3");
				txtPercibe += " <b><font color = 'yellow'>Tienes el oro...<font></b>";
				nom_div("numgold").innerHTML = "<font color = 'purple'> Cargados = 1 - Entregados = 0";	
				tieneOro = false;
			}
			if(caeWumpusMuerto)
			{
				var posY = mundosWumpus[mundo].posWumpus[numWumpus][0] * 64;
				var posX = mundosWumpus[mundo].posWumpus[numWumpus][1] * 64;
				console.log("Valo numWumpus es: " + numWumpus);
				nom_div("w_" + numWumpus).setAttribute("class", "muerto basewumpus");
				nom_div("w_" + numWumpus).style.top = posY + "px";
				nom_div("w_" + numWumpus).style.left = posX + "px";
				//refactor...
			}
		}
		else
		{
			if(llevaOro)
			{
				var posY = mundosWumpus[mundo].posOro[0][0] * 64;
				var posX = mundosWumpus[mundo].posOro[0][1] * 64;
				nom_div("oro_0").setAttribute("class", "basemundo oro basewumpus");
				nom_div("oro_0").style.top = posY + "px";
				nom_div("oro_0").style.left = posX + "px";
				nom_div("numgold").innerHTML = "<font color = 'purple'> Cargados = 0 - Entregados = 0";
				llevaOro = false;
			}
			//Posicionar al personaje en el punto de inicio de nuevo...
			if(muere == 1)//Avismo..
			{
				estilo = "avismo";
				audios("sounds/muere.mp3");
				txtPercibe = " <b><font color = 'blue'>El aventurero a muerto, cayó en un avismo...<font></b>";
			}
			else
			{
				estilo = "piso";
				audios("sounds/muere.mp3");
				txtPercibe = "<b><font color = 'blue'>El aventurero a muerto, el Wumpus lo ha deborado<font></b>";
				//Ubicar el div del Wumpus...
				var posY = mundosWumpus[mundo].posWumpus[numWumpus][0] * 64;
				var posX = mundosWumpus[mundo].posWumpus[numWumpus][1] * 64;
				console.log("Valo numWumpus es: " + numWumpus);
				nom_div("w_" + numWumpus).setAttribute("class", "basemundo wumpus basewumpus");
				nom_div("w_" + numWumpus).style.top = posY + "px";
				nom_div("w_" + numWumpus).style.left = posX + "px";
				//Saber si el valor ya se ha almacenado en el vector de wumpus Visibles...
				var estabaAlmacenado = false;
				for(var i in numWunmpusVisibles)
				{
					if(numWunmpusVisibles[i] === numWumpus)
					{
						estabaAlmacenado = true;
						break;
					}
				}
				if(!estabaAlmacenado)
				{
					numWunmpusVisibles.push(Number(numWumpus));
				}
			}
		}
		nom_div("percibe").innerHTML += txtPercibe + "<br>";
		nom_div("percibe").scrollTop = "10000";
		var posCelda = "d_" + posPersonaje[0] + "_" + posPersonaje[1];
		nom_div(posCelda).setAttribute("class", "basemundo " + estilo);
	}

	function crea_escenario (celdas)
	{
		var txt = "<table id='chess_board' cellpadding='0' cellspacing='0'>";
		var nom_div = "";
		var i = 0;
		//var estilo = "";
		for(i = 0; i < celdas; i++)
		{
			txt += "<tr>";
			for(var c = 0; c < celdas; c++)
			{
				nom_div = "d_" + i + "_" + c;
				txt += "<td id = '"+(nom_div)+"'></td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		txt += "<div id = 'personaje'></div>";
		//Para crear la cantidad de Wumpus solicitada...
		for(i = 0; i < mundosWumpus[mundo].posWumpus.length; i++)
		{
			txt += "<div id = 'w_"+i+"'></div>";
		}
		//la cantidad de "oros" que existirán en el escenario...
		for(i = 0; i < mundosWumpus[mundo].posOro.length; i++)
		{
			txt += "<div id = 'oro_"+i+"'></div>";
		}
		return txt;
	}

	var numPos = [];
	setInterval(function()
	{
		if(caminar || animaMovimiento)
		{
			nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_" + paso);
			paso++;
			if(paso >= 5)
			{
				paso = 1;
				numPos[0] = posPersonaje[0] + posRevisa[direccion][0];
				numPos[1] = posPersonaje[1] + posRevisa[direccion][1];
				if((numPos[0] >= 0 && numPos[0] < numCeldas) && (numPos[1] >= 0 && numPos[1] < numCeldas))
				{
					posPersonaje[0] += posRevisa[direccion][0];
					posPersonaje[1] += posRevisa[direccion][1];
					percePersonaje(); //Buscar la percepción del persoje...
				}
				if(!caminar)
				{
					animaMovimiento = false;
					nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
				}
			}
			var posX = parseInt(nom_div("personaje").style.left);
			var posY = parseInt(nom_div("personaje").style.top);
			switch(direccion)
			{
				case 0: posX -= 16; break;
				case 1: posY -= 16; break;
				case 2: posX += 16; break;
				case 3: posY += 16; break;
			}
			if((posX >= 0 && posX <= maxEscena) && (posY >= 0 && posY <= maxEscena))
			{
				nom_div("personaje").style.left = posX + "px";
				nom_div("personaje").style.top = posY + "px";
			}
			if(muere != 0)
			{
				//audios("sounds/muere.mp3");
				posY = mundosWumpus[mundo].posAventurero[0] * 64;
				posX = mundosWumpus[mundo].posAventurero[1] * 64;
				nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
				nom_div("personaje").style.top = posY + "px";
				nom_div("personaje").style.left = posX + "px";
				//console.log("Pos es: " + mundosWumpus[mundo].posAventurero);		
				posPersonaje[0] = mundosWumpus[mundo].posAventurero[0];
				posPersonaje[1] = mundosWumpus[mundo].posAventurero[1];
				muere = 0;
			}
		}
	}, 130);

	function disparaFlecha()
	{
		var txtPercibe = "<font color = 'purple'>No hay flechas disponibles :(";
		var muere = false;
		if(numFlechas != 0)
		{
			for(var i = 0; i < mundosWumpus[mundo].posWumpus.length; i++)
			{
				//Izquierda, Derecha...
				console.log("Pos: " + direccion);
				if(direccion == 0 || direccion == 2)
				{
					if(mundosWumpus[mundo].posWumpus[i][0] === posPersonaje[0])
					{
						console.log("Fila: " + mundosWumpus[mundo].posWumpus[i][0]);
						//Buscar la fila...
						if(direccion == 0)
						{
							if(mundosWumpus[mundo].posWumpus[i][0] <= posPersonaje[0])
							{
								console.log("Ingresa uno");
								muere = true;
							}
						}
						else
						{
							if(mundosWumpus[mundo].posWumpus[i][0] > posPersonaje[0])
							{
								console.log("Ingresa dos");
								muere = true;
							}
						}
					}
				}
				else
				{
					console.log("Columna: " + mundosWumpus[mundo].posWumpus[i][0]);
					if(mundosWumpus[mundo].posWumpus[i][1] === posPersonaje[1])
					{
						if(direccion == 1)
						{
							if(mundosWumpus[mundo].posWumpus[i][1] <= posPersonaje[1])
							{
								muere = true;
								console.log("Ingresa tres");
							}
						}
						else
						{
							console.log("personaje: " + posPersonaje[1] + " Wumpus esta: " + mundosWumpus[mundo].posWumpus[i][1]);
							if(mundosWumpus[mundo].posWumpus[i][1] > posPersonaje[1])
							{
								muere = true;
								console.log("Ingresa cuatro");
							}	
						}
					}
				}
				if(muere)
				{
					numWumpus = i;
					break;
				}
			}
			if (muere)
			{
				wumpusMuere = true;
				audios("sounds/grito.mp3");
				txtPercibe = "<font color = 'purple'>Haz asesinado al Wumpus";
				//Saber si el wumpus está visible...
				var estabaVisible  = false;
				for(var i in numWunmpusVisibles)
				{
					if(numWunmpusVisibles[i] === numWumpus)
					{
						estabaVisible = true;
						break;
					}
				}
				if(estabaVisible)
				{
					var posY = mundosWumpus[mundo].posWumpus[numWumpus][0] * 64;
					var posX = mundosWumpus[mundo].posWumpus[numWumpus][1] * 64;
					console.log("Valo numWumpus es: " + numWumpus);
					nom_div("w_" + numWumpus).setAttribute("class", "muerto basewumpus");
					nom_div("w_" + numWumpus).style.top = posY + "px";
					nom_div("w_" + numWumpus).style.left = posX + "px";
				}
			}
			else
			{
				txtPercibe = "<font color = 'purple'> El wumpus no ha muerto...";	
			}
			numFlechas--;
			nom_div("numflecha").innerHTML = numFlechas + " Disponible(s)";
		}
		nom_div("percibe").innerHTML += txtPercibe + "<br>";
		nom_div("percibe").scrollTop = "10000";
	}
	
	function audios(audio)
	{
		var txt = "<audio autoplay>";
		txt += "<source src = '"+(audio)+"' type = 'audio/mpeg'></audio>";
		nom_div("sonido").innerHTML = txt;
	}

	var presionado = false; //Sí la tecla ha sido presionada...
	window.onkeydown = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which;
		if(!presionado)
		{
			if(code >= 37 && code <= 40)//37, 38, 39, 40
			{
				direccion = code - 37;
				nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
			}
			else
			{
				if(code == 65) //a
				{
					//if(caminar == false && animaMovimiento == false)
					if(!caminar && !animaMovimiento)
					{
						animaMovimiento = caminar = true;
					}
				}
				else
				{
					if(code == 83)//S
					{
						disparaFlecha();
					}
				}
			}
			presionado = true;
		}
	}
	window.onkeyup = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which;
		if(presionado)
		{
			if(code == 65)
			{
				if(caminar == true)
				{
					caminar = false;
				}
			}
			presionado = false;
		}
	}

	function nom_div(div)
	{
		return document.getElementById(div);
	}
}