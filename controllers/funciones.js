import translate from 'node-google-translate-skidz';
import { URL_API } from './variables.js';

export async function traducir(obj) {
    let source = "en", target = "es";
    const a = await translate({ text: obj, source, target});
    return a.translation;
}

export function arraySeleccion(myArray,  limite){
    let obras = [];
    const { objectIDs , total } = myArray;
    return obras = objectIDs.slice(0, limite);
}

export async function reconstruyendoObras(idsObras){
    const arrayObjeros = [];

    for ( let i = 0; i < idsObras.length ; i++){
        const url = `${URL_API}/objects/${idsObras[i]}`;
        const consulta = await fetch(url);
        const respuesta = await consulta.json();
        arrayObjeros.push(respuesta);
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

export function paginasObras(obrasId, pagina, limite) {
    const inicio = ( pagina -1 ) * limite;
    const fin = inicio + limite;

    //*Arreglo con las obras
    const obrasIdPaginas = obrasId.slice(inicio, fin)

    //- Fetch

}

