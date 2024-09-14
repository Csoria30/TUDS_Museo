import translate from 'node-google-translate-skidz';

import { 
    urlAPI 
} from "./variables.js";
import { json, text } from 'express';


//! API
export const obtenerAPI = async () => {
    try {
        const resultado = await fetch(`${urlAPI}/objects`);
        const departamentos = await resultado.json();
        return departamentos;
    } catch (error) {
        console.log(`Error API Departamentos: ${error}`);
    }
}

export const obtenerDepartamentos =  () => {
    try {
        return  fetch(`${urlAPI}/departments`)
                .then((respuesta) => respuesta.json())
                .then((departamentos ) => {
                    const { departments } = departamentos;

                    console.log(departments);

                    const traduccionesPromesas = departments.map ( async (departamento) => {
                        const traducciones = {};
                        let id = 0;
                        const { departmentId, displayName } = departamento;

                        const resultadoEs = await translate({
                            text: displayName,
                            source: "en",
                            target: "es"
                        });
            
                        traducciones.nombre = resultadoEs.translation;
                        return { departmentId , ...traducciones}
                    });

                    return Promise.all(traduccionesPromesas);
                })
                .catch(error => {
                    console.log(`Error en la traduccion: ${error}`)
                })


    } catch (error) {
        console.log(`Error API Departamentos: ${error}`);
    }
}

export const obtenerObras = async () => {

    try {
        const totalObras = 10;
        const obras = [];

        for ( let i =  0; obras.length <= totalObras ; i++){
            //* Generando id aleatorio entre 1 y 3000
            let entero = Math.floor( Math.random() * 3000);
            
            //* Obteniendo la obra del id generado
            const url = `${urlAPI}/objects/${entero}`;
            const resultado = await fetch(url);
            const obra = await resultado.json();

            //* Comprobando que sea un id en funcionamiento
            if(obra["message"] != "ObjectID not found"){
                obras.push(obra);
            }
        }


        //! Rerorriendo el objeto
        const Arraytraducciones = obras.map( async (obra) => { 
            
            //* Destructuracion del objeto
            const { objectID, accessionYear, primaryImag, primaryImageSmall, department, objectName, title, culture, country } = obra;

            const traducciones = {};
            let source = "en", target = "es";
            
            if( Object.values(department).some( campo => campo != '')){
                const departmentEs =  await translate({ text: department, source, target});
                traducciones.departamento = departmentEs.translation;
            }

            if( Object.values(objectName).some( campo => campo != '')){
                const objectNameEs =  await translate({ text: objectName, source, target});
                traducciones.nombre = objectNameEs.translation;
            }

            if( Object.values(title).some( campo => campo != '')){
                const titleEs =  await translate({ text: title, source, target});
                traducciones.titulo = titleEs.translation;
            }

            if( Object.values(culture).some( campo => campo != '')){
                const cultureEs =  await translate({ text: culture, source, target});
                traducciones.cultura = cultureEs.translation;
            }

            if( Object.values(country).some( campo => campo != '')){
                const countryEs =  await translate({ text: country, source, target});
                traducciones.pais = countryEs.translation;
            }

            traducciones.id = objectID;
            traducciones.anio = accessionYear;
            traducciones.imagen = primaryImag;
            traducciones.imagenSmall = primaryImageSmall;

            return {...traducciones};
        })

        return Promise.all(Arraytraducciones);

    } catch (error) {
        console.log(`Error API Obras: ${error}`);
    }
}