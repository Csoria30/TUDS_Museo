import translate from 'node-google-translate-skidz';
import { URL_API, URL_API_SEARCH_IMAGE } from './variables.js';

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
        } else{
            console.log(`Error id no valido`);  
        } 
    }

    return resultado;
}

export async function reconstruyendoObras(idsObras){
    const data = [];
    let totalObras = 1;

    for (const element of idsObras) {
        const url = `${URL_API}/objects/${element}`;
        const consulta = await fetch(url);
        const respuesta = await consulta.json();
        if ( !respuesta.message ){
            data.push(respuesta);
            totalObras = totalObras + 1;
        }
    }


    return {data, totalObras};
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

export async function departamentos () {
    const respuesta = await fetch(`${URL_API}/departments`);
    const resultado = await respuesta.json();

    const { departments } = resultado;

    const traduccionesPromesas = departments.map ( async (departamento) => {
        const traducciones = {};
        let id = 0;
        const { departmentId, displayName } = departamento;

        traducciones.nombre = await traducir(displayName);
    
        return { departmentId , ...traducciones}
    });
    
    return Promise.all(traduccionesPromesas) ; 
}