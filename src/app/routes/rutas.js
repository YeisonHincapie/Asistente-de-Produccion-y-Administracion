//Rutas para el sistema de index

//1.conectamos al servidor(base de datos) antes de renderizar las vistas
const Connection = require('../../config/dbConnection');
//2. Para ENCRIPTAR
const bcryptjs = require("bcryptjs");
//MODULOS 
//1. Login

//2.Pedidos
/*
const opciones_pedidos = require('./modulos/area_pedidos');
const nuevo_pedido = require('./modulos/area_pedidos');
const enviar_nuevo_pedido = require('./modulos/area_pedidos');
const pedidos_para_producir = require('./modulos/area_pedidos');
const actualizar_pedido = require('./modulos/area_pedidos');
const enviar_actualizar_pedido = require('./modulos/area_pedidos');
const borrar_pedido = require('./modulos/area_pedidos');
const enviar_borrar_pedido = require('./modulos/area_pedidos');
*/
//4. Inventario


/*
const area_inventario = require('./modulos/area_inventario');
const ver_inventario = require('./modulos/area_inventario');
const borrar_producto = require('./modulos/area_inventario');
const enviar_borrar_producto = require('./modulos/area_inventario');
const actualizar_producto = require('./modulos/area_inventario');
const enviar_actualizar_producto = require('./modulos/area_inventario');
*/
//. funciones
const funciones = require('../../public/js/funciones');

