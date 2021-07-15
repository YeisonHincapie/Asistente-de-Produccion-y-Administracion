//Rutas para el sistema de index

//1.conectamos al servidor(base de datos) antes de renderizar las vistas
const Connection = require('../../config/dbConnection');
//2. Para ENCRIPTAR
const bcryptjs = require("bcryptjs");

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
                    console.log(results);
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
                    console.log("Los datos de los usuarios del sistema se cargaron con exito");
                    res.render("../views/usuarios_sistema.ejs", {
                        usuarios: result
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
                ruta: "login_desarr"
            });
        }
    })

    //2. cargar formulario 
    app.get('/usuarios_sistema/nuevo', (req, res) => {

        res.render("../views/usuarios_regis.ejs");

        //luego de crear el usuario del desarrrollador borrar la linea anterior y activar el codigo comentado
        /*
        if (req.session.loggedin) {
            res.render("../views/usuarios_regis.ejs");
        } else {
            res.render("../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a las funciones de ADMINISTRADOR",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: "login_desarr"
            });
        }
        */
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
                    alertTitle: "Registro exitoso",
                    alertMessage: "El USUARIO se registro EXITOSAMENTE en la base de datos",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "usuarios_sistema"
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
                    alertTitle: "Operación Exitosa",
                    alertMessage: "Los datos del Usuario se ACTUALIZARON con exito",
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
                        alertTitle: "Operación Exitosa",
                        alertMessage: "El usuario se ELIMINO con exito",
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
            res.render("../views/SAYFRE.ejs");
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

    //PAGINA CON OPCIONES DEL MODULO PEDIDOS
    app.get('/pedidos', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/pedidos.ejs");
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
    //_________________________________

    //FORMULARIO DE PEDIDOS NUEVOS
    //1. //renderiza la vista del formulario de pedidos
    app.get('/pedidos/nuevo_pedido', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/nuevo_pedido.ejs");
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

        //2. enviamos los datos del formulario a la base de datos
        //2.1. enviamos los datos del cliente
        app.post("/pedidos/nuevo_pedido", (req, res) => {
            if (req.session.loggedin) {
                //opcion 1: si el usuario no existe
                const { ID_Cliente } = req.body;
                if (ID_Cliente) {
                    Connection.query('SELECT * FROM clientes WHERE ID_Cliente = ?', [ID_Cliente], async(err, results) => {
                        console.log(results);
                        if (results.length === 0) {
                            //regitramos DATOS DE USUARIO Y PEDIDO
                            const { ID_Cliente, Nombre_Cliente, Apellidos, Correo, Celular, Ciudad, Dirección } = req.body;
                            Connection.query("INSERT INTO clientes SET?", { ID_Cliente: ID_Cliente, Nombre_Cliente: Nombre_Cliente, Apellidos: Apellidos, Correo: Correo, Celular: Celular, Ciudad: Ciudad, Dirección: Dirección }, (err, result) => {
                                if (err) {
                                    res.send("ocurrio un error con el query de envio" + err);
                                } else {
                                    //2.2 si no hay error, enviamos los datos del pedido
                                    const { ID_Cliente, Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte } = req.body;
                                    Connection.query("INSERT INTO pedidos SET?", { ID_Cliente: ID_Cliente, Fecha_de_Entrega: Fecha_de_Entrega, Past_Sen_1: Past_Sen_1, Past_Sen_2: Past_Sen_2, Past_Sen_3: Past_Sen_3, Past_Dob_1: Past_Dob_1, Past_Dob_2: Past_Dob_2, Past_Dob_3: Past_Dob_3, Pan_Queso: Pan_Queso, Pan_Inte: Pan_Inte }, (err, result) => {
                                        if (err) {
                                            res.send("ocurrio un error con el query de envio" + err);
                                        } else {
                                            res.render("../views/nuevo_pedido.ejs", {
                                                //configuracion de sweetaler2 para login correcto
                                                alert: true,
                                                alertTitle: "Registro exitoso",
                                                alertMessage: "El Cliente y el Pedido se REGISTRO con exito",
                                                alertIcon: "Success",
                                                showConfirmButton: false,
                                                timer: 1500,
                                                ruta: "pedidos/para_producir"
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            //opcion 2: si el usuario ya existe
                            const { ID_Cliente, Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte } = req.body;
                            Connection.query("INSERT INTO pedidos SET?", { ID_Cliente: ID_Cliente, Fecha_de_Entrega: Fecha_de_Entrega, Past_Sen_1: Past_Sen_1, Past_Sen_2: Past_Sen_2, Past_Sen_3: Past_Sen_3, Past_Dob_1: Past_Dob_1, Past_Dob_2: Past_Dob_2, Past_Dob_3: Past_Dob_3, Pan_Queso: Pan_Queso, Pan_Inte: Pan_Inte }, (err, result) => {
                                if (err) {
                                    res.send("ocurrio un error con el query de envio" + err);
                                } else {
                                    res.render("../views/nuevo_pedido.ejs", {
                                        //configuracion de sweetaler2 para login correcto
                                        alert: true,
                                        alertTitle: "Registro exitoso",
                                        alertMessage: "El Cliente ya EXISTIA, su Pedido se REGISTRO con exito",
                                        alertIcon: "Success",
                                        showConfirmButton: false,
                                        timer: 1500,
                                        ruta: "pedidos/para_producir"
                                    });
                                }
                            });
                        }
                    });
                }
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
    });

    //2.3 renderizar el listado de pedidos
    app.get('/pedidos/para_producir', (req, res) => { //escogemos la direccion a la que ingres
        if (req.session.loggedin) {
            Connection.query('SELECT * FROM pedidos', (err, result) => { //pide los datos de la tabla de base de datos para renderizarlos en la vista
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    res.render("../views/para_producir.ejs", { //la vista a renderizar
                        pedidos: result //pedidos toma los datos del Query (pedidos)
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

    //ACTUALIZAR PEIDOS
    //3.1. //obtener la id
    app.get('/pedidos/para_producir/editarPed/:ID_Pedido', (req, res) => { //escogemos la direccion a la que ingres
        if (req.session.loggedin) {
            const ID_Pedido = req.params.ID_Pedido;
            Connection.query('SELECT * FROM pedidos WHERE ID_Pedido =?', [ID_Pedido], (err, result) => {
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("ID_Pedido: " + req.params.ID_Pedido);
                    res.render("../views/editarPed.ejs", { //la vista a renderizar
                        pedidos: result[0] //inventario toma los datos del Query
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

    //3.2. actualizar pedido 
    app.post("/pedidos/para_producir/editarPed/editar/:ID_Pedido", (req, res) => {
        const ID_Pedido = req.params.ID_Pedido;
        Connection.query("UPDATE pedidos SET Fecha_de_Entrega=?, Past_Sen_1=?, Past_Sen_2=?, Past_Sen_3=?, Past_Dob_1=?, Past_Dob_2=?, Past_Dob_3=?, Pan_Queso=?, Pan_Inte=? WHERE ID_Pedido = ?", [
            Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2,
            Past_Dob_3, Pan_Queso, Pan_Inte, ID_Pedido
        ], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("datos actualizados del ID_Pedido: " + req.params.ID_Pedido);
                res.render("../views/editarPed.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    pedidos: [],
                    alertTitle: "Operación Exitosa",
                    alertMessage: "El Pedido se ACTUALIZO con exito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "pedidos/para_producir"
                });
            }
        });
    });
    //ELIMINAR PEDIDOS
    //4.1. tomar id de pedido a eliminar
    app.get("/pedidos/para_producir/borrarPed/:ID_Pedido", (req, res) => {
        if (req.session.loggedin) {
            const ID_Pedido = req.params.ID_Pedido;
            console.log(req.params.ID_Pedido);
            Connection.query("SELECT * FROM pedidos WHERE ID_Pedido =?", [ID_Pedido], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    res.render("../views/borrarPed.ejs", { //la vista a renderizar
                        pedidos: result[0] //inventario toma los datos del Query
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

    //4.2. eliminar pedido por id
    app.get("/pedidos/para_producir/borrarPed/borrar/:ID_Pedido", (req, res) => {
        const ID_Pedido = req.params.ID_Pedido;
        console.log(req.params.ID_Pedido);
        Connection.query("DELETE FROM pedidos WHERE ID_Pedido =?", [ID_Pedido], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("se elimino:" + ID_Pedido);
                //res.redirect("/inventario");
                res.render("../views/borrarPed.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    pedidos: [],
                    alertTitle: "Operación Exitosa",
                    alertMessage: "El Pedido se ELIMINO con exito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "pedidos/para_producir"
                });
            }
        });
    });
    //_________________________________

    //MODULO DE PRODUCCIÓN
    //listado de produccion diaria

    app.get('/produccion', (req, res) => {
        Connection.query('SELECT * FROM produccion', (err, result) => {
            if (err) {
                res.send("Algo salió mal: " + err);
            } else {
                console.log("Los datos de produccion se cargaron con exito");
                res.render("../views/produccion.ejs", { //la vista a renderizar
                    produccion: result //produccion toma los datos del Query
                }); //luego renderiza la vista con los datos
            }
        });
        /*if (req.session.loggedin) {
            
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
        }*/
    });

    app.post('/produccion', async(req, res) => {
        const { Fecha_de_Entrega, Fecha_de_Produccion, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte } = req.body;
        Connection.query('INSERT INTO produccion ( Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte) SELECT SUM(Past_Sen_1), SUM(Past_Sen_2), SUM(Past_Sen_3), SUM(Past_Dob_1), SUM(Past_Dob_2), SUM(Past_Dob_3), SUM(Pan_Queso), SUM(Pan_Inte) FROM pedidos WHERE Fecha_de_Entrega=?', {
            Fecha_de_Produccion: Fecha_de_Produccion,
            Fecha_de_Entrega: Fecha_de_Entrega,
            Past_Sen_1: Past_Sen_1,
            Past_Sen_2: Past_Sen_2,
            Past_Sen_3: Past_Sen_3,
            Past_Dob_1: Past_Dob_1,
            Past_Dob_2: Past_Dob_2,
            Past_Dob_3: Past_Dob_3,
            Pan_Queso: Pan_Queso,
            Pan_Inte: Pan_Inte
        }, async(err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                res.render("../views/ficha.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    pedidos: [],
                    produccion: [],
                    alertTitle: "Operación Exitosa",
                    alertMessage: "La Ficha de Producción se creo con exito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "produccion"
                });
            };
        });
    });

    app.get("/produccion/ficha/:ID_Ficha", (req, res) => {
        const ID_Ficha = req.params.ID_Ficha;
        console.log("ID de usuario:" + req.params.ID_Ficha);
        Connection.query("SELECT * FROM produccion WHERE ID_Ficha=?", [ID_Ficha], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                res.render("../views/ficha.ejs", {
                    produccion: result[0]
                });
            };
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
                    console.log("Los datos de inventario se cargaron con exito");
                    res.render("../views/para_entregar.ejs", { //la vista a renderizar
                        para_entregar: result //inventario toma los datos del Query
                    }); //luego renderiza la vista con los datos
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
                    res.render("../views/remision.ejs", { //la vista a renderizar
                        para_entregar: result[0] //inventario toma los datos del Query
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

    //2.1 cambiar el estado de la Remisión del Pedido a "ENTREGADO"
    app.get("/pedidos/para_entregar/remision/editar/:ID_Pedido", (req, res) => {
        if (req.session.loggedin) {
            const ID_Pedido = req.params.ID_Pedido;
            Connection.query("UPDATE para_entregar SET Estado =? WHERE ID_Pedido =?", ['Despachado', ID_Pedido], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    console.log("Estado de la Remisión: Pedido Entregado");
                    res.render("../views/remision.ejs", {
                        //configuracion de sweetaler2 para la eliminación correcta
                        alert: true,
                        para_entregar: [],
                        alertTitle: "Operación Exitosa",
                        alertMessage: "La Remisión se ACTUALIZO con exito",
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
            para_entregar: [],
            alertTitle: "Vista en Producción",
            alertMessage: "Esta vista hace parte de la FASE 2 del desarrollo del programa",
            alertIcon: "Success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "pedidos/para_entregar"
        });
    });
    //_________________________________

    //MODULO DE INVENTARIO
    //1.obtener datos de la base de datos para renderizar en la vista
    app.get('/inventario', (req, res) => {
        Connection.query('SELECT * FROM inventario', (err, result) => {
            if (err) {
                res.send("Algo salió mal: " + err);
            } else {
                console.log("Los datos de inventario se cargaron con exito");
                res.render("../views/inventario.ejs", { //la vista a renderizar
                    inventario: result //inventario toma los datos del Query
                }); //luego renderiza la vista con los datos
                //res.render("../views/inventario.ejs", { moment: moment });
            }
        });
        /*if (req.session.loggedin) {
            
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
        }*/

        //2. crear nueva entrada en la tabla
        //escribimos el codigo para enviar los datos al inventario
        app.post("/inventario", async(req, res) => {
            const { Nombre_Ingrediente, Marca, Unid_Medida, Cantidad, Fecha_de_Vencimiento } = req.body;
            Connection.query("INSERT INTO inventario SET?", {
                Nombre_Ingrediente: Nombre_Ingrediente,
                Marca: Marca,
                Unid_Medida: Unid_Medida,
                Cantidad: Cantidad,
                Fecha_de_Vencimiento: Fecha_de_Vencimiento
            }, async(err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    console.log("registro de Ingrediente exitoso");
                    res.render("../views/inventario.ejs", {
                        //configuracion de sweetaler2 para login correcto
                        alert: true,
                        inventario: [],
                        alertTitle: "Registro exitoso",
                        alertMessage: "El Ingrediente se REGISTRO con exito",
                        alertIcon: "Success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "inventario"
                    });
                }
            });
        });
    });

    //3. inventario (actualizar)
    //1. //obtener la id
    app.get('/inventario/editarInvt/:ID_Ingrediente', (req, res) => { //escogemos la direccion a la que ingres
        const ID_Ingrediente = req.params.ID_Ingrediente;
        Connection.query('SELECT * FROM inventario WHERE ID_Ingrediente =?', [ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("Algo salió mal: " + err);
            } else {
                console.log("ID_Ingrediente: " + req.params.ID_Ingrediente);
                res.render("../views/editarInvt.ejs", { //la vista a renderizar
                    inventario: result[0] //inventario toma los datos del Query
                });
            }
        });
        /*if (req.session.loggedin) {
            
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
        }*/
    });
    //2. actualizar entradas 
    app.post("/inventario/editarInvt/editar/:ID_Ingrediente", (req, res) => {
        const ID_Ingrediente = req.params.ID_Ingrediente;
        const { Cantidad, Fecha_de_Ingreso, Fecha_de_Vencimiento } = req.body;
        Connection.query("UPDATE inventario SET Cantidad =?, Fecha_de_Ingreso =?, Fecha_de_Vencimiento =? WHERE ID_Ingrediente =?", [Cantidad, Fecha_de_Ingreso, Fecha_de_Vencimiento, ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("datos actualizados del ID_Ingrediente: " + req.params.ID_Ingrediente);
                res.render("../views/editarInvt.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    inventario: [],
                    alertTitle: "Operación Exitosa",
                    alertMessage: "El Ingrediente se ACTUALIZO con exito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "inventario"
                });
            }
        });
        /*if (req.session.loggedin) {
            
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
        }*/
    });

    /*OPCION MODAL
    //2. actualizar entradas
    app.post("/inventario/:ID_Ingrediente", (req, res) => {
        const ID_Ingrediente = req.params.ID_Ingrediente;
        const { Cantidad, Fecha_de_Ingreso, Fecha_de_Vencimiento } = req.body;
        //Connection.query("UPDATE inventario SET ID_Ingrediente=?", { ID_Ingrediente: ID_Ingrediente }, (err, result) => {
        //Connection.query("UPDATE inventario SET Cantidad="${Cantidad}",Fecha_Ingreso="${Fecha_Ingreso}", Fecha_Vencimiento="${Fecha_Vencimiento}" WHERE ID_Ingrediente="${ID_Ingrediente}";
        Connection.query("UPDATE inventario SET Cantidad =?, Fecha_de_Ingreso = ?, Fecha_de_Vencimiento= ? WHERE ID_Ingrediente = ?", [Cantidad, Fecha_de_Ingreso, Fecha_de_Vencimiento, ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("datos actualizados del ID_Ingrediente: " + req.params.ID_Ingrediente);
                res.render("../views/inventario.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    inventario: [],
                    alertTitle: "Operación Exitosa",
                    alertMessage: "El Ingrediente se ACTUALIZO con exito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "inventario"
                });
            }
        });
    }); */

    //4. inventario (eliminar entradas) 
    //1. //obtener id del Ingrediente
    app.get("/inventario/borrarInvt/:ID_Ingrediente", (req, res) => {
        const ID_Ingrediente = req.params.ID_Ingrediente;
        console.log(req.params.ID_Ingrediente);
        Connection.query("SELECT * FROM inventario WHERE ID_Ingrediente =?", [ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                res.render("../views/borrarInvt.ejs", { //la vista a renderizar
                    inventario: result[0] //inventario toma los datos del Query
                });
            };
        });
        /*if (req.session.loggedin) {
            
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
        }*/
    });
    //2. eliminar entrada de inventario por id
    app.get("/inventario/borrarInvt/borrar/:ID_Ingrediente", (req, res) => {
        const ID_Ingrediente = req.params.ID_Ingrediente;
        console.log(req.params.ID_Ingrediente);
        Connection.query("DELETE FROM inventario WHERE ID_Ingrediente = ?", [ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("se elimino:" + ID_Ingrediente);
                res.render("../views/borrarInvt.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    inventario: [],
                    alertTitle: "Operación Exitosa",
                    alertMessage: "El Ingrediente se ELIMINO con exito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "inventario"
                });
            }
        });
    });


    /*/borrar CON modal
    app.get("/inventario/:ID_Ingrediente", (req, res) => {
        const ID_Ingrediente = req.params.ID_Ingrediente;
        console.log(req.params.ID_Ingrediente);
        Connection.query("SELECT * FROM inventario WHERE ID_Ingrediente =?", [ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                res.render("../views/inventario.ejs", { //la vista a renderizar
                    inventario: result[0] //inventario toma los datos del Query
                });
            };
        });
    });

    //2. eliminar entrada de inventario por id
    app.get("/inventario/borrar/:ID_Ingrediente", (req, res) => {
        const ID_Ingrediente = req.params.ID_Ingrediente;
        console.log(req.params.ID_Ingrediente);
        Connection.query("DELETE FROM inventario WHERE ID_Ingrediente = ?", [ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("se elimino:" + ID_Ingrediente);
                //res.redirect("/inventario"
                res.render("../views/inventario.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    alertTitle: "Operación Exitosa",
                    alertMessage: "El Ingrediente se ELIMINO con exito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: false,
                    ruta: "inventario"
                });
            }
        });
    });*/
    //_________________________________

}



/*
 if (req.session.loggedin) {

} else {
    res.render("../views/error.ejs", {
        alert: true,
        usuarios: [],
        alertTitle: "Error de Credenciales",
        alertMessage: "Debe loguearse para acceder a las funciones de ADMINISTRADOR",
        alertIcon: "error",
        showConfirmButton: false,
        timer: 1500,
        ruta: ""
    });
    
}

*/