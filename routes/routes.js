import express from 'express';
const router = express.Router();

import {
    index
} from '../controllers/museoControllers.js'

import {
    departamentos,
    obras
} from '../controllers/apiControllers.js'


//* Rutas FrontEnd
router.get('/', index);


//* Rutas API
router.get('/api/departamentos', departamentos);
router.get('/api/obras', obras);

export default router;