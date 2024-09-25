import { check, validationResult } from 'express-validator';
import { traducir,  reconstruyendoObras, traduccionObjetos, paginasObras, validacionDeIds } from "./funciones.js";
import { URL_API, URL_API_SEARCH_IMAGE } from "./variables.js";


let arregloIds = [];
const objetosEs = [];
let infoPaginacion;
let totalResultados = arregloIds.length;
let pagina;

export const departamentos = async  (req, res) => {
    try {
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

    } catch (error) {
        console.log(`Error API Departamentos: ${error}`);
    }
};

export const buscando = async (req, res) => {   
    const dataDepartamentos = await departamentos(); 

    //- Consulta a API
    let terminoNombre = req.body.nombre;
    let terminoDepto = req.body.departamento;
    
    
    //* Validacion del formulario
    await check('nombre').notEmpty().withMessage('Debe ingresar un nombre para realizar la busqueda').run(req)

    //* Obteniendo el resultado de las validaciones
    let resultadoValidacion = validationResult(req);

    //* Comprobando que el arreglo de errores este vacio
    if(!resultadoValidacion.isEmpty()){
        return res.render('index',{
            dataDepartamentos,
            errores: resultadoValidacion
        } )
    }

    
    //* Obteniendo resultado de la API
    const respuestaId = await fetch(`${URL_API_SEARCH_IMAGE}&q="${terminoNombre}`);
    const arrayIdBusqueda = await respuestaId.json(); // - Obteniendo los ids
    
    //- Validacion de ids
    const { objectIDs } = arrayIdBusqueda;
    arregloIds = await validacionDeIds(objectIDs);
    
    //! Paginacion
    infoPaginacion = paginasObras(arregloIds, parseInt(req.query.pagina) );
    const { resultado, next , previous } = infoPaginacion;
    let paginaSiguiente = next.pagina || null;
    /* let paginaAnterior = previous.pagina || null; */


    //* Traduccion de los objetos
    const objetosEs = await traduccionObjetos(resultado);  
    
    res.render('index',{
        busquedaBoolean: true,
        dataDepartamentos,
        objetosEs,
        pagina,
        totalResultados,
        paginaSiguiente
    })
 
    
}

export const index = async (req, res) => {    
    try {
        const dataDepartamentos = await departamentos();

        res.render('index',{
            dataDepartamentos
        })       

    } catch (error) {
        console.log(`Error index Controllers: ${error.message}`);
        res.status(500).send('Error al cargar resultados');
    }
}

export const paginacion = async (req, res) => {
    try {
        const dataDepartamentos = await departamentos();
        pagina = parseInt(req.params.pagina);
        
        //! Paginacion
        infoPaginacion = paginasObras(arregloIds, pagina, limite);

        console.log('-------------------')
        console.log(infoPaginacion)
        
        //* reconstruyendo objetos
        const objetos = await reconstruyendoObras(infoPaginacion.resultado);

        //* Traduccion de los objetos
        const objetosEs = await traduccionObjetos(objetos);
        

        res.render('index',{
            dataDepartamentos,
            objetosEs
        })       

    } catch (error) {
        console.log(`Error index Controllers: ${error.message}`)
    }
}

export const paginacion2 = (req, res) => {
    const m = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50'];

    const pagina = parseInt(req.query.pagina);
    const limite = parseInt(req.query.limite);
    const startIndex = (pagina - 1) * limite;
    const endIndex = pagina * limite;
    const resultado = {};
        
        if ( endIndex < m.length){
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

        resultado.resultado = m.slice(startIndex, endIndex);

        res.send(resultado)
        
}

