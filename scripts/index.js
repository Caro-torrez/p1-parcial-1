'use strict';

/*
 * TORREZ, CAROL
 */

/**
 * Llamada desde un boton. Pide los datos para un disco.
 */
function cargarJSON() {
    fetch('discos.json')
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar el archivo JSON");
            return response.json();
        })
        .then(data => {
            discos = data; // Reemplaza el array global
            console.log("Discos desde JSON:", discos);
            mostrar(); // O podés esperar y mostrarlos solo si se ordenan
        })
        .catch(error => console.error("Hubo un problema:", error));
}


 //VARIABLES GLOBALES
// Array para almacenar todos los discos del sistema
let discos = [];
        
// Variable para controlar el proceso de carga de pistas
let pistaCargada = 1;
let pistasDelDisco = [];
let discoCargado = {};

//FUNCIÓN PRINCIPAL: CARGAR DISCO 
/* Función que se ejecuta al hacer clic en "Cargar nuevo disco"
* Inicia el proceso de carga de un nuevo disco paso a paso*/

function cargar() {

 console.log('cargando nuevo disco');
            
 // Reiniciar variables para nuevo disco
    pistaCargada = 1;
    pistasDelDisco = [];
    discoCargado = {};
            
    //Solicitar datos del disco
    solicitarDatos();
}

function solicitarDatos() {
    console.log('Solicitando datos');
            
    //Nombre del disco
    let nombre = prompt("Ingresa el nombre del disco que deseas cargar:");
        if (!validarTextoNoVacio(nombre, "nombre del disco")) {
            return; 
        }
            
    //Autor/banda
    let autor = prompt("Ingresa el autor o banda del disco:");
        if (!validarTextoNoVacio(autor, "autor/banda")) {
            return;
        }
            
    //Portada
    let portada = prompt("Ingresa el link de la portada del disco:");
        if (!validarTextoNoVacio(portada, "portada")) {
            return;
        }
            
    //Código único
    let codigo = solicitarCodigoUnico();
        if (codigo === null) {
            return;
        }
            
    // Guardar datos del disco cargado
    discoCargado = {
        nombre: nombre.trim(),
        autor: autor.trim(),
        portada: portada.trim(),
        codigo: codigo,
        pistas: []
    };
    console.log('Datos guardados:', discoCargado);
            
    //Solicitar pistas
    solicitarPista();
}

function validarTextoNoVacio(texto, nombreCampo) {
    if (texto === null) {
        console.log(`El usuario canceló la carga del ${nombreCampo}`);
        return false;
    }
            
    if (texto.trim() === "") {
        alert(` El ${nombreCampo} no puede quedar vacío.`);
        console.log(`${nombreCampo} vacío`);
        return false;
    }
            
    return true;
}

//Solicitar codigo unico
function solicitarCodigoUnico() {
    console.log(' Solicitando código único del disco');
            
    while (true) {
        let codigoStr = prompt("🔢 Ingresa el código numérico único del disco (1-999):");
                
        // Si el usuario cancela
        if (codigoStr === null) {
            console.log('El usuario canceló la carga del código');
            return null;
        }
                
        // Convertir a número
        let codigo = parseInt(codigoStr);
                
        // Validar que sea un numero valido
        if (isNaN(codigo)) {
            alert("Debes ingresar un número válido. Recuerda el numero tiene que ser entre 1-999, ademas no puede coincidir con otros codigos que estan cargados.");
            continue;
        }
                
        // Validar rango (1-999)
        if (codigo < 1 || codigo > 999) {
            alert("El código debe estar entre 1 y 999.");
            continue;
                }
                
        // Verificar si el código ya existe
        if (codigoYaExiste(codigo)) {
            alert(`El código ${codigo} ya fue utilizado. Ingresa otro código.`);
            continue;
        }
        console.log(`Código válido: ${codigo}`);
        return codigo;
    }
        }

function codigoYaExiste(codigo) {
    return discos.some(disco => disco.codigo === codigo);
}

//Solicitar pistas
function solicitarPista() {
    console.log(`Solicitando pista ${pistaCargada}`);
            
    //Nombre de la pista
    let nombrePista = prompt(`Ingresa el nombre de la pista del disco ${pistaCargada}:`);
        if (!validarTextoNoVacio(nombrePista, "nombre de la pista")) {
               
        if (pistasDelDisco.length > 0) {
            finalizarCargaPistas();
        }
        return;
        }
            
    //Segundos de la pista
    let duracion = solicitarDuracionPista(nombrePista);
        if (duracion === null) {
                
        if (pistasDelDisco.length > 0) {
            finalizarCargaPistas();
        }
        return;
        }
            
    // Agregar pista al array temporal
    pistasDelDisco.push({
        nombre: nombrePista.trim(),
        duracion: duracion
    });
            
    console.log(`Pista ${pistaCargada} agregada:`, pistasDelDisco[pistasDelDisco.length - 1]);
            
    // Incrementar contador de pistas
    pistaCargada++;
            
    // Preguntar si desea agregar otra pista
    let agregarOtra = confirm(`¿Deseas agregar otra pista?`);
            
        if (agregarOtra) {
            // Continuar con la siguiente pista
            solicitarPista();
        } else {
            // Finalizar carga de pistas
            finalizarCargaPistas();
        }
}