//luego creamos una funsion para renderizar las vistas
module.exports = app => {

    //1. ACESO DE USUARIOS AL SISTEMA
    //loggin de usuarios
    app.get("/", (req, res) => {
        res.render("../views/login.ejs");

        //solicitar POST DE LOGIN (AUTENTICACIÓN DE CREDENCIALES)
        app.post("/", async(req, res) => {
            const { Rol, pass } = req.body;
            let passwordHaash = await bcryptjs.hash(pass, 8);
            if (Rol && pass) {
                Connection.query('SELECT * FROM usuarios WHERE Rol = ?', [Rol], async(err, results) => {
                    if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                        res.render("../views/login.ejs", {
                            //configuracion de sweetaler2 para error
                            alert: true,
                            alertTitle: "Error de Autenticación",
                            alertMessage: "Usuario y/o contraseña incorrecto",
                            alertIcon: "error",
                            showConfirmButton: true,
                            timer: false,
                            ruta: ""
                        });
                    } else {
                        if (Rol === "Administrador") {
                            req.session.loggedin = true;
                            req.session.Id_Usuario = results[0].Id_Usuario;
                            req.session.Rol = results[0].Rol;
                            res.render("../views/login.ejs", {
                                //configuracion de sweetaler2 para login correcto
                                alert: true,
                                alertTitle: "Credenciales Correctas",
                                alertMessage: "Bienvenido",
                                alertIcon: "Success",
                                showConfirmButton: false,
                                timer: 1500,
                                ruta: "usuarios_sistema"
                            });
                        } else {
                            req.session.loggedin = true;
                            req.session.Id_Usuario = results[0].Id_Usuario;
                            req.session.Rol = results[0].Rol;
                            res.render("../views/login.ejs", {
                                //configuracion de sweetaler2 para login correcto
                                alert: true,
                                alertTitle: "Credenciales Correctas",
                                alertMessage: "Bienvenido",
                                alertIcon: "Success",
                                showConfirmButton: false,
                                timer: 1500,
                                ruta: "SAYFRE"
                            });
                        }
                    }
                });
            }
        });
    });

    // cerrar sesion 
    app.get("/cerrar_sesion", (req, res) => {
        req.session.destroy(() => {
            res.render("../views/error.ejs", {
                //configuracion de sweetaler2 para login correcto
                alert: true,
                alertTitle: "Sesión Cerrada",
                alertMessage: "Que tenga un buen día",
                alertIcon: "Success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        })
    })

    //_________________________________
    //FUNCIONES DE ADMINISTRADOR
    //1. Listado de usuarios del sistema
    app.get("/usuarios_sistema", (req, res) => {
        if (req.session.loggedin) {
            Connection.query('SELECT * FROM usuarios', (err, result) => {
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("Los datos de los usuarios del sistema se cargaron con éxito");
                    res.render("../views/usuarios_sistema.ejs", {
                        usuarios: result,
                        Rol: req.session.Rol
                    });
                }
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a las funciones de ADMINISTRADOR",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    })

    //2. cargar formulario 
    app.get('/usuarios_sistema/nuevo', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/usuarios_regis.ejs", {
                Rol: req.session.Rol
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a las funciones de ADMINISTRADOR",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    })

    // 2. registro usuario administrtivos
    app.post("/usuarios_sistema/nuevo", async(req, res) => {
        const { ID_Usuario, Rol, pass } = req.body;
        let passwordHaash = await bcryptjs.hash(pass, 8);
        Connection.query("INSERT INTO usuarios SET?", {
            ID_Usuario: ID_Usuario,
            Rol: Rol,
            pass: passwordHaash
        }, async(error, result) => {
            if (error) {
                console.log(error);
            } else {
                res.render("../views/usuarios_sistema.ejs", {
                    alert: true,
                    usuarios: [],
                    alertTitle: "Registro Exitoso",
                    alertMessage: "El USUARIO se registro EXITOSAMENTE en la base de datos",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "usuarios_sistema",
                    Rol: req.session.Rol
                });
            }
        })
    });

    // EDITAR USUARIOS Administrativos
    //1. //obtener la id
    app.get('/usuarios_sistema/editar/:ID_Usuario', (req, res) => {
        if (req.session.loggedin) {
            const ID_Usuario = req.params.ID_Usuario;
            Connection.query('SELECT * FROM usuarios WHERE ID_Usuario =?', [ID_Usuario], (err, result) => {
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("ID_Usuario: " + req.params.ID_Usuario);
                    res.render("../views/usuarios_edit.ejs", {
                        usuarios: result[0]
                    });
                }
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a las funciones de ADMINISTRADOR",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });

    //2. enviar datos editados a la base de datos
    app.post("/usuarios_sistema/editar/enviar/:ID_Usuario", (req, res) => {
        const ID_Usuario = req.params.ID_Usuario;
        const { Rol } = req.body;
        Connection.query("UPDATE usuarios SET Rol =? WHERE ID_Usuario =?", [Rol, ID_Usuario], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("datos actualizados del ID_Usuario: " + req.params.ID_Usuario);
                res.render("../views/usuarios_edit.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    usuarios: [],
                    alertTitle: "Operación éxitosa",
                    alertMessage: "Los datos del Usuario se ACTUALIZARON con éxito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "usuarios_sistema"
                });
            }
        });
    });

    // eliminar usurios del sistema
    //1. //obtener id del usuario
    app.get("/usuarios_sistema/borrar/:ID_Usuario", (req, res) => {
        if (req.session.loggedin) {
            const ID_Usuario = req.params.ID_Usuario;
            console.log(req.params.ID_Usuario);
            Connection.query("SELECT * FROM usuarios WHERE ID_Usuario =?", [ID_Usuario], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    res.render("../views/usuarios_elim.ejs", {
                        usuarios: result[0]
                    });
                };
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a las funciones de ADMINISTRADOR",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });

    //2. eliminar al usuario de la base de datos
    app.get("/usuarios_sistema/borrar/enviar/:ID_Usuario", (req, res) => {
        if (req.session.loggedin) {
            const ID_Usuario = req.params.ID_Usuario;
            console.log(req.params.ID_Usuario);
            Connection.query("DELETE FROM usuarios WHERE ID_Usuario = ?", [ID_Usuario], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    console.log("se elimino:" + ID_Usuario);
                    res.render("../views/usuarios_elim.ejs", {
                        //configuracion de sweetaler2 para la eliminación correcta
                        alert: true,
                        usuarios: [],
                        alertTitle: "Operación éxitosa",
                        alertMessage: "El usuario se ELIMINO con éxito",
                        alertIcon: "Success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "usuarios_sistema"
                    });
                }
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a las funciones de ADMINISTRADOR",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });

    //_________________________________

    //PAGINA DE INICIO
    app.get('/SAYFRE', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/SAYFRE.ejs", {
                Rol: req.session.Rol
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a la pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });
    //___________________________
    /*

    //PAGINA CON OPCIONES DEL MODULO PEDIDOS(1.nuevo pedido, 2.para producir y 3.para entregar)
    app.get("/area_pedidos", opciones_pedidos);
    app.get('/pedidos/nuevo_pedido', nuevo_pedido);
    app.post("/pedidos/nuevo_pedido", enviar_nuevo_pedido);
    app.get('/pedidos/para_producir', pedidos_para_producir);
    app.get('/pedidos/para_producir/editarPed/:ID_Pedido', actualizar_pedido);
    app.post("/pedidos/para_producir/editarPed/editar/:ID_Pedido", enviar_actualizar_pedido);
    app.get("/pedidos/para_producir/borrarPed/:ID_Pedido", borrar_pedido);
    app.get("/pedidos/para_producir/borrarPed/borrar/:ID_Pedido", enviar_borrar_pedido);
    */
    //_________________________________

    //MODULO DE PRODUCCIÓN
    //listado de produccion diaria
    app.get('/produccion', (req, res) => {
        if (req.session.loggedin) {
            Connection.query('SELECT * FROM produccion', (err, result) => {
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("Los datos de produccion se cargaron con éxito");
                    res.render("../views/produccion.ejs", {
                        produccion: result,
                        Rol: req.session.Rol
                    });
                }
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });

    app.post('/produccion', (req, res) => {
        const { Fecha_de_Entrega } = req.body;
        Connection.query("SELECT * FROM produccion WHERE Fecha_de_Entrega=?", [Fecha_de_Entrega], (err, result) => {
            console.log(result.length);
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            }
            if (result.length === 0) { //si la ficha no existe se crea
                const { Fecha_de_Entrega, Fecha_de_Produccion } = req.body;
                Connection.query('SELECT SUM (Past_Sen_1) AS total_ps1, SUM (Past_Sen_2) AS total_ps2, SUM (Past_Sen_3) AS total_ps3, SUM (Past_Dob_1) AS total_pd1, SUM (Past_Dob_2) AS total_pd2, SUM (Past_Dob_3) AS total_pd3, SUM (Pan_Queso) AS total_panques, SUM (Pan_Inte) AS total_paninte  FROM pedidos WHERE Fecha_de_Entrega=?', [Fecha_de_Entrega], (err, result) => {
                    console.log(result);
                    let total_ps1 = result[0].total_ps1;
                    let total_ps2 = result[0].total_ps2;
                    let total_ps3 = result[0].total_ps3;
                    let total_pd1 = result[0].total_pd1;
                    let total_pd2 = result[0].total_pd2;
                    let total_pd3 = result[0].total_pd3;
                    let total_panques = result[0].total_panques;
                    let total_paninte = result[0].total_paninte;
                    let total_pastsen = total_ps1 + total_ps2 + total_ps3;
                    let total_pastdob = total_pd1 + total_pd2 + total_pd3;
                    let total_pasteles = total_pastsen + total_pastdob;
                    let Estado = "Para Producir";
                    Connection.query('INSERT INTO produccion SET?', {
                        Fecha_de_Entrega: Fecha_de_Entrega,
                        Fecha_de_Produccion: Fecha_de_Produccion,
                        total_pasts1: total_ps1,
                        total_pasts2: total_ps2,
                        total_pasts3: total_ps3,
                        total_pastd1: total_pd1,
                        total_pastd2: total_pd2,
                        total_pastd3: total_pd3,
                        total_panqueso: total_panques,
                        total_panint: total_paninte,
                        total_pastsen: total_pastsen,
                        total_pastdob: total_pastdob,
                        total_pasteles: total_pasteles,
                        Estado: Estado
                    }, (err, result) => {
                        if (err) {
                            res.send("ocurrio un error con el query de envio" + err);
                        } else {
                            console.log("La Ficha de Producción se creo Exitosamente");
                            res.render("../views/produccion.ejs", {
                                //configuracion de sweetaler2 para login correcto
                                alert: true,
                                produccion: [],
                                alertTitle: "Registro Exitoso",
                                alertMessage: "La FICHA DE PRODUCCIÓN se creo con éxito",
                                alertIcon: "Success",
                                showConfirmButton: false,
                                timer: 1500,
                                ruta: "produccion",
                                Rol: req.session.Rol
                            });
                        }
                    });
                });
            } else { //si la ficha ya se creo
                console.log("La ficha de producción ya existe");
                res.render("../views/produccion.ejs", {
                    //configuracion de sweetaler2 para login correcto
                    alert: true,
                    produccion: [],
                    alertTitle: "Busqueda éxitosa",
                    alertMessage: "La FICHA DE PRODUCCIÓN ya existe en el listado",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "produccion",
                    Rol: req.session.Rol
                });
            }
        });
    });

    app.get("/produccion/ficha/:ID_Ficha", (req, res) => {
        const ID_Ficha = req.params.ID_Ficha;
        console.log("ID Ficha:" + req.params.ID_Ficha);
        Connection.query("SELECT * FROM total_ingre_linea_pastel WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
            console.log(result.length);
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            }
            if (result.length === 0) { //si los datos de la ficha no existe se crean
                const ID_Ficha = req.params.ID_Ficha;
                Connection.query('SELECT SUM(produccion.total_pasteles*ingred_linea_pasteleria.Harina) AS ingre1,SUM(produccion.total_pasteles*ingred_linea_pasteleria.Margarina) AS ingre2,SUM(produccion.total_pasteles*ingred_linea_pasteleria.Azucar) AS ingre3,SUM(produccion.total_pasteles*ingred_linea_pasteleria.Sal) AS ingre4,SUM(produccion.total_pasteles*ingred_linea_pasteleria.Agua) AS ingre5,SUM(produccion.total_pasteles*ingred_linea_pasteleria.Vitina) AS ingre6,SUM(produccion.total_pasteles*ingred_linea_pasteleria.Harina_laminado) AS ingre7,SUM((produccion.total_pasts1*ingred_linea_pasteleria.Relleno_1)+(produccion.total_pastd1*ingred_linea_pasteleria.Relleno_2)) AS ingre8,SUM((produccion.total_pasts2*ingred_linea_pasteleria.Relleno_1)+(produccion.total_pastd2*ingred_linea_pasteleria.Relleno_2)) AS ingre9,SUM((produccion.total_pasts3*ingred_linea_pasteleria.Relleno_1)+(produccion.total_pastd1*ingred_linea_pasteleria.Relleno_2)+(produccion.total_pastd2*ingred_linea_pasteleria.Relleno_2)) AS ingre10, SUM(produccion.total_pastd2*ingred_linea_pasteleria.Relleno_1) AS ingre11 FROM produccion,ingred_linea_pasteleria WHERE ID_Ficha=?', [ID_Ficha], (err, result) => {
                    let nom_ingre1 = "Harina";
                    let ingre1 = result[0].ingre1;
                    let nom_ingre2 = "Margarina";
                    let ingre2 = result[0].ingre2;
                    let nom_ingre3 = "Azucar";
                    let ingre3 = result[0].ingre3;
                    let nom_ingre4 = "Sal";
                    let ingre4 = result[0].ingre4;
                    let nom_ingre5 = "Agua";
                    let ingre5 = result[0].ingre5;
                    let nom_ingre6 = "Vitina";
                    let ingre6 = result[0].ingre6;
                    let nom_ingre7 = "Harina de laminado";
                    let ingre7 = result[0].ingre7;
                    let nom_ingre8 = "Guayaba";
                    let ingre8 = result[0].ingre8;
                    let nom_ingre9 = "Arequipe";
                    let ingre9 = result[0].ingre9;
                    let nom_ingre10 = "Queso";
                    let ingre10 = result[0].ingre10;
                    let nom_ingre11 = "Tres Quesos";
                    let ingre11 = result[0].ingre11;
                    Connection.query('INSERT INTO total_ingre_linea_pastel SET?', {
                        ID_Ficha: ID_Ficha,
                        Ingrediente1: nom_ingre1,
                        Cantidad1: ingre1,
                        Ingrediente2: nom_ingre2,
                        Cantidad2: ingre2,
                        Ingrediente3: nom_ingre3,
                        Cantidad3: ingre3,
                        Ingrediente4: nom_ingre4,
                        Cantidad4: ingre4,
                        Ingrediente5: nom_ingre5,
                        Cantidad5: ingre5,
                        Ingrediente6: nom_ingre6,
                        Cantidad6: ingre6,
                        Ingrediente7: nom_ingre7,
                        Cantidad7: ingre7,
                        Ingrediente8: nom_ingre8,
                        Cantidad8: ingre8,
                        Ingrediente9: nom_ingre9,
                        Cantidad9: ingre9,
                        Ingrediente10: nom_ingre10,
                        Cantidad10: ingre10,
                        Ingrediente11: nom_ingre11,
                        Cantidad11: ingre11,
                    }, (err, result) => {
                        if (err) {
                            res.send("ocurrio un error con el query de envio" + err);
                        } else {
                            const ID_Ficha = req.params.ID_Ficha;
                            Connection.query('SELECT SUM(produccion.total_panqueso*ingred_linea_pan_queso.Harina) AS ingred_panqueso1, SUM(produccion.total_panqueso*ingred_linea_pan_queso.Margarina) AS ingred_panqueso2, SUM(produccion.total_panqueso*ingred_linea_pan_queso.Azucar) AS ingred_panqueso3, SUM(produccion.total_panqueso*ingred_linea_pan_queso.Sal) AS ingred_panqueso4, SUM(produccion.total_panqueso*ingred_linea_pan_queso.Agua) AS ingred_panqueso5, SUM(produccion.total_panqueso*ingred_linea_pan_queso.Levadura) AS ingred_panqueso6, SUM(produccion.total_panqueso*ingred_linea_pan_queso.Queso_Mozarella) AS ingred_panqueso7 FROM produccion,ingred_linea_pan_queso WHERE ID_Ficha=?', [ID_Ficha], (err, result) => {
                                let nom_ingred_panqueso1 = "Harina";
                                let ingred_panqueso1 = result[0].ingred_panqueso1;
                                let nom_ingred_panqueso2 = "Margarina";
                                let ingred_panqueso2 = result[0].ingred_panqueso2;
                                let nom_ingred_panqueso3 = "Azucar";
                                let ingred_panqueso3 = result[0].ingred_panqueso3;
                                let nom_ingred_panqueso4 = "Sal";
                                let ingred_panqueso4 = result[0].ingred_panqueso4;
                                let nom_ingred_panqueso5 = "Agua";
                                let ingred_panqueso5 = result[0].ingred_panqueso5;
                                let nom_ingred_panqueso6 = "Levadura";
                                let ingred_panqueso6 = result[0].ingred_panqueso6;
                                let nom_ingred_panqueso7 = "Queso Mozarella";
                                let ingred_panqueso7 = result[0].ingred_panqueso7;
                                Connection.query('INSERT INTO total_ingre_linea_pan_queso SET?', {
                                    ID_Ficha: ID_Ficha,
                                    Ingred_panqueso1: nom_ingred_panqueso1,
                                    Cantid_panqueso1: ingred_panqueso1,
                                    Ingred_panqueso2: nom_ingred_panqueso2,
                                    Cantid_panqueso2: ingred_panqueso2,
                                    Ingred_panqueso3: nom_ingred_panqueso3,
                                    Cantid_panqueso3: ingred_panqueso3,
                                    Ingred_panqueso4: nom_ingred_panqueso4,
                                    Cantid_panqueso4: ingred_panqueso4,
                                    Ingred_panqueso5: nom_ingred_panqueso5,
                                    Cantid_panqueso5: ingred_panqueso5,
                                    Ingred_panqueso6: nom_ingred_panqueso6,
                                    Cantid_panqueso6: ingred_panqueso6,
                                    Ingred_panqueso7: nom_ingred_panqueso7,
                                    Cantid_panqueso7: ingred_panqueso7
                                }, (err, result) => {
                                    if (err) {
                                        res.send("ocurrio un error con el query de envio" + err);
                                    } else {
                                        const ID_Ficha = req.params.ID_Ficha;
                                        Connection.query('SELECT SUM(produccion.total_panint*ingred_linea_pan_inte.Harina_Integral) AS ingred_panint1, SUM(produccion.total_panint*ingred_linea_pan_inte.Margarina) AS ingred_panint2, SUM(produccion.total_panint*ingred_linea_pan_inte.Azucar_Morena) AS ingred_panint3, SUM(produccion.total_panint*ingred_linea_pan_inte.Sal) AS ingred_panint4, SUM(produccion.total_panint*ingred_linea_pan_inte.Agua) AS ingred_panint5, SUM(produccion.total_panint*ingred_linea_pan_inte.Levadura) AS ingred_panint6, SUM(produccion.total_panint*ingred_linea_pan_inte.Avena_Hojuelas) AS ingred_panint7, SUM(produccion.total_panint*ingred_linea_pan_inte.Frutas_Crist) AS ingred_panint8, SUM(produccion.total_panint*ingred_linea_pan_inte.Brevas) AS ingred_panint9 FROM produccion,ingred_linea_pan_inte WHERE ID_Ficha=?', [ID_Ficha], (err, result) => {
                                            let nom_ingred_panint1 = "Harina Integral";
                                            let ingred_panint1 = result[0].ingred_panint1;
                                            let nom_ingred_panint2 = "Margarina";
                                            let ingred_panint2 = result[0].ingred_panint2;
                                            let nom_ingred_panint3 = "Azucar Norena";
                                            let ingred_panint3 = result[0].ingred_panint3;
                                            let nom_ingred_panint4 = "Sal";
                                            let ingred_panint4 = result[0].ingred_panint4;
                                            let nom_ingred_panint5 = "Agua";
                                            let ingred_panint5 = result[0].ingred_panint5;
                                            let nom_ingred_panint6 = "Levadura";
                                            let ingred_panint6 = result[0].ingred_panint6;
                                            let nom_ingred_panint7 = "Avena en Hojuelas";
                                            let ingred_panint7 = result[0].ingred_panint7;
                                            let nom_ingred_panint8 = "Frutas Cristalizadas";
                                            let ingred_panint8 = result[0].ingred_panint8;
                                            let nom_ingred_panint9 = "Brevas";
                                            let ingred_panint9 = result[0].ingred_panint9;
                                            Connection.query('INSERT INTO total_ingre_linea_pan_inte SET?', {
                                                ID_Ficha: ID_Ficha,
                                                Ingred_panint1: nom_ingred_panint1,
                                                Cantid_panint1: ingred_panint1,
                                                Ingred_panint2: nom_ingred_panint2,
                                                Cantid_panint2: ingred_panint2,
                                                Ingred_panint3: nom_ingred_panint3,
                                                Cantid_panint3: ingred_panint3,
                                                Ingred_panint4: nom_ingred_panint4,
                                                Cantid_panint4: ingred_panint4,
                                                Ingred_panint5: nom_ingred_panint5,
                                                Cantid_panint5: ingred_panint5,
                                                Ingred_panint6: nom_ingred_panint6,
                                                Cantid_panint6: ingred_panint6,
                                                Ingred_panint7: nom_ingred_panint7,
                                                Cantid_panint7: ingred_panint7,
                                                Ingred_panint8: nom_ingred_panint8,
                                                Cantid_panint8: ingred_panint8,
                                                Ingred_panint9: nom_ingred_panint9,
                                                Cantid_panint9: ingred_panint9
                                            }, (err, result) => {
                                                if (err) {
                                                    res.send("ocurrio un error con el query de envio" + err);
                                                } else {
                                                    const ID_Ficha = req.params.ID_Ficha;
                                                    Connection.query("SELECT * FROM produccion WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                                                        if (err) {
                                                            res.send("ocurrio un error con el query de envio" + err);
                                                        } else {
                                                            let result1 = result[0];
                                                            const ID_Ficha = req.params.ID_Ficha;
                                                            Connection.query("SELECT * FROM total_ingre_linea_pastel WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                                                                if (err) {
                                                                    res.send("ocurrio un error con el query de envio" + err);
                                                                } else {
                                                                    let result2 = result[0];
                                                                    const ID_Ficha = req.params.ID_Ficha;
                                                                    Connection.query("SELECT * FROM total_ingre_linea_pan_queso WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                                                                        if (err) {
                                                                            res.send("ocurrio un error con el query de envio" + err);
                                                                        } else {
                                                                            let result3 = result[0];
                                                                            const ID_Ficha = req.params.ID_Ficha;
                                                                            Connection.query("SELECT * FROM total_ingre_linea_pan_inte WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                                                                                if (err) {
                                                                                    res.send("ocurrio un error con el query de envio" + err);
                                                                                } else {
                                                                                    let result4 = result[0];
                                                                                    Connection.query("SELECT * FROM ingred_linea_pasteleria WHERE ID_Producto=1", [ID_Ficha], (err, result) => {
                                                                                        if (err) {
                                                                                            res.send("ocurrio un error con el query de envio" + err);
                                                                                        } else {
                                                                                            let result5 = result[0];
                                                                                            Connection.query("SELECT * FROM ingred_linea_pan_queso WHERE ID_Producto=1", [ID_Ficha], (err, result) => {
                                                                                                if (err) {
                                                                                                    res.send("ocurrio un error con el query de envio" + err);
                                                                                                } else {
                                                                                                    let result6 = result[0];
                                                                                                    Connection.query("SELECT * FROM ingred_linea_pan_inte WHERE ID_Producto=1", [ID_Ficha], (err, result) => {
                                                                                                        if (err) {
                                                                                                            res.send("ocurrio un error con el query de envio" + err);
                                                                                                        } else {
                                                                                                            let result7 = result[0];
                                                                                                            console.log("resultado:1", result1, result2);
                                                                                                            res.render("../views/ficha.ejs", {
                                                                                                                produccion: result1,
                                                                                                                total_ingre_linea_pastel: result2,
                                                                                                                total_ingre_linea_pan_queso: result3,
                                                                                                                total_ingre_linea_pan_inte: result4,
                                                                                                                ingred_linea_pasteleria: result5,
                                                                                                                ingred_linea_pan_queso: result6,
                                                                                                                ingred_linea_pan_inte: result7,
                                                                                                                Rol: req.session.Rol
                                                                                                            });
                                                                                                        };
                                                                                                    });
                                                                                                };
                                                                                            });
                                                                                        };
                                                                                    });
                                                                                };
                                                                            });
                                                                        };
                                                                    });
                                                                };
                                                            });
                                                        };
                                                    });
                                                };
                                            });
                                        });
                                    };
                                });
                            });
                        };
                    });
                });
            } else { //si los datos de la ficha ya se crearon
                const ID_Ficha = req.params.ID_Ficha;
                Connection.query("SELECT * FROM produccion WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                    if (err) {
                        res.send("ocurrio un error con el query de envio" + err);
                    } else {
                        let result1 = result[0];
                        const ID_Ficha = req.params.ID_Ficha;
                        Connection.query("SELECT * FROM total_ingre_linea_pastel WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                            if (err) {
                                res.send("ocurrio un error con el query de envio" + err);
                            } else {
                                let result2 = result[0];
                                const ID_Ficha = req.params.ID_Ficha;
                                Connection.query("SELECT * FROM total_ingre_linea_pan_queso WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                                    if (err) {
                                        res.send("ocurrio un error con el query de envio" + err);
                                    } else {
                                        let result3 = result[0];
                                        const ID_Ficha = req.params.ID_Ficha;
                                        Connection.query("SELECT * FROM total_ingre_linea_pan_inte WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
                                            if (err) {
                                                res.send("ocurrio un error con el query de envio" + err);
                                            } else {
                                                let result4 = result[0];
                                                Connection.query("SELECT * FROM ingred_linea_pasteleria WHERE ID_Producto=1", [ID_Ficha], (err, result) => {
                                                    if (err) {
                                                        res.send("ocurrio un error con el query de envio" + err);
                                                    } else {
                                                        let result5 = result[0];
                                                        Connection.query("SELECT * FROM ingred_linea_pan_queso WHERE ID_Producto=1", [ID_Ficha], (err, result) => {
                                                            if (err) {
                                                                res.send("ocurrio un error con el query de envio" + err);
                                                            } else {
                                                                let result6 = result[0];
                                                                Connection.query("SELECT * FROM ingred_linea_pan_inte WHERE ID_Producto=1", [ID_Ficha], (err, result) => {
                                                                    if (err) {
                                                                        res.send("ocurrio un error con el query de envio" + err);
                                                                    } else {
                                                                        let result7 = result[0];
                                                                        console.log("resultado:1", result1, result2);
                                                                        res.render("../views/ficha.ejs", {
                                                                            produccion: result1,
                                                                            total_ingre_linea_pastel: result2,
                                                                            total_ingre_linea_pan_queso: result3,
                                                                            total_ingre_linea_pan_inte: result4,
                                                                            ingred_linea_pasteleria: result5,
                                                                            ingred_linea_pan_queso: result6,
                                                                            ingred_linea_pan_inte: result7,
                                                                            Rol: req.session.Rol
                                                                        });
                                                                    };
                                                                });
                                                            };
                                                        });
                                                    };
                                                });
                                            };
                                        });
                                    };
                                });
                            };
                        });
                    };
                });
            }
        });
    });

    //2.1 Remitir todos los pedidos producidos por la fecha de entrega y poner en estado del pedido "Para Entregar"
    app.get("/produccion/ficha/terminada/:ID_Ficha", (req, res) => {
        const ID_Ficha = req.params.ID_Ficha;
        console.log("la id ficha es:", ID_Ficha);
        Connection.query("SELECT Fecha_de_Entrega FROM produccion WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
            let Fecha_de_Entrega = result[0].Fecha_de_Entrega;
            console.log("la fecha es:", Fecha_de_Entrega);
            //consultar id del los clientes y pedidos de la Ficha de Producción
            Connection.query("SELECT ID_Pedido, ID_Cliente FROM pedidos WHERE Fecha_de_Entrega=?", [Fecha_de_Entrega], (err, result) => {
                let resultado1 = result;
                console.log("La ficha de producción tiene ", resultado1.length, " pedidos");
                console.log(resultado1);
                //función para crear listado de Id_Pedidos
                let pedidos = [];
                let clientes = [];
                for (let i = 0; i < resultado1.length; i++) {
                    for (let e = 0; e < 1; e++) {
                        pedidos[i] = JSON.parse(resultado1[i].ID_Pedido);
                        clientes[i] = JSON.parse(resultado1[i].ID_Cliente);
                        console.log("Id del  pedido " + [i + 1] + " es :", resultado1[i].ID_Pedido);
                        console.log("Id del cliente " + [i + 1] + " es :", resultado1[i].ID_Cliente);
                    };
                };
                console.log("el listado de pedidos es:", pedidos);
                console.log("el listado de clientes es:", clientes);
                //Consultad los datos del pedidos y de los clientes
                let datos = "";
                for (let y = 0; y < pedidos.length; y++) {
                    Connection.query("SELECT * FROM clientes WHERE ID_Cliente = (" + clientes[y] + ")", (err, result) => {
                        let resultado2 = result;
                        datos += "(" + resultado2[0].ID_Cliente + ",'" + resultado2[0].Nombre_Cliente + "','" + resultado2[0].Apellidos + "','" + resultado2[0].Correo + "','" + resultado2[0].Celular + "','" + resultado2[0].Ciudad + "','" + resultado2[0].Dirección + "',";
                    });

                    Connection.query("SELECT * FROM pedidos WHERE ID_Pedido = (" + pedidos[y] + ")", (err, result2) => {
                        let resultado3 = result2;
                        if (y === (pedidos.length - 1)) {
                            datos += resultado3[0].ID_Pedido + ",'" + resultado3[0].Fecha_de_Pedido + "','" + resultado3[0].Fecha_de_Entrega + "'," + resultado3[0].Past_Sen_1 + "," + resultado3[0].Past_Sen_2 + "," + resultado3[0].Past_Sen_3 + "," + resultado3[0].Past_Dob_1 + "," + resultado3[0].Past_Dob_2 + "," + resultado3[0].Past_Dob_3 + "," + resultado3[0].Pan_Queso + "," + resultado3[0].Pan_Inte + ",'" + "Para Entregar" + "')";
                        } else {
                            datos += resultado3[0].ID_Pedido + ",'" + resultado3[0].Fecha_de_Pedido + "','" + resultado3[0].Fecha_de_Entrega + "'," + resultado3[0].Past_Sen_1 + "," + resultado3[0].Past_Sen_2 + "," + resultado3[0].Past_Sen_3 + "," + resultado3[0].Past_Dob_1 + "," + resultado3[0].Past_Dob_2 + "," + resultado3[0].Past_Dob_3 + "," + resultado3[0].Pan_Queso + "," + resultado3[0].Pan_Inte + ",'" + "Para Entregar" + "'),";
                        }
                    });
                };
                Connection.query("INSERT INTO para_entregar (ID_Cliente, Nombre_Cliente, Apellidos, Correo, Celular, Ciudad, Dirección, ID_Pedido, Fecha_de_Pedido, Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte, Estado) VALUES " + datos + ";", (err, result) => {
                    console.log("Se enviaron los siguientes datos: ", datos);
                }, (err, result) => {
                    if (err) {
                        res.send("ocurrio un error con el query de envio" + err);
                    } else {
                        console.log("Los pedidos se guardaron Exitosamente");
                        res.render("../views/error.ejs", {
                            //configuracion de sweetaler2 para login correcto
                            alert: true,
                            alertTitle: "Registro Exitoso",
                            alertMessage: "Los pedidos de la FICHA se registraron con éxito",
                            alertIcon: "Success",
                            showConfirmButton: false,
                            timer: 1500,
                            ruta: "produccion",
                        });
                    }
                });
            });

        });

    });


    //_________________________________ 

    //istado con los PEDIDOS PARA ENTREGAR
    //1. Renderizar datos de la tabla en la vista
    app.get('/pedidos/para_entregar', (req, res) => {
        if (req.session.loggedin) {
            Connection.query('SELECT * FROM para_entregar ORDER BY para_entregar.Fecha_de_Entrega ASC', (err, result) => {
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("Los datos de inventario se cargaron con éxito");
                    res.render("../views/para_entregar.ejs", {
                        para_entregar: result,
                        Rol: req.session.Rol
                    });
                }
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });
    ///2.REMISION DE ENTREGA
    //2.1 cargar vista de la Remisión del Pedido
    app.get("/pedidos/para_entregar/remision/:ID_Pedido", (req, res) => {
        if (req.session.loggedin) {
            const ID_Pedido = req.params.ID_Pedido;
            console.log(req.params.ID_Pedido);
            Connection.query("SELECT * FROM para_entregar WHERE ID_Pedido =?", [ID_Pedido], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    res.render("../views/remision.ejs", {
                        para_entregar: result[0]
                    });
                };
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });

    //2.1 cambiar el estado de la Remisión del Pedido a "Despachado"
    app.get("/pedidos/para_entregar/remision/editar/:ID_Pedido", (req, res) => {
        if (req.session.loggedin) {
            const ID_Pedido = req.params.ID_Pedido;
            Connection.query("UPDATE para_entregar SET Estado =? WHERE ID_Pedido =?", ['Despachado', ID_Pedido], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    console.log("Estado de la Remisión: Pedido Despachado");
                    res.render("../views/remision.ejs", {
                        //configuracion de sweetaler2 para la eliminación correcta
                        alert: true,
                        para_entregar: [],
                        alertTitle: "Operación éxitosa",
                        alertMessage: "La Remisión se ACTUALIZO con éxito",
                        alertIcon: "Success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "pedidos/para_entregar"
                    });
                }
            });
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    });

    //2.3 Imprimir REMISIÓN
    app.get('/pedidos/para_entregar/remision/imprimir', (req, res) => {
        res.render("../views/remision.ejs", {
            //configuracion de sweetaler2 para la eliminación correcta
            alert: true,
            alertTitle: "Vista en Producción",
            alertMessage: "Esta vista hace parte de la FASE 2 del desarrollo del programa",
            alertIcon: "Success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "pedidos/para_entregar",
        });
    });

    //_________________________________
    /*
        //MODULO DE INVENTARIO
        //1.obtener datos de la base de datos para renderizar en la vista
        app.get('/inventario', area_inventario.ver_inventario);
        //3. inventario (actualizar)
        //3.1. //obtener la id
        app.get('/inventario/editarInvt/:ID_Ingrediente', area_inventario.actualizar_producto);
        //2. actualizar entradas 
        app.post("/inventario/editarInvt/editar/:ID_Ingrediente", area_inventario.enviar_actualizar_producto);
        //4. inventario (eliminar entradas) 
        //4.1. //obtener id del Ingrediente
        app.get("/inventario/borrarInvt/:ID_Ingrediente", area_inventario.borrar_producto);
        //4.2. eliminar entrada de inventario por id
        app.get("/inventario/borrarInvt/borrar/:ID_Ingrediente", area_inventario.enviar_borrar_producto);
        */
    //_________________________________

}