import translate from 'node-google-translate-skidz';
import { URL_API } from './variables.js';

export async function traducir(obj) {
    let source = "en", target = "es";
    const a = await translate({ text: obj, source, target});
    return a.translation;
}

export async function validacionDeIds(array){
    let resultado = [];
    let contador = 1;

    for (const element of array) {
        const url = `${URL_API}/objects/${element}`;
        const consulta = await fetch(url);
        const respuesta = await consulta.json();

        if( !respuesta.message ){
            const { objectDate, department,  objectName, portfolio, primaryImage, primaryImageSmall, title } = respuesta;
            let obra = {objectDate, department,  objectName, portfolio, primaryImage, primaryImageSmall, title}
            
            resultado.push(obra);
            /* console.log(`Objeto ${contador} agregado correctamente`)
            contador++; */
        } else{
            console.log(`Error id no valido`);  
        } 
    }

    return resultado;
}

export async function reconstruyendoObras(idsObras){
    const arrayObjeros = [];

    for ( let i = 0; i < idsObras.length ; i++){
        const url = `${URL_API}/objects/${idsObras[i]}`;
        const consulta = await fetch(url);
        const respuesta = await consulta.json();

        if ( !respuesta.message ){
            arrayObjeros.push(respuesta);
        }else{

            console.log(respuesta.message)
        }
        
    }

    return arrayObjeros;
}

export async function traduccionObjetos(params) {
    //* Traduciendo las obras
    const traduccionesPromesas = params.map( async obra => {
        const traducciones = {};
        const { objectDate, department,  objectName, portfolio, primaryImage, primaryImageSmall, title } = obra;
        
        if( department ) traducciones.departamento = department != '' ? (await traducir(department)) : (department);
        if( objectName ) traducciones.nombreObjeto = objectName != '' ? (await traducir(objectName)) : (objectName);
        if( portfolio ) traducciones.informacion = portfolio != '' ? (await traducir(portfolio)) : (portfolio);
        if( title ) traducciones.titulo = title != '' ? (await traducir(title)) : (title);
        
        /* console.log(obra) */
        return {...traducciones, primaryImage, primaryImageSmall, objectDate};
    })

    const obrasResultado = await Promise.all(traduccionesPromesas);  
    return obrasResultado;
}

export function paginasObras(obrasId, pagina) {
    const limite = 20;
    const startIndex = (pagina - 1) * limite;
    const endIndex = pagina * limite;
    const resultado = {};

    if ( endIndex < obrasId.length){
        resultado.next = {
            pagina: pagina + 1,
            limite: limite
        }
    }
    
    if ( startIndex > 0 ){
        resultado.previous = {
            pagina: pagina - 1,
            limite: limite
        }
    }
    
    resultado.resultado = obrasId.slice(startIndex, endIndex);
    return resultado;
}

