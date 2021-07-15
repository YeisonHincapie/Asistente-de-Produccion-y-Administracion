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
INSERT INTO ingred_past_doble( ID_Producto, Harina, Margarina, Azucar, Sal, Agua, Vitina, Harina_laminado, Relleno_1, Relleno_2, Preparacion_mezcla, Horneo,Refrigeracion) 
values ("Pastel Relleno Sensilo","33.33", "2", "2", "0.61", "20", "20.83", "3.33", "25", "25", "Mecle los ingredientes", "Horne los pasteles por 1 hora","Igrece los pasteles al ultracongelador por 30 minutos");


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

SELECT * FROM inventario;

//PARA xampp
CREATE DATABASE sayfre;

USE sayfre;

CREATE TABLE usuarios(
    ID_Usuario INT NOT NULL PRIMARY KEY Auto_Increment,
    Rol VARCHAR (30),
    pass VARCHAR(200)
);

CREATE TABLE clientes(
    ID_Cliente INT(10) NOT NULL PRIMARY KEY,
    Nombre_Cliente VARCHAR(30),
    Apellidos VARCHAR(40),
    Correo VARCHAR(50),
    Celular INT(10),
    Ciudad VARCHAR(30),
    Dirección TEXT(60)
);

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
    Estado VARCHAR(20)	
);

CREATE TABLE produccion(
    ID_Ficha INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Fecha_de_Produccion DATE,
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
);

CREATE TABLE inventario(
    ID_Ingrediente INT(5) PRIMARY KEY AUTO_INCREMENT,
    Nombre_Producto CHAR(20),
    Marca VARCHAR(30),
    Unid_Medida VARCHAR(15),
    Cantidad INT(10),
    Fecha_de_Ingreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecha_de_Vencimiento DATE
);

CREATE TABLE ingred_Pasteleria(
    ID_Producto INT(5) PRIMARY KEY AUTO_INCREMENT, 
    Nombre_Producto VARCHAR(30),
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
);

CREATE TABLE ingred_past_doble(
    ID_Producto INT(5) PRIMARY KEY AUTO_INCREMENT, 
    Nombre_Producto VARCHAR(30),
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
);
