const categoriaService = require('../services/categoria.service');
const { categoriaDto, categoriaResponseDto } = require('../dtos/categoria.dto');

const listar = async (req, res) => {
    const categorias = await categoriaService.listar();
    res.json(categorias.map(categoriaResponseDto));
};

const crear = async (req, res) => {
    const categoria = await categoriaService.crear(categoriaDto(req.body));
    res.status(201).json(categoriaResponseDto(categoria));
};

const actualizar = async (req, res) => {
    const categoria = await categoriaService.actualizar(req.params.id, categoriaDto(req.body));
    res.json(categoriaResponseDto(categoria));
};

const eliminar = async (req, res) => {
    await categoriaService.eliminar(req.params.id);
    res.status(204).send();
};

module.exports = { listar, crear, actualizar, eliminar };
