import express from 'express';
import { URL_API, URL_API_SEARCH_IMAGE } from '../variables.js';
import {departamentos, validacionDeIds, reconstruyendoObras, traduccionObjetos} from '../funciones.js'
import { param } from 'express-validator';
const router = express.Router();


//- Endpoits 
router.get("/", async (req, res) => {
    try {
        const dataDepartamentos = await departamentos();
        let busquedaBoolean = false;

        res.render('index', {
            busquedaBoolean: false,        
            dataDepartamentos,
            dataObras : [],
            paginaActual: 1,
            totalPaginas: 1
        })
    } catch (error) {
        console.log(`Error endpoint index: ${error.message}`)
    }
});


router.get('/buscando', async (req, res) => {
    try {
        //* Obteniendo los datos de la vista
        const { nombre, region, departamento, pagina = 1 } = req.query;
        let busquedaBoolean = true;

        //* Validacion de busqueda
        let url = `${URL_API_SEARCH_IMAGE}&q="${nombre || ''}"`;
        
        if(departamento != '' && region != '') {
            url = `${url}&geoLocation=${region}&departmentId=${departamento}`
        }else if(departamento != '' ) {
            url = `${url}&departmentId=${departamento}`
        }else if(region != '') {
            url = `${url}&geoLocation=${region}`
        }
        
        //* Obteniendo los departamentos traducidos
        const dataDepartamentos = await departamentos();

        let resultadoBusqueda;
        console.log(resultadoBusqueda)
        
        if ( resultadoBusqueda === undefined) {
            //* Obteniendo resultado de la API
            const consultaId = await fetch(url);
            const respuestaId = await consultaId.json();

            const { objectIDs } = respuestaId;
            //* Guardado ids de la primer busqueda
            resultadoBusqueda = objectIDs;
        }   
        
        console.log(resultadoBusqueda);
        //- Paginacion
        let total = resultadoBusqueda.length;
        let paginaActual = pagina;
        const totalPaginas = Math.ceil( total / 20 );
        const inicio = (pagina -1) * 20;
        const fin = pagina * 20;
        console.log(`INICIO:${inicio} FIN:${fin} `)

        //* Ids de obras que se deben construir
        let idsPaginacion = resultadoBusqueda.slice(inicio, fin)
    
        //* construyendo los objetos
        const obrasValidadas = await reconstruyendoObras(idsPaginacion);
        const { data } = obrasValidadas;
        
        //*Traduccion de los objetos
        const obrasEs = await traduccionObjetos(data);
            
        res.render('index', {
            busquedaBoolean,
            obrasEs,
            paginaActual,
            totalPaginas,
            dataDepartamentos
        })

    } catch (error) {
        console.log(`Error en la busqueda: ${error.message}`);

    }
})

export default router;