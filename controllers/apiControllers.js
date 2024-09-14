import { 
    obtenerAPI,
    obtenerDepartamentos,
    obtenerObras 
} from "./funciones.js";

 const departamentos = async (req, res) => {
    const jsonDeptos = await obtenerDepartamentos();
    res.send(jsonDeptos);
};

const obras = async (req, res) => {
    const jsonObras = await obtenerObras();
    res.send(jsonObras);
};


export {
    departamentos,
    obras
}