//Solicitar duración de pista
function solicitarDuracionPista(nombrePista) {
    console.log(`Solicitando duración de la pista: ${nombrePista}`);
            
    while (true) {
        let duracionStr = prompt(`Ingresa la duración de "${nombrePista}" en segundos (0-7200):`);
                
    // Si el usuario cancela
        if (duracionStr === null) {
            console.log('El usuario canceló la carga de duración de la pista');
            return null;
        }
                
    // Convertir a número
    let duracion = parseInt(duracionStr);
                
    // Validar que sea un número válido
    if (isNaN(duracion)) {
        alert("Debes ingresar un número válido para la duración. Recuerda que este tiene que estar entre 0-7200 segundos");
        continue;
    }
                
    // Validar rango (0-7200 segundos)
    if (duracion < 0 || duracion > 7200) {
        alert("La duración debe estar entre 0 y 7200 segundos (2 horas).");
        continue;
    }
    console.log(`Duración válida: ${duracion} segundos`);
    return duracion;
    }
}
function finalizarCargaPistas() {
    // Verificar que haya al menos una pista
    if (pistasDelDisco.length === 0) {
        alert("Debes agregar al menos una pista al disco.");
        return;
    }
    // Agregar las pistas al disco
    discoCargado.pistas = pistasDelDisco;
            
    // Agregar el disco completo al array principal
    discos.push(discoCargado);
    console.log('El disco esta completo y agregado:', discoCargado);

 pistaCargada = 1;
pistasDelDisco = [];
discoCargado = {};    
}

/**
 * Llamada desde un boton. Muestra todos los discos disponibles.
 */
function mostrar() {
    console.log("Mostrando discos");
    const contenedor = document.getElementById('discos');
    const contador = document.getElementById('contadorDiscos');

    contador.innerText = `Discos cargados: ${discos.length}`;
    contenedor.innerHTML = '';

    discos.forEach(disco => {
     const discoElemento = document.createElement('div');
     discoElemento.classList.add('disco');

     //Estructura del disco
     discoElemento.innerHTML = `
        <h3>${disco.nombre}</h3>
        <p><strong>Autor/Banda:</strong> ${disco.autor}</p>
        <p><strong>Código único:</strong> ${disco.codigo}</p>
        <img src="${disco.portada}" alt="Portada de ${disco.nombre}" style="max-width:150px">
        <h4>Pistas:</h4>
        <ol>
            ${disco.pistas.map(pista => {
                const minutos = Math.floor(pista.duracion / 60);
                const segundos = pista.duracion % 60;
                const duracionFormateada = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                const claseDestacada = pista.duracion > 180 ? 'destacada' : '';
                return `<li class="${claseDestacada}"><strong>${pista.nombre}:</strong> ${duracionFormateada}</li>`;
                }).join('')}
        </ol>`;
     // Agregar disco al contenedor
     contenedor.appendChild(discoElemento);
     
    });
}

function formatoHHMMSS(segundosTotales) {
    const horas = Math.floor(segundosTotales / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function pistaMasLarga(disco) {
    return disco.pistas.reduce((max, pista) => pista.duracion > max.duracion ? pista : max, disco.pistas[0]);
}


function calcularDuracionTotal(disco) {
    return disco.pistas.reduce((total, pista) => total + pista.duracion, 0);
}


function duracionTotal(disco) {
    return disco.pistas.reduce((total, pista) => total + pista.duracion, 0);
}

function ordenarPorDuracion(tipoOrden) {
    const copia = [...discos];

    copia.sort((a, b) => {
        const durA = duracionTotal(a);
        const durB = duracionTotal(b);
        return tipoOrden === "asc" ? durA - durB : durB - durA;
    });

    mostrarDiscosOrdenados(copia);
}


function mostrarDiscosOrdenados(lista) {
    document.getElementById('contadorDiscos').innerText = `Discos cargados: ${lista.length}`;
    const contenedor = document.getElementById('discos');
    contenedor.innerHTML = '';

    lista.forEach(disco => {
    const duracionTotal = calcularDuracionTotal(disco);
const promedio = Math.floor(duracionTotal / disco.pistas.length);
const pistaLarga = pistaMasLarga(disco);

const discoElemento = document.createElement('div');
discoElemento.classList.add('disco');

discoElemento.innerHTML = `
    <h3>${disco.nombre}</h3>
    <p><strong>Autor/Banda:</strong> ${disco.autor}</p>
    <p><strong>Código único:</strong> ${disco.codigo}</p>
    <p><strong>Cantidad de pistas:</strong> ${disco.pistas.length}</p>
    <p><strong>Duración total:</strong> ${formatoHHMMSS(duracionTotal)}</p>
    <p><strong>Promedio por pista:</strong> ${formatoHHMMSS(promedio)}</p>
    <p><strong>Pista más larga:</strong> ${pistaLarga.nombre} (${formatoHHMMSS(pistaLarga.duracion)})</p>
    <img src="${disco.portada}" alt="Portada" style="max-width:150px">
    <h4>Pistas:</h4>
    <ol>
        ${disco.pistas.map(pista => {
            const minutos = Math.floor(pista.duracion / 60);
            const segundos = pista.duracion % 60;
            const duracionFormateada = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            const claseDestacada = pista.duracion > 180 ? 'destacada' : '';
            return `<li class="${claseDestacada}"><strong>${pista.nombre}:</strong> ${duracionFormateada}</li>`;
        }).join('')}
    </ol>
`;


    contenedor.appendChild(discoElemento);
});

}



document.getElementById('btnAscendente').addEventListener('click', () => ordenarPorDuracion("asc"));
document.getElementById('btnDescendente').addEventListener('click', () => ordenarPorDuracion("desc"));

document.getElementById('btnCargarJSON').addEventListener('click', () => {
    cargarJSON();
});


        
