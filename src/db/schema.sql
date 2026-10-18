-- Este archivo se puede ejecutar muchas veces sin perder datos (npm start lo corre en cada arranque).

CREATE TABLE IF NOT EXISTS categorias (
    id         SERIAL PRIMARY KEY,
    nombre     VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
    id           SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  VARCHAR(500),
    precio       NUMERIC(10, 2) NOT NULL DEFAULT 0 CONSTRAINT productos_precio_check CHECK (precio >= 0),
    stock        INTEGER NOT NULL DEFAULT 0 CONSTRAINT productos_stock_check CHECK (stock >= 0),
    -- Si se borra la categoría, el producto queda "sin categoría" en vez de borrarse
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

-- Migración para bases creadas con la versión anterior (solo tenían id, nombre, precio, stock, created_at).
-- En una base nueva estas líneas no hacen nada.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS descripcion  VARCHAR(500);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMP DEFAULT NOW();

-- ADD CONSTRAINT no acepta IF NOT EXISTS, por eso se ignora el error si ya existe
DO $$ BEGIN
    ALTER TABLE productos ADD CONSTRAINT productos_precio_check CHECK (precio >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE productos ADD CONSTRAINT productos_stock_check CHECK (stock >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Acelera el filtro por categoría y el JOIN con categorias
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
