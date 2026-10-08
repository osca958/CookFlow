

USE CookFlow;

CREATE TABLE USUARIOS (
	USid int identity(1,1) PRIMARY KEY,
	USnombre varchar(100) not null,
	USemail varchar(100) unique not null,
	USpassword varchar(255) not null,
	USfechaalta date DEFAULT GETDATE()
	);

CREATE TABLE LISTA_COMPRA (
	LCid int IDENTITY(1,1) PRIMARY KEY,
	USid INT NOT NULL,
	LCfecha DATE DEFAULT GETDATE(),
	LCpax INT,

	FOREIGN KEY (USid) REFERENCES USUARIOS(USid)
	);

CREATE TABLE INGREDIENTES (
	INid INT IDENTITY(1,1) PRIMARY KEY,
	INnombre VARCHAR(100) NOT NULL,
	);

CREATE TABLE LISTA_COMPRA_ITEMS (
	LCid INT NOT NULL,
	INid INT NOT NULL,
	LCIcantidad DECIMAL(6,2),
	LCIunidad VARCHAR(50),
	PRIMARY KEY (LCid, INid),
	FOREIGN KEY (LCid) REFERENCES LISTA_COMPRA(LCid),
	FOREIGN KEY (INid) REFERENCES INGREDIENTES(INid)
	);


CREATE TABLE CATEGORIAS (
	CAid INT IDENTITY(1,1) PRIMARY KEY,
	CAnombre VARCHAR(100) NOT NULL,
	CAdescripcion VARCHAR(255)
	);

CREATE TABLE RECETAS (
	RECid INT IDENTITY(1,1) PRIMARY KEY,
	RECtitulo VARCHAR(150) NOT NULL,
	RECdescripcion TEXT,
	RECimagen VARCHAR(255),
	RECtiempo INT,
	RECdificultad VARCHAR(50),
	USid INT NOT NULL,
	CAid INT NOT NULL,
	FOREIGN KEY (USid) REFERENCES USUARIOS(USid),
	FOREIGN KEY (CAid) REFERENCES CATEGORIAS(CAid)
	);

CREATE TABLE RECETA_INGREDIENTES (
	RECid INT NOT NULL,
	INid INT NOT NULL,
	RIcantidad DECIMAL(6,2),
	RIunidad VARCHAR(50),
	PRIMARY KEY (RECid, INid),
	FOREIGN KEY (RECid) REFERENCES RECETAS(RECid),
	FOREIGN KEY (INid) REFERENCES INGREDIENTES(INid)
	);

CREATE TABLE FAVORITOS_RECETAS (
	USid INT NOT NULL,
	RECid INT NOT NULL,
	FRfecha DATE DEFAULT GETDATE(),
	PRIMARY KEY (USiD, RECid),
	FOREIGN KEY (USid) REFERENCES USUARIOS(USid),
	FOREIGN KEY (RECid) REFERENCES RECETAS(RECid)
	);

CREATE TABLE RESTAURANTES (
	RESid INT IDENTITY(1,1) PRIMARY KEY,
	RESnombre VARCHAR(100) NOT NULL,
	RESdireccion VARCHAR(255),
	REStipo VARCHAR(100)
	);

CREATE TABLE RESTAURANTES_VISITADOS (
	USid INT NOT NULL,
	RESid INT NOT NULL,
	RVpuntuacion INT CHECK (RVpuntuacion BETWEEN 1 AND 5),
	RVcomentario VARCHAR(500),
	RVfecha DATE DEFAULT GETDATE(),
	PRIMARY KEY (USid, RESid),
	FOREIGN KEY (USid) REFERENCES USUARIOS(USid),
	FOREIGN KEY (RESid) REFERENCES RESTAURANTES(RESid)
	);

SELECT name FROM sys.tables;

SELECT 
    fk.name AS FK_Name,
    tp.name AS Tabla_Principal,
    tc.name AS Tabla_Hija
