const { Router } = require('express');
const productoController = require('../controllers/producto.controller');

const router = Router();

router.get('/', productoController.listar);
// Debe ir antes de '/:id', si no Express tomaría "agotados" como un id
router.get('/agotados', productoController.agotados);
router.get('/:id', productoController.obtener);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;
