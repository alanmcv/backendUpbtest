const { Router } = require('express');
const productoController = require('../controllers/producto.controller');

const router = Router();

router.get('/', productoController.listar);
// Deben ir antes de '/:id', si no Express tomaría "agotados" o "resumen" como un id
router.get('/agotados', productoController.agotados);
router.get('/resumen', productoController.resumen);
router.get('/:id', productoController.obtener);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;