FROM sys.foreign_keys fk
JOIN sys.tables tp ON fk.referenced_object_id = tp.object_id
JOIN sys.tables tc ON fk.parent_object_id = tc.object_id;

INSERT INTO USUARIOS (USnombre, USemail, USpassword)
VALUES
('Oscar', 'oscar@example.com', '1234'),
('Ana García', 'ana@example.com', 'abcd'),
('Luis Martínez', 'luis@example.com', 'pass123'),
('María López', 'maria@example.com', 'maria2026');

INSERT INTO RESTAURANTES (RESnombre, RESdireccion, REStipo)
VALUES
('DiverXO', 'Calle del Padre Damián 23, Chamartín', 'Alta cocina'),
('Sobrino de Botín', 'Calle Cuchilleros 17, Centro', 'Asado castellano'),
('La Bola', 'Calle de la Bola 5, Centro', 'Cocido madrileño'),
('Sacha', 'Calle de Juan Hurtado de Mendoza 11, Chamartín', 'Bistró clásico'),
('Kuoco', 'Calle de San Bartolomé 14, Chueca', 'Fusión internacional'),
('Coque', 'Calle del Marqués de Riscal 11, Chamberí', 'Alta cocina'),
('BAS Retiro', 'Calle Ibiza 38, Retiro', 'Bistró creativo'),
('Casa Dani', 'Calle Ayala 28, Salamanca', 'Tradicional española'),
('Tragabuches', 'Calle José Ortega y Gasset 40, Salamanca', 'Tradicinal española');

INSERT INTO RESTAURANTES_VISITADOS (USid, RESid, RVpuntuacion, RVcomentario)
VALUES
(1, 1, 5, 'Experiencia brutal, merece la fama'),
(1, 2, 4, 'El cochinillo espectacular'),
(2, 3, 5, 'El mejor cocido que he probado'),
(3, 4, 4, 'Muy buen ambiente y platos clásicos'),
(4, 5, 5, 'Fusión increíble, sabores top'),
(2, 6, 5, 'Menú degustación inolvidable'),
(3, 7, 4, 'Creativo y diferente'),
(4, 8, 5, 'La tortilla es una locura');


INSERT INTO INGREDIENTES (INnombre)
VALUES
('Harina'), ('Azúcar'), ('Sal'), ('Aceite de oliva'), ('Leche'),
('Huevos'), ('Pollo'), ('Ternera'), ('Cebolla'), ('Ajo'),
('Tomate'), ('Pimiento'), ('Arroz'), ('Pasta'), ('Mantequilla'),
('Chocolate'), ('Limón'), ('Pan'), ('Patata'), ('Queso');

INSERT INTO CATEGORIAS (CAnombre, CAdescripcion)
VALUES
('Postres', 'Recetas dulces'),
('Carnes', 'Platos con carne'),
('Vegetariano', 'Recetas sin carne'),
('Rápidas', 'Platos en menos de 20 minutos'),
('Tradicional', 'Cocina clásica española');

INSERT INTO RECETAS (RECtitulo, RECdescripcion, RECtiempo, RECdificultad, USid, CAid)
VALUES
('Tortilla de patatas', 'Clásica tortilla española', 25, 'Fácil', 1, 5),
('Pollo al horno', 'Pollo con especias y limón', 60, 'Media', 2, 2),
('Bizcocho casero', 'Bizcocho esponjoso de limón', 45, 'Fácil', 3, 1),
('Arroz con pollo', 'Arroz tradicional con pollo y verduras', 40, 'Media', 4, 2),
('Pasta carbonara', 'Carbonara auténtica sin nata', 20, 'Fácil', 1, 4),
('Crema de verduras', 'Crema suave de verduras variadas', 30, 'Fácil', 2, 3),
('Brownie de chocolate', 'Brownie húmedo y crujiente', 35, 'Media', 3, 1),
('Ensalada César', 'Clásica ensalada con pollo', 15, 'Fácil', 4, 3);

