import express from 'express';
import { URL_API, URL_API_SEARCH_IMAGE } from '../variables.js';
import {departamentos, validacionDeIds, reconstruyendoObras, traduccionObjetos, consultadoAPI} from '../funciones.js'
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
        const searchNombre = nombre || '';
        const searchDepartamento = departamento || '';
        const serchRegion = region || '';

        console.log(searchNombre)

        //* Validacion de busqueda url
        let url = `${URL_API_SEARCH_IMAGE}&q="${searchNombre}"`;
        
        if(searchDepartamento != '' && serchRegion != '') {
            url = `${url}&geoLocation=${serchRegion}&departmentId=${searchDepartamento}`
        }else if(searchDepartamento != '' ) {
            url = `${url}&departmentId=${searchDepartamento}`
        }else if(serchRegion != '') {
            url = `${url}&geoLocation=${serchRegion}`
        }
    
        console.log(url)

        //* Obteniendo los departamentos traducidos
        const dataDepartamentos = await departamentos();

        //*Consultando API
        let datosBusquedaApi = await consultadoAPI(url);
        const { objectIDs, total } = datosBusquedaApi;

        if(total === 0 ){
            //* Arreglo para mostrar errores
            const errores = [];

            res.render('index', {    
                errores : errores.push({mensaje: 'No se encontraron resultados para su busqueda'}),
            })
            return
        }

        //- Paginacion
        let totalPaginacion = total;
        let paginaActual = pagina;
        const totalPaginas = Math.ceil( totalPaginacion / 20 );
        const inicio = (pagina -1) * 20;
        const fin = pagina * 20;

        //* Ids de obras que se deben construir por pagina
        let idsPaginacion = objectIDs.slice(inicio, fin)
    
        //* construyendo los objetos
        const obrasValidadas = await reconstruyendoObras(idsPaginacion);
        const { data } = obrasValidadas;
        
        //*Traduccion de los objetos
        const obrasEs = await traduccionObjetos(data);
        const {additionalImages} = obrasEs;
        console.log(obrasEs.additionalImages)
            
        res.render('index', {
            busquedaBoolean,
            obrasEs,
            paginaActual,
            totalPaginas,
            dataDepartamentos,
            nombre,
            additionalImages
        })

    } catch (error) {
        console.log(`Error en la busqueda: ${error.message}`);

    }
})

export default router;