const pool = require('../config/db');
const Categoria = require('../entities/categoria.entity');

// LEFT JOIN para incluir también las categorías que todavía no tienen productos
const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT c.*, COUNT(p.id)::int AS total_productos
        FROM categorias c
        LEFT JOIN productos p ON p.categoria_id = c.id
        GROUP BY c.id
        ORDER BY c.nombre`);
    return rows.map(Categoria.fromRow);
};

const create = async ({ nombre }) => {
    const { rows } = await pool.query('INSERT INTO categorias (nombre) VALUES ($1) RETURNING *', [nombre]);
    return Categoria.fromRow(rows[0]);
};

const update = async (id, { nombre }) => {
    const { rows } = await pool.query('UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
    return Categoria.fromRow(rows[0]);
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    return rowCount > 0;
};

module.exports = { findAll, create, update, remove };