INSERT INTO RECETA_INGREDIENTES (RECid, INid, RIcantidad, RIunidad)
VALUES
-- Tortilla de patatas
(1, 6, 3, 'uds'),
(1, 19, 2, 'uds'),
(1, 4, 20, 'ml'),
(1, 3, 5, 'g'),

-- Pollo al horno
(2, 7, 1, 'kg'),
(2, 17, 1, 'ud'),
(2, 4, 30, 'ml'),
(2, 3, 5, 'g'),

-- Bizcocho casero
(3, 1, 200, 'g'),
(3, 6, 3, 'uds'),
(3, 5, 100, 'ml'),
(3, 2, 150, 'g'),
(3, 17, 1, 'ud'),

-- Arroz con pollo
(4, 13, 200, 'g'),
(4, 7, 300, 'g'),
(4, 9, 1, 'ud'),
(4, 10, 2, 'uds'),

-- Pasta carbonara
(5, 14, 150, 'g'),
(5, 6, 2, 'uds'),
(5, 20, 50, 'g'),

-- Crema de verduras
(6, 9, 1, 'ud'),
(6, 11, 2, 'uds'),
(6, 12, 1, 'ud'),
(6, 5, 200, 'ml'),

-- Brownie
(7, 16, 200, 'g'),
(7, 2, 100, 'g'),
(7, 6, 2, 'uds'),
(7, 15, 50, 'g'),

-- Ensalada César
(8, 7, 150, 'g'),
(8, 18, 1, 'ud'),
(8, 20, 30, 'g');

SELECT * FROM USUARIOS;

SELECT U.USnombre, R.RECtitulo
FROM USUARIOS U
JOIN RECETAS R ON U.USid = R.USid;
SELECT U.USnombre, R.RECtitulo
FROM FAVORITOS_RECETAS F
JOIN USUARIOS U ON F.USid = U.USid
JOIN RECETAS R ON F.RECid = R.RECid;
SELECT * FROM RECETAS;
SELECT R.RECtitulo, C.CAnombre
FROM RECETAS R
JOIN CATEGORIAS C ON R.CAid = C.CAid;
SELECT R.RECtitulo, I.INnombre, RI.RIcantidad, RI.RIunidad
FROM RECETAS R
JOIN RECETA_INGREDIENTES RI ON R.RECid = RI.RECid
JOIN INGREDIENTES I ON RI.INid = I.INid;
SELECT * FROM INGREDIENTES;
SELECT I.INnombre, R.RECtitulo
FROM INGREDIENTES I
JOIN RECETA_INGREDIENTES RI ON I.INid = RI.INid
JOIN RECETAS R ON RI.RECid = R.RECid;
SELECT * FROM LISTA_COMPRA;
SELECT LC.LCid, I.INnombre, LCI.LCIcantidad, LCI.LCIunidad
FROM LISTA_COMPRA LC
JOIN LISTA_COMPRA_ITEMS LCI ON LC.LCid = LCI.LCid
JOIN INGREDIENTES I ON LCI.INid = I.INid;
SELECT * FROM RESTAURANTES;
SELECT U.USnombre, RES.RESnombre, V.RVpuntuacion, V.RVcomentario, V.RVfecha
FROM RESTAURANTES_VISITADOS V
JOIN USUARIOS U ON V.USid = U.USid
JOIN RESTAURANTES RES ON V.RESid = RES.RESid;
SELECT * FROM RECETAS WHERE USid NOT IN (SELECT USid FROM USUARIOS); 
SELECT * FROM RECETAS WHERE CAid NOT IN (SELECT CAid FROM CATEGORIAS);
SELECT * FROM RECETA_INGREDIENTES WHERE RECid NOT IN (SELECT RECid FROM RECETAS);
SELECT * FROM FAVORITOS_RECETAS
WHERE USid NOT IN (SELECT USid FROM USUARIOS)
   OR RECid NOT IN (SELECT RECid FROM RECETAS);
SELECT * FROM RESTAURANTES_VISITADOS
WHERE USid NOT IN (SELECT USid FROM USUARIOS)
   OR RESid NOT IN (SELECT RESid FROM RESTAURANTES);

INSERT INTO USUARIOS (USnombre, USemail, USpassword)
VALUES
('Lucía Fernández', 'lucia.fernandez@example.com', 'Lucia2026!'),
('Carlos Muñoz', 'carlos.munoz@example.com', 'Carlos2026!'),
('Lydia del Teso', 'lydia.delteso@example.com', 'Lydia2026!'),
('Javier Ortega', 'javier.ortega@example.com', 'Javier2026!');
INSERT INTO RESTAURANTES (RESnombre, RESdireccion, REStipo)
VALUES
('El Paraguas', 'Calle Jorge Juan 18', 'Asturiana'),
('Ten Con Ten', 'Calle Ayala 6', 'Moderna'),
('Punto MX', 'Calle General Pardiñas 40', 'Mexicana'),
('Lakasa', 'Calle Raimundo Fdez. Villaverde 26', 'Mercado'),
('Casa Lucio', 'Cava Baja 35', 'Tradicional'),
('Lhardy', 'Carrera de San Jerónimo 8', 'Clásica'),
('Taberna El Sur', 'Calle Torrecilla del Leal 12', 'Tapas'),
('La Trainera', 'Calle Lagasca 60', 'Marisquería'),
('Sala de Despiece', 'Calle Ponzano 11', 'Creativa'),
('Ouh Babbo', 'Calle Caños del Peral 2', 'Italiana'),
('El Bistró de la Central', 'Postigo de San Martín 8', 'Bistró'),
('La Vaca y La Huerta', 'Calle Recoletos 13', 'Km 0'),
('Fismuler', 'Calle Sagasta 29', 'Moderna'),
('Triciclo', 'Calle Santa María 28', 'Fusión'),
('El Pescador', 'Calle Ortega y Gasset 75', 'Marisquería'),
('La Máquina de Jorge Juan', 'Calle Jorge Juan 12', 'Mediterránea'),
('Marieta', 'Paseo de la Castellana 44', 'Internacional');

SELECT * FROM RESTAURANTES_VISITADOS;
SELECT * FROM USUARIOS;
INSERT INTO RESTAURANTES_VISITADOS (USid, RESid, RVpuntuacion, RVcomentario, RVfecha)
VALUES
(1, 10, 5, 'Asturiano espectacular, fabada top.', '2026-10-07'),
(1, 14, 4, 'Clásico madrileño, buen trato.', '2026-10-07'),

(2, 11, 4, 'Moderno y elegante, buena experiencia.', '2026-10-07'),
(2, 22, 5, 'Creativo y delicioso, repetiré.', '2026-10-07'),

(3, 17, 5, 'Marisco fresco y bien preparado.', '2026-10-07'),
(3, 25, 4, 'Mediterráneo de nivel, platos muy buenos.', '2026-10-07'),

(4, 12, 4, 'Mexicano auténtico, sabores intensos.', '2026-10-07'),
(4, 18, 5, 'Creatividad brutal, experiencia top.', '2026-10-07'),

(5, 1, 5, 'Alta cocina impecable.', '2026-10-07'),
(5, 9, 4, 'Tradicional y sabroso.', '2026-10-07'),

(6, 13, 5, 'Producto de mercado excelente.', '2026-10-07'),
(6, 16, 4, 'Tapas muy buenas, ambiente agradable.', '2026-10-07'),

(7, 19, 5, 'Italiana de nivel, pasta increíble.', '2026-10-07'),
(7, 21, 4, 'Buena cocina de proximidad.', '2026-10-07'),

(8, 20, 4, 'Bistró acogedor, buena comida.', '2026-10-07'),
(8, 26, 5, 'Ambiente moderno y platos excelentes.', '2026-10-07');

