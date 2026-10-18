const productoService = require('../services/producto.service');
const { crearProductoDto, actualizarProductoDto, productoResponseDto } = require('../dtos/producto.dto');

// Express 5 captura los errores de funciones async y los manda al manejador de errores,
// por eso no hace falta try/catch aquí

const listar = async (req, res) => {
    const productos = await productoService.listar(req.query);
    res.json(productos.map(productoResponseDto));
};

// Igual que listar pero siempre con stock 0; también acepta ?nombre= y ?categoria=
const agotados = async (req, res) => {
    const productos = await productoService.listar({ ...req.query, agotados: 'true' });
    res.json(productos.map(productoResponseDto));
};

const resumen = async (req, res) => {
    res.json(await productoService.resumen());
};

const obtener = async (req, res) => {
    const producto = await productoService.obtenerPorId(req.params.id);
    res.json(productoResponseDto(producto));
};

const crear = async (req, res) => {
    const datos = crearProductoDto(req.body);
    const producto = await productoService.crear(datos);
    res.status(201).json(productoResponseDto(producto));
};

const actualizar = async (req, res) => {
    const datos = actualizarProductoDto(req.body);
    const producto = await productoService.actualizar(req.params.id, datos);
    res.json(productoResponseDto(producto));
};

const eliminar = async (req, res) => {
    await productoService.eliminar(req.params.id);
    res.status(204).send();
};

module.exports = { listar, agotados, resumen, obtener, crear, actualizar, eliminar };
