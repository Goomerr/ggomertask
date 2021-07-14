//Rutas para crear proyectos
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');


//Crear Proyectos
// api/proyectos
router.post('/',
    [
        check('nombre', 'El Nombre del Proyecto es Obligatorio').not().isEmpty()
    ],
    auth,
    proyectoController.crearProyecto
);
//Obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);
//Actualizar un proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El Nombre del Proyecto es Obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);
//Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;