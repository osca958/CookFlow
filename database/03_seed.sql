USE CookFlow;
GO

DECLARE @US INT = (SELECT USid FROM USUARIOS WHERE USemail = 'cookflow@cookflow.com');
IF @US IS NULL THROW 50000, 'Ejecuta antes: node scripts/seedUsuarios.js', 1;

INSERT INTO CATEGORIAS (CAnombre, CAdescripcion)
SELECT v.n, v.d
FROM (VALUES
  ('Carnes',           'Platos con carne de ave, cerdo o ternera'),
  ('Pescados',         'Pescados y mariscos'),
  ('Arroces',          'Paellas, risottos y otros platos de arroz'),
  ('Pasta',            'Pastas de todo tipo'),
  ('Sopas y cremas',   'Cremas, sopas y gazpachos'),
  ('Ensaladas',        'Platos frescos y ligeros'),
  ('Legumbres',        'Guisos de legumbres'),
  ('Postres',          'Dulces y tartas'),
  ('Tortillas y huevos','Platos con huevo como protagonista'),
  ('Pizzas',           'Masas y pizzas')
) v(n, d)
WHERE NOT EXISTS (SELECT 1 FROM CATEGORIAS c WHERE c.CAnombre = v.n);

INSERT INTO INGREDIENTES (INnombre)
SELECT v.n
FROM (VALUES
  ('Patata'),('Huevo'),('Cebolla'),('Aceite de oliva'),('Sal'),('Tomate'),('Pepino'),
  ('Pimiento verde'),('Ajo'),('Vinagre'),('Arroz'),('Pollo'),('Judías verdes'),('Pimentón'),
  ('Caldo de pollo'),('Espaguetis'),('Queso parmesano'),('Panceta'),('Pimienta negra'),
  ('Lechuga'),('Pan'),('Lentejas'),('Zanahoria'),('Queso crema'),('Azúcar'),('Nata'),
  ('Harina'),('Vino blanco'),('Calabacín'),('Salmón'),('Limón'),('Mozzarella'),
  ('Mascarpone'),('Café'),('Soletillas')
) v(n)
WHERE NOT EXISTS (SELECT 1 FROM INGREDIENTES i WHERE i.INnombre = v.n);

INSERT INTO RECETAS (RECtitulo, RECdescripcion, RECimagen, RECtiempo, RECdificultad, USid, CAid)
SELECT v.t, v.d, NULL, v.tiempo, v.dif, @US, c.CAid
FROM (VALUES
  ('Tortilla de patatas', 'Fríe las patatas y la cebolla a fuego lento, mezcla con el huevo batido y cuaja la tortilla por ambos lados.', 40, 'Media', 'Tortillas y huevos'),
  ('Gazpacho andaluz', 'Tritura todos los ingredientes crudos, cuela si quieres una textura fina y sirve muy frío.', 20, 'Fácil', 'Sopas y cremas'),
  ('Paella de pollo', 'Sofríe el pollo y las verduras, añade el pimentón, el arroz y el caldo, y cuece sin remover unos 18 minutos.', 60, 'Difícil', 'Arroces'),
  ('Spaghetti carbonara', 'Cuece la pasta, dora la panceta y mezcla fuera del fuego con huevo y parmesano, sin nata.', 25, 'Media', 'Pasta'),
  ('Ensalada César', 'Monta la lechuga con pollo a la plancha, picatostes y parmesano, y aliña con aceite.', 20, 'Fácil', 'Ensaladas'),
  ('Lentejas estofadas', 'Cuece las lentejas con zanahoria, cebolla, ajo y pimentón hasta que estén tiernas.', 50, 'Fácil', 'Legumbres'),
  ('Tarta de queso', 'Mezcla el queso crema con huevos, azúcar, nata y harina, y hornea a 180 grados hasta que dore.', 70, 'Media', 'Postres'),
  ('Pollo al ajillo', 'Dora el pollo con muchos ajos, añade el vino blanco y deja reducir hasta que quede jugoso.', 35, 'Fácil', 'Carnes'),
  ('Crema de calabacín', 'Pocha cebolla, añade calabacín y patata, cuece con agua y tritura con un poco de nata.', 30, 'Fácil', 'Sopas y cremas'),
  ('Salmón al horno', 'Coloca el salmón con limón, ajo y aceite, y hornea unos 15 minutos a 200 grados.', 25, 'Fácil', 'Pescados'),
  ('Pizza margarita', 'Estira la masa, cubre con tomate y mozzarella, y hornea a máxima temperatura.', 45, 'Media', 'Pizzas'),
  ('Tiramisú', 'Moja las soletillas en café, alterna capas con crema de mascarpone, huevo y azúcar, y enfría varias horas.', 40, 'Media', 'Postres')
) v(t, d, tiempo, dif, cat)
JOIN CATEGORIAS c ON c.CAnombre = v.cat
WHERE NOT EXISTS (SELECT 1 FROM RECETAS r WHERE r.RECtitulo = v.t);

INSERT INTO RECETA_INGREDIENTES (RECid, INid, RIcantidad, RIunidad)
SELECT r.RECid, i.INid, v.cant, v.uni
FROM (VALUES
  ('Tortilla de patatas','Patata',500,'g'),('Tortilla de patatas','Huevo',6,'ud'),
  ('Tortilla de patatas','Cebolla',1,'ud'),('Tortilla de patatas','Aceite de oliva',150,'ml'),
  ('Tortilla de patatas','Sal',1,'pizca'),

  ('Gazpacho andaluz','Tomate',1000,'g'),('Gazpacho andaluz','Pepino',1,'ud'),
  ('Gazpacho andaluz','Pimiento verde',1,'ud'),('Gazpacho andaluz','Ajo',1,'diente'),
  ('Gazpacho andaluz','Aceite de oliva',60,'ml'),('Gazpacho andaluz','Vinagre',2,'cucharada'),
  ('Gazpacho andaluz','Sal',1,'pizca'),

  ('Paella de pollo','Arroz',400,'g'),('Paella de pollo','Pollo',600,'g'),
  ('Paella de pollo','Tomate',200,'g'),('Paella de pollo','Judías verdes',200,'g'),
  ('Paella de pollo','Pimentón',1,'cucharadita'),('Paella de pollo','Caldo de pollo',1200,'ml'),
  ('Paella de pollo','Aceite de oliva',50,'ml'),

  ('Spaghetti carbonara','Espaguetis',400,'g'),('Spaghetti carbonara','Huevo',4,'ud'),
  ('Spaghetti carbonara','Queso parmesano',100,'g'),('Spaghetti carbonara','Panceta',150,'g'),
  ('Spaghetti carbonara','Pimienta negra',1,'pizca'),

  ('Ensalada César','Lechuga',1,'ud'),('Ensalada César','Pollo',300,'g'),
  ('Ensalada César','Queso parmesano',50,'g'),('Ensalada César','Pan',100,'g'),
  ('Ensalada César','Aceite de oliva',40,'ml'),

  ('Lentejas estofadas','Lentejas',400,'g'),('Lentejas estofadas','Zanahoria',2,'ud'),
  ('Lentejas estofadas','Cebolla',1,'ud'),('Lentejas estofadas','Ajo',2,'diente'),
  ('Lentejas estofadas','Pimentón',1,'cucharadita'),

  ('Tarta de queso','Queso crema',600,'g'),('Tarta de queso','Huevo',4,'ud'),
  ('Tarta de queso','Azúcar',200,'g'),('Tarta de queso','Nata',200,'ml'),
  ('Tarta de queso','Harina',30,'g'),

  ('Pollo al ajillo','Pollo',800,'g'),('Pollo al ajillo','Ajo',8,'diente'),
  ('Pollo al ajillo','Aceite de oliva',100,'ml'),('Pollo al ajillo','Vino blanco',100,'ml'),
  ('Pollo al ajillo','Sal',1,'pizca'),

  ('Crema de calabacín','Calabacín',600,'g'),('Crema de calabacín','Patata',200,'g'),
  ('Crema de calabacín','Cebolla',1,'ud'),('Crema de calabacín','Nata',100,'ml'),
  ('Crema de calabacín','Aceite de oliva',30,'ml'),

  ('Salmón al horno','Salmón',600,'g'),('Salmón al horno','Limón',1,'ud'),
  ('Salmón al horno','Aceite de oliva',30,'ml'),('Salmón al horno','Ajo',2,'diente'),
  ('Salmón al horno','Sal',1,'pizca'),

  ('Pizza margarita','Harina',500,'g'),('Pizza margarita','Tomate',400,'g'),
  ('Pizza margarita','Mozzarella',250,'g'),('Pizza margarita','Aceite de oliva',30,'ml'),
  ('Pizza margarita','Sal',1,'cucharadita'),

  ('Tiramisú','Mascarpone',500,'g'),('Tiramisú','Huevo',4,'ud'),
  ('Tiramisú','Azúcar',100,'g'),('Tiramisú','Café',300,'ml'),('Tiramisú','Soletillas',200,'g')
) v(t, ing, cant, uni)
JOIN RECETAS r ON r.RECtitulo = v.t
JOIN INGREDIENTES i ON i.INnombre = v.ing
WHERE NOT EXISTS (
    SELECT 1 FROM RECETA_INGREDIENTES ri WHERE ri.RECid = r.RECid AND ri.INid = i.INid
);

