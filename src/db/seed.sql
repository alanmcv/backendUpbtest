-- Datos de ejemplo para la demo. Cada fila se inserta solo si no existe otra con el mismo nombre,
-- así no duplica nada si se corre dos veces ni toca los datos que ya tengas.

INSERT INTO categorias (nombre)
VALUES ('Electrónica'), ('Oficina'), ('Hogar'), ('Alimentos')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT v.nombre, v.descripcion, v.precio, v.stock, c.id
FROM (VALUES
    ('Laptop Lenovo IdeaPad', 'Ryzen 5, 16 GB RAM, SSD 512 GB',  4200.00, 6,  'Electrónica'),
    ('Mouse inalámbrico',     'Logitech M185, receptor USB',       85.00, 25, 'Electrónica'),
    ('Audífonos Bluetooth',   'Cancelación de ruido, 30 h',       350.00, 0,  'Electrónica'),
    ('Cuaderno universitario','100 hojas cuadriculadas',            12.50, 80, 'Oficina'),
    ('Bolígrafos azules x10', 'Punta fina 0.7 mm',                  15.00, 3,  'Oficina'),
    ('Lámpara de escritorio', 'LED regulable con puerto USB',      180.00, 0,  'Hogar'),
    ('Taza térmica',          'Acero inoxidable, 450 ml',           65.00, 14, 'Hogar'),
    ('Café molido 500 g',     'Café de los Yungas, tostado medio',  48.00, 30, 'Alimentos')
) AS v(nombre, descripcion, precio, stock, categoria)
JOIN categorias c ON c.nombre = v.categoria
WHERE NOT EXISTS (SELECT 1 FROM productos p WHERE p.nombre = v.nombre);
