function numeros(){
	var opr = new Array(6);

	for (var i = 0 ; i < 6; i++) {
	 	opr[i] = prompt('Ingrese Numero: ','');
	 }


	 console.log("RESULTADOS");

	 for (var i = 0 ; i < 6; i++) {
	 	var par = pares(i);
	 	var primo = primos(i);

	 	if (par && primo) {
	 		console.log("El Numero " + opr[i] + " es un numero par y  primo, ");
	 	}else
	 	{
	 		if (par && !primo) {
	 			console.log("El Numero " + opr[i] + " es par, ");
	 		}else
	 		{
	 			console.log("El Numero " + opr[i] + " es primo, ");
	 		}
	 	}
	 }
}


function pares(num){
	if ((num % 2) == 0) {
		return true;
 	}else
 	{
 		return false;
 	}
}

function primos(num)
{
	if (num>2) {
		var cont = 2;
		var resul = true;

		while(resul && (cont!=num))
		{
			if ((num % cont) == 0) {
				resul = false;
		 	}
		 	cont = cont + 1;
		}
		return resul;
	}else
	{
		return false;
	}
}
