import express from 'express';
const router = express.Router();
import { index, departamentos, buscando, paginacion, paginacion2  } from '../controllers/museoControllers.js'


//* Rutas FrontEnd
router.get('/', index);

router.post('/paginacion', paginacion);
router.post('/', buscando);

//* Rutas Back
router.get('/api/departamentos' ,departamentos);

router.get('/paginacion2', paginacion2);

export default router;