//! Importaciones
import express from 'express';
import dotenv from 'dotenv';
import museoRoutes from './routes/routes.js';
import { paginacionResultados } from './controllers/middleware.js';

//! variables
//* Realizamos una instancia de express
const app = express();

//* Habilitando la lectura de datos del formulario
app.use(express.urlencoded({extended: true}))

//* Habilitando lectura de variables de entorno
dotenv.config();

//* Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');


//* Definir la carpeta publica   
app.use(express.static('public'));

//* Rutas 
app.use('/', museoRoutes ); 



const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
}); 