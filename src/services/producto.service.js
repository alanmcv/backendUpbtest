const productoRepository = require('../repositories/producto.repository');
const HttpError = require('../utils/http-error');
const validarId = require('../utils/validar-id');

// Filtros opcionales que llegan por query: ?nombre=texto&categoria=1&agotados=true (se pueden combinar)
const listar = ({ nombre, categoria, agotados } = {}) => {
    const texto = typeof nombre === 'string' ? nombre.trim() : '';
    return productoRepository.findAll({
        nombre: texto || undefined,
        categoriaId: categoria ? validarId(categoria, 'id de categoría') : undefined,
        soloAgotados: agotados === 'true',
    });
};

const obtenerPorId = async (id) => {
    const producto = await productoRepository.findById(validarId(id));
    if (!producto) throw new HttpError(404, 'Producto no encontrado');
    return producto;
};

const crear = (datos) => productoRepository.create(datos);

// Actualización parcial: el DTO solo trae los campos enviados, el resto conserva su valor actual
const actualizar = async (id, datos) => {
    const actual = await obtenerPorId(id);
    return productoRepository.update(actual.id, { ...actual, ...datos });
};

const eliminar = async (id) => {
    const eliminado = await productoRepository.remove(validarId(id));
    if (!eliminado) throw new HttpError(404, 'Producto no encontrado');
};

const resumen = () => productoRepository.resumen();

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar, resumen };
