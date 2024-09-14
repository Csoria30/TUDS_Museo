import { 
    departamentos as deptos
} from "./apiControllers.js";

const index = (req, res) => {
    const departamentos = deptos;
    
    res.render('index',{
        departamentos
    });
};





export {
    index
}