INSERT INTO RESTAURANTES (RESnombre, RESdireccion, REStipo)
SELECT v.n, v.d, v.t
FROM (VALUES
  ('La Tasca del Barrio','Calle Mayor 12, Madrid','Española'),
  ('Trattoria Il Forno','Calle Alcalá 80, Madrid','Italiana'),
  ('Sushi Hana','Calle Serrano 45, Madrid','Japonesa'),
  ('El Rincón del Arroz','Avenida de América 20, Madrid','Arrocería'),
  ('Casa Lola','Calle Toledo 33, Madrid','Española'),
  ('Green Bowl','Calle Fuencarral 101, Madrid','Vegetariana'),
  ('Taquería El Sol','Calle Atocha 59, Madrid','Mexicana'),
  ('Asador Los Pinos','Calle Goya 7, Madrid','Parrilla')
) v(n, d, t)
WHERE NOT EXISTS (SELECT 1 FROM RESTAURANTES r WHERE r.RESnombre = v.n);

INSERT INTO RESTAURANTES_VISITADOS (USid, RESid, RVpuntuacion, RVcomentario)
SELECT u.USid, r.RESid, v.p, v.c
FROM (VALUES
  ('marta@demo.com','La Tasca del Barrio',5,'Tortilla espectacular'),
  ('marta@demo.com','Trattoria Il Forno',4,'Pasta casera muy buena'),
  ('marta@demo.com','Green Bowl',4,'Opciones frescas y ligeras'),
  ('luis@demo.com','La Tasca del Barrio',4,'Buen ambiente'),
  ('luis@demo.com','Asador Los Pinos',5,'La carne en su punto'),
  ('luis@demo.com','El Rincón del Arroz',3,'Arroz correcto, servicio lento'),
  ('carla@demo.com','Sushi Hana',5,'Muy fresco'),
  ('carla@demo.com','Taquería El Sol',4,'Tacos muy ricos'),
  ('carla@demo.com','Casa Lola',5,'Como en casa'),
  ('pablo@demo.com','Trattoria Il Forno',5,'La mejor pizza'),
  ('pablo@demo.com','Casa Lola',4,'Raciones generosas'),
  ('pablo@demo.com','El Rincón del Arroz',5,'Paella de diez')
) v(email, rest, p, c)
JOIN USUARIOS u ON u.USemail = v.email
JOIN RESTAURANTES r ON r.RESnombre = v.rest
WHERE NOT EXISTS (
    SELECT 1 FROM RESTAURANTES_VISITADOS rv WHERE rv.USid = u.USid AND rv.RESid = r.RESid
);
GO

SELECT 'Categorias' AS tabla, COUNT(*) AS filas FROM CATEGORIAS UNION ALL
SELECT 'Ingredientes', COUNT(*) FROM INGREDIENTES UNION ALL
SELECT 'Recetas', COUNT(*) FROM RECETAS UNION ALL
SELECT 'Receta_ingredientes', COUNT(*) FROM RECETA_INGREDIENTES UNION ALL
SELECT 'Restaurantes', COUNT(*) FROM RESTAURANTES UNION ALL
SELECT 'Visitas', COUNT(*) FROM RESTAURANTES_VISITADOS;