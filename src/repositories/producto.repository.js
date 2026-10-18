const pool = require('../config/db');
const Producto = require('../entities/producto.entity');

// Trae el nombre de la categoría en la misma consulta (LEFT JOIN: también los productos sin categoría)
const SELECT_PRODUCTO = `
    SELECT p.*, c.nombre AS categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id`;

// Arma el WHERE según los filtros recibidos; los valores van siempre como $n (evita inyección SQL)
const findAll = async ({ nombre, categoriaId, soloAgotados } = {}) => {
    const condiciones = [];
    const valores = [];

    if (nombre) {
        valores.push(`%${nombre}%`);
        condiciones.push(`p.nombre ILIKE $${valores.length}`);
    }
    if (categoriaId) {
        valores.push(categoriaId);
        condiciones.push(`p.categoria_id = $${valores.length}`);
    }
    if (soloAgotados) condiciones.push('p.stock = 0');

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
    const { rows } = await pool.query(`${SELECT_PRODUCTO} ${where} ORDER BY p.id`, valores);
    return rows.map(Producto.fromRow);
};

const findById = async (id) => {
    const { rows } = await pool.query(`${SELECT_PRODUCTO} WHERE p.id = $1`, [id]);
    return Producto.fromRow(rows[0]);
};

// Después de insertar/actualizar se vuelve a leer con findById para incluir el nombre de la categoría
const create = async ({ nombre, descripcion, precio, stock, categoriaId }) => {
    const { rows } = await pool.query(
        `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [nombre, descripcion, precio, stock, categoriaId]
    );
    return findById(rows[0].id);
};

const update = async (id, { nombre, descripcion, precio, stock, categoriaId }) => {
    const { rowCount } = await pool.query(
        `UPDATE productos
         SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria_id = $5, updated_at = NOW()
         WHERE id = $6`,
        [nombre, descripcion, precio, stock, categoriaId, id]
    );
    return rowCount > 0 ? findById(id) : null;
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    return rowCount > 0;
};

// Estadísticas del inventario en una sola consulta
const resumen = async () => {
    const { rows } = await pool.query(`
        SELECT COUNT(*)::int                          AS total,
               COALESCE(SUM(stock), 0)::int           AS unidades,
               COALESCE(SUM(precio * stock), 0)::float AS valor,
               COUNT(*) FILTER (WHERE stock = 0)::int AS agotados
        FROM productos`);
    return rows[0];
};

module.exports = { findAll, findById, create, update, remove, resumen };
