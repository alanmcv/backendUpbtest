const categoriaRepository = require('../repositories/categoria.repository');
const HttpError = require('../utils/http-error');
const validarId = require('../utils/validar-id');

// El nombre repetido lo rechaza la base (UNIQUE) y el manejador de errores lo convierte en 409

const listar = () => categoriaRepository.findAll();

const crear = (datos) => categoriaRepository.create(datos);

const actualizar = async (id, datos) => {
    const categoria = await categoriaRepository.update(validarId(id), datos);
    if (!categoria) throw new HttpError(404, 'Categoría no encontrada');
    return categoria;
};

// Los productos de la categoría no se borran: quedan sin categoría (ON DELETE SET NULL)
const eliminar = async (id) => {
    const eliminada = await categoriaRepository.remove(validarId(id));
    if (!eliminada) throw new HttpError(404, 'Categoría no encontrada');
};

module.exports = { listar, crear, actualizar, eliminar };
