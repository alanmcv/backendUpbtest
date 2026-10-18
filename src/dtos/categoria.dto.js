const HttpError = require('../utils/http-error');

// DTO de entrada para POST y PUT: la categoría solo tiene nombre
const categoriaDto = (body) => {
    const { nombre } = body || {};
    if (typeof nombre !== 'string' || nombre.trim() === '') throw new HttpError(400, '"nombre" es obligatorio y debe ser un texto');
    if (nombre.trim().length > 50) throw new HttpError(400, '"nombre" no puede superar 50 caracteres');
    return { nombre: nombre.trim() };
};

// DTO de salida
const categoriaResponseDto = (categoria) => ({
    id: categoria.id,
    nombre: categoria.nombre,
    totalProductos: categoria.totalProductos,
});

module.exports = { categoriaDto, categoriaResponseDto };
