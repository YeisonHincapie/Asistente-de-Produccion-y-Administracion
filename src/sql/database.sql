<-- cd C:\xampp\mysql\bin ./mysql -u root -->

CREATE DATABASE sayfre;

USE sayfre;

CREATE TABLE usuarios(
    ID_Usuario INT NOT NULL PRIMARY KEY Auto_Increment,
    Rol VARCHAR (30),
    pass VARCHAR(200)
);

CREATE TABLE clientes(
    ID_Cliente INT(10) NOT NULL PRIMARY KEY ,
    Nombre_Cliente VARCHAR(30),
    Apellidos VARCHAR(40),
    Correo VARCHAR(50),
    Celular INT(10),
    Ciudad VARCHAR(30),
    Dirección TEXT(60)
);

CREATE TABLE pedidos(
    ID_Pedido INT (10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT FOREIGN KEY (ID_Documento) REFERENCES clientes(ID_Documento),
    Fecha_de_Pedido timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecha_de_Entrega DATE,
    Past_Sen_1 INT(5),
    Past_Sen_2 INT(5),
    Past_Sen_3 INT(5),
    Past_Dob_1 INT(5),
    Past_Dob_2 INT(5),
    Past_Dob_3 INT(5),
    Pan_Queso INT(5),	
    Pan_Inte INT(5)	
);

CREATE TABLE para_producir(
    ID_Produccion INT (10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ID_Fecha_de_Entrega DATE FOREIGN KEY (Fecha_de_Entrega) REFERENCES pedidos(Fecha_de_Entrega), 
    ID_Cliente INT(10) FOREIGN KEY (ID_Cliente) REFERENCES clientes(ID_Cliente),  
    Nombre_Cliente VARCHAR(30) FOREIGN KEY (Nombre_Cliente) REFERENCES clientes(Nombre_Cliente),
    Apellidos VARCHAR(40) FOREIGN KEY (Apellidos) REFERENCES clientes(Apellidos)
);

CREATE TABLE para_entregar(
    Fecha_de_Entrega DATE FOREIGN KEY (Fecha_de_Entrega) REFERENCES pedidos(Fecha_de_Entrega), 
    Estado VARCHAR(20) PRIMARY KEY,
    ID_Pedido INT(10) FOREIGN KEY (ID_Pedido) REFERENCES pedidos(ID_Pedido), 
    ID_Cliente INT(10) FOREIGN KEY (ID_Cliente) REFERENCES clientes(ID_Cliente),  
    Nombre_Cliente VARCHAR(30) FOREIGN KEY (Nombre_Cliente) REFERENCES clientes(Nombre_Cliente),
    Apellidos VARCHAR(40) FOREIGN KEY (Apellidos) REFERENCES clientes(Apellidos)
);

CREATE TABLE inventario(
    ID_Ingrediente INT(5) PRIMARY KEY AUTO_INCREMENT,
    Nombre_Producto CHAR(20),
    Marca VARCHAR(30),
    Unid_Medida VARCHAR (15),
    Cantidad INT(10),
    Fecha_de_Ingreso timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecha_de_Vencimiento DATE
);

DESCRIBE inventario;

//insertar datos en tabla
INSERT INTO clientes( ID_Cliente, Nombre_Cliente, Apellidos, Correo, Celular, Ciudad, Dirección) 
values ( "1039459369", "Juan Esteban", "Zapata", "shaman@hotmail.com", "3013112015","Jericó", "Calle 8 # 8-18 piso 2"),
( "43494753", "Maria Victoria", "Oquendo", "maria@gmail.com","3007094744","Medellín", "Calle 38b # 31-49 piso 3");
INSERT INTO pedidos( ID_Pedido, ID_Cliente, Fecha_de_Pedido, Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte ) 
values ( "1", "1039459369", "02/02/2021", "10/07/2021", "10", "10","10","10", "10","10","","" ),
( "2", "1039459369", "02/02/2021", "14/06/2021", "20", "20","20","20", "20","20","","" );
INSERT INTO para_entregar( ID_Cliente, Nombre_Cliente, Apellidos, Correo, Celular, Ciudad, Dirección, ID_Pedido, Fecha_de_Pedido, Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte, Estado) 
values ( "1039459369", "Juan Esteban", "Zapata", "shaman@hotmail.com", "3013112015","Jericó", "Calle 8 # 8-18 piso 2","1", "02/02/2021", "10/07/2021", "10", "10","10","10", "10","10","","","Para Entregar"), 
( "43494753", "Maria Victoria", "Oquendo", "maria@gmail.com","3007094744","Medellín", "Calle 38b # 31-49 piso 3","2", "02/02/2021", "14/06/2021", "20", "20","20","20", "20","20","","","Para Entregar");

INSERT INTO inventario(ID_Ingrediente, Nombre_Producto, Marca, Cantidad, Fecha_de_Ingreso, Fecha_de_Vencimiento) 
values ("1","Harina", "Haz de horos", "10", "02/04/2021", "12/05/2022");
INSERT INTO ingred_past_sensillo( ID_Producto, Harina, Margarina, Azucar, Sal, Agua, Vitina, Harina_laminado, Relleno_1, Preparacion_mezcla, Horneo,Refrigeracion) 
values ("Pastel Relleno Sensilo","33.33", "2", "2", "0.61", "20", "20.83", "3.33", "50", "Mecle los ingredientes", "Horne los pasteles por 1 hora","Igrece los pasteles al ultracongelador por 30 minutos");

//FECHAS
ALTER TABLE pedidos ADD Fecha_de_Pedido timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
Fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//cambiar vaor de una entrada
UPDATE para_entregar SET Fecha_de_Pedido="2021-06-09", Fecha_de_Entrega="2021-08-27", Estado="Para Entregar" WHERE ID_Cliente=1039459369;
UPDATE para_entregar SET Fecha_de_Pedido="2021-06-12", Fecha_de_Entrega="2021-07-19", Estado="Remitido" WHERE ID_Cliente=43494753;

//eliminar primary key
alter table ingred_past_doble drop primary key;
//AGREGAR INDICE
ALTER TABLE `para_entregar` ADD UNIQUE( `Fecha_de_Entrega`);
//BORRAR INDICE
ALTER TABLE `para_entregar` DROP INDEX`Fecha_de_Entrega`

//sumar datos de una entrada de la tabla por Fecha_de_Entrega
INSERT INTO produccion (Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte) 
SELECT SUM(Past_Sen_1), SUM(Past_Sen_2), SUM(Past_Sen_3), SUM(Past_Dob_1), SUM(Past_Dob_2), SUM(Past_Dob_3), SUM(Pan_Queso), SUM(Pan_Inte) FROM pedidos WHERE Fecha_de_Entrega ="2021-07-28";

ALTER TABLE usuarios, clientes, pedidos, para_producir, para_entregar, inventario, ingred_linea_pasteleria, 
total_ingre_linea_pasteleria, ingred_linea_pan_queso, total_ingre_linea_pan_queso, ingred_linea_pan_inte, total_ingre_linea_pan_inte in COLLATE='utf8_general_ci';

SELECT * FROM inventario;

//PARA xampp
CREATE DATABASE sayfre;

USE sayfre;

CREATE TABLE usuarios(
    ID_Usuario INT NOT NULL PRIMARY KEY Auto_Increment,
    Rol VARCHAR (30),
    pass VARCHAR(200)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE clientes(
    ID_Cliente INT(10) NOT NULL PRIMARY KEY,
    Nombre_Cliente VARCHAR(30),
    Apellidos VARCHAR(40),
    Correo VARCHAR(50),
    Celular INT(10),
    Ciudad VARCHAR(30),
    Dirección TEXT(60)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE pedidos(
    ID_Pedido INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT,
    Fecha_de_Pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecha_de_Entrega DATE,
    Past_Sen_1 INT(5),
    Past_Sen_2 INT(5),
    Past_Sen_3 INT(5),
    Past_Dob_1 INT(5),
    Past_Dob_2 INT(5),
    Past_Dob_3 INT(5),
    Pan_Queso INT(5),	
    Pan_Inte INT(5),	
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE para_entregar(
    ID_Cliente INT(10),
    Nombre_Cliente VARCHAR(30),
    Apellidos VARCHAR(40),
    Correo VARCHAR(50),
    Celular INT(10),
    Ciudad VARCHAR(30),
    Dirección TEXT(60),
    ID_Pedido INT(10),
    Fecha_de_Pedido DATE,
    Fecha_de_Entrega DATE,
    Past_Sen_1 INT(5),
    Past_Sen_2 INT(5),
    Past_Sen_3 INT(5),
    Past_Dob_1 INT(5),
    Past_Dob_2 INT(5),
    Past_Dob_3 INT(5),
    Pan_Queso INT(5),	
    Pan_Inte INT(5),
    Estado VARCHAR(20)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE inventario(
    ID_Ingrediente INT(5) PRIMARY KEY AUTO_INCREMENT,
    Nombre_Ingrediente CHAR(20),
    Marca VARCHAR(30),
    Unid_Medida VARCHAR(15),
    Cantidad INT(10),
    Fecha_de_Ingreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecha_de_Vencimiento DATE
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE produccion(
    ID_Ficha INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Fecha_de_Produccion DATE,
    Fecha_de_Entrega DATE,
    Estado VARCHAR (15),
    total_pasts1 INT(5),
    total_pasts2 INT(5),
    total_pasts3 INT(5),
    total_pastd1 INT(5),
    total_pastd2 INT(5),
    total_pastd3 INT(5),
    total_panqueso INT(5),	
    total_panint INT(5),
    total_pastsen INT(5),
    total_pastdob INT(5),
    total_pasteles INT(5)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE ingred_linea_pasteleria(
    ID_Producto INT(5) PRIMARY KEY AUTO_INCREMENT, 
    Fecha_Creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Descripcion text(250),
    Harina 	float,
    Margarina float,
    Azucar float,
    Sal float,
    Agua float,
    Vitina float,
    Harina_laminado float,
    Relleno_1 float,
    Relleno_2 float,
    Preparacion_mezcla text,
    Horneo text,
    Refrigeracion text
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO ingred_linea_pasteleria( ID_Producto, Fecha_Creacion, Descripcion, Harina, Margarina, Azucar, Sal, Agua, Vitina, Harina_laminado, Relleno_1, Relleno_2, Preparacion_mezcla, Horneo,Refrigeracion) 
values ("1","2021-07-26","Ingredientes para la linea de procucción de pasteles","33.33", "2", "2", "0.61", "20", "20.83", "3.33", "50","25","Mecle los ingredientes", "Horne los pasteles por 1 hora","Igrece los pasteles al ultracongelador por 30 minutos");

CREATE TABLE total_ingre_linea_pastel(
    ID_Ficha INT(10),
    Fecha_Creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Ingrediente1 VARCHAR(15), 
    Cantidad1 float,
    Ingrediente2 VARCHAR(15), 
    Cantidad2 float,
    Ingrediente3 VARCHAR(15), 
    Cantidad3 float,
    Ingrediente4 VARCHAR(15), 
    Cantidad4 float,
    Ingrediente5 VARCHAR(15), 
    Cantidad5 float,
    Ingrediente6 VARCHAR(15), 
    Cantidad6 float,
    Ingrediente7 VARCHAR(15), 
    Cantidad7 float,
    Ingrediente8 VARCHAR(15), 
    Cantidad8 float,
    Ingrediente9 VARCHAR(15), 
    Cantidad9 float,
    Ingrediente10 VARCHAR(15),
    Cantidad10 float,
    Ingrediente11 VARCHAR(15), 
    Cantidad11 float
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


SELECT SUM(produccion.total_pasteles*ingred_linea_pasteleria.Harina) AS ingre1,
SUM(produccion.total_pasteles*ingred_linea_pasteleria.Margarina) AS ingre2,
SUM(produccion.total_pasteles*ingred_linea_pasteleria.Azucar) AS ingre3,
SUM(produccion.total_pasteles*ingred_linea_pasteleria.Sal) AS ingre4,
SUM(produccion.total_pasteles*ingred_linea_pasteleria.Agua) AS ingre5,
SUM(produccion.total_pasteles*ingred_linea_pasteleria.Vitina) AS ingre6,
SUM(produccion.total_pasteles*ingred_linea_pasteleria.Harina_laminado) AS ingre7,
SUM((produccion.total_pasts1*ingred_linea_pasteleria.Relleno_1)+(produccion.total_pastd1*ingred_linea_pasteleria.Relleno_2)) AS ingre8,
SUM((produccion.total_pasts2*ingred_linea_pasteleria.Relleno_1)+(produccion.total_pastd2*ingred_linea_pasteleria.Relleno_2)) AS ingre9,
SUM((produccion.total_pasts3*ingred_linea_pasteleria.Relleno_1)+(produccion.total_pastd1*ingred_linea_pasteleria.Relleno_2)+(produccion.total_pastd2*ingred_linea_pasteleria.Relleno_2)) AS ingre10, 
SUM(produccion.total_pastd2*ingred_linea_pasteleria.Relleno_1) AS ingre11
FROM produccion,ingred_linea_pasteleria WHERE ID_Ficha=?;

CREATE TABLE ingred_linea_pan_queso(
    ID_Producto INT(5) PRIMARY KEY AUTO_INCREMENT, 
    Fecha_Creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Descripcion text(250),
    Harina 	float,
    Margarina float,
    Azucar float,
    Sal float,
    Agua float,
    Levadura float,
    Queso_Mozarella float,
    Preparacion_mezcla text,
    Horneo text,
    Refrigeracion text
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO ingred_linea_pan_queso( ID_Producto, Fecha_Creacion, Descripcion, Harina, Margarina, Azucar, Sal, Agua, Levadura, Quezo_Mozarella, Preparacion_mezcla, Horneo,Refrigeracion) 
values ("1","2021-07-26","Ingredientes para la producción del pan de queso","300", "45", "36", "6", "165", "6", "140","Mecle los ingredientes...", "Horne los panes por 40 minutos","Igrece los panes al ultracongelador por 30 minutos");

CREATE TABLE total_ingre_linea_pan_queso(
    ID_Ficha INT(10),
    Fecha_Creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Ingred_panqueso1 VARCHAR(15), 
    Cantid_panqueso1 float,
    Ingred_panqueso2 VARCHAR(15), 
    Cantid_panqueso2 float,
    Ingred_panqueso3 VARCHAR(15), 
    Cantid_panqueso3 float,
    Ingred_panqueso4 VARCHAR(15), 
    Cantid_panqueso4 float,
    Ingred_panqueso5 VARCHAR(15), 
    Cantid_panqueso5 float,
    Ingred_panqueso6 VARCHAR(15), 
    Cantid_panqueso6 float,
    Ingred_panqueso7 VARCHAR(15), 
    Cantid_panqueso7 float
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SELECT SUM(produccion.total_panqueso*ingred_linea_pan_queso.Harina) AS ingred_panqueso1,
SUM(produccion.total_panqueso*ingred_linea_pan_queso.Margarina) AS ingred_panqueso2,
SUM(produccion.total_panqueso*ingred_linea_pan_queso.Azucar) AS ingred_panqueso3,
SUM(produccion.total_panqueso*ingred_linea_pan_queso.Sal) AS ingred_panqueso4,
SUM(produccion.total_panqueso*ingred_linea_pan_queso.Agua) AS ingred_panqueso5,
SUM(produccion.total_panqueso*ingred_linea_pan_queso.Levadura) AS ingred_panqueso6,
SUM(produccion.total_panqueso*ingred_linea_pan_queso.Queso_Mozarella) AS ingred_panqueso7
FROM produccion,ingred_linea_pan_queso WHERE ID_Ficha=?;

CREATE TABLE ingred_linea_pan_inte(
    ID_Producto INT(5) PRIMARY KEY AUTO_INCREMENT, 
    Fecha_Creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Descripcion text(250),
    Harina_Integral float,
    Margarina float,
    Azucar_Morena float,
    Sal float,
    Agua float,
    Levadura float,
    Avena_Hojuelas float,
    Frutas_Crist float,
    Brevas float,
    Preparacion_mezcla text,
    Horneo text,
    Refrigeracion text
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO ingred_linea_pan_inte( ID_Producto, Fecha_Creacion, Descripcion, Harina_Integral, Margarina, Azucar_Morena, Sal, Agua, Levadura, Avena_Hojuelas, Frutas_Crist, Brevas, Preparacion_mezcla, Horneo,Refrigeracion) 
values ("1","2021-07-26","Ingredientes para la producción del pan de integral","300", "45", "45", "6", "150", "6", "30", "50", "50", "Mecle los ingredientes...", "Horne los panes por 40 minutos","Igrece los panes al ultracongelador por 30 minutos");

CREATE TABLE total_ingre_linea_pan_inte(
    ID_Ficha INT(10),
    Fecha_Creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Ingred_panint1 VARCHAR(15), 
    Cantid_panint1 float,
    Ingred_panint2 VARCHAR(15), 
    Cantid_panint2 float,
    Ingred_panint3 VARCHAR(15), 
    Cantid_panint3 float,
    Ingred_panint4 VARCHAR(15), 
    Cantid_panint4 float,
    Ingred_panint5 VARCHAR(15), 
    Cantid_panint5 float,
    Ingred_panint6 VARCHAR(15), 
    Cantid_panint6 float,
    Ingred_panint7 VARCHAR(15), 
    Cantid_panint7 float,
    Ingred_panint8 VARCHAR(15), 
    Cantid_panint8 float,
    Ingred_panint9 VARCHAR(15), 
    Cantid_panint9 float
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SELECT SUM(produccion.total_panint*ingred_linea_pan_inte.Harina_Integral) AS ingred_panint1,
SUM(produccion.total_panint*ingred_linea_pan_inte.Margarina) AS ingred_panint2,
SUM(produccion.total_panint*ingred_linea_pan_inte.Azucar_Morena) AS ingred_panint3,
SUM(produccion.total_panint*ingred_linea_pan_inte.Sal) AS ingred_panint4,
SUM(produccion.total_panint*ingred_linea_pan_inte.Agua) AS ingred_panint5,
SUM(produccion.total_panint*ingred_linea_pan_inte.Levadura) AS ingred_panint6,
SUM(produccion.total_panint*ingred_linea_pan_inte.Avena_Hojuelas) AS ingred_panint7,
SUM(produccion.total_panint*ingred_linea_pan_inte.Frutas_Crist) AS ingred_panint8,
SUM(produccion.total_panint*ingred_linea_pan_inte.Brevas) AS ingred_panint9
FROM produccion,ingred_linea_pan_inte WHERE ID_Ficha=?;