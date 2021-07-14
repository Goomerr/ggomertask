//Rutas para crear Tareas
const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crear una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto es Obligatorio').not().isEmpty()
    ],
    tareasController.crearTarea
);

//Obtener las tareas de un proyecto
router.get('/',
    auth,
    tareasController.obtenerTarea
);

//Actualizar tarea
router.put('/:id',
auth,
tareasController.actualizarTarea
);
//Eliminar una tarea
router.delete('/:id',
auth,
tareasController.eliminarTarea
);
module.exports = router;