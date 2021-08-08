const area_pedidos = () => {
    //PAGINA CON OPCIONES DEL MODULO PEDIDOS(1.nuevo pedido, 2.para producir y 3.para entregar)
    (req, res) => {
        if (req.session.loggedin) {
            res.render("../../views/pedidos.ejs", {
                Rol: req.session.Rol
            });
        } else {
            res.render("../../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    }
}

const nuevo_pedido = () => {
    //FORMULARIO DE PEDIDOS NUEVOS
    //1. //renderiza la vista del formulario de pedidos
    (req, res) => {
        if (req.session.loggedin) {
            res.render("../../views/nuevo_pedido.ejs", {
                Rol: req.session.Rol
            });
        } else {
            res.render("../../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    }
}

const enviar_nuevo_pedido = () => {
    //2. enviamos los datos del formulario a la base de datos
    //2.1. enviamos los datos del cliente
    (req, res) => {
        if (req.session.loggedin) {
            //opcion 1: si el usuario no existe
            const { ID_Cliente } = req.body;
            if (ID_Cliente) {
                Connection.query('SELECT * FROM clientes WHERE ID_Cliente = ?', [ID_Cliente], async(err, results) => {
                    console.log(results);
                    if (results.length === 0) {
                        //regitramos DATOS DE USUARIO Y PEDIDO
                        const { ID_Cliente, Nombre_Cliente, Apellidos, Correo, Celular, Ciudad, Dirección } = req.body;
                        Connection.query("INSERT INTO clientes SET?", {
                            ID_Cliente: ID_Cliente,
                            Nombre_Cliente: Nombre_Cliente,
                            Apellidos: Apellidos,
                            Correo: Correo,
                            Celular: Celular,
                            Ciudad: Ciudad,
                            Dirección: Dirección
                        }, (err, result) => {
                            if (err) {
                                res.send("ocurrio un error con el query de envio" + err);
                            } else {
                                //2.2 si no hay error, enviamos los datos del pedido
                                const { ID_Cliente, Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte } = req.body;
                                Connection.query("INSERT INTO pedidos SET?", {
                                    ID_Cliente: ID_Cliente,
                                    Fecha_de_Entrega: Fecha_de_Entrega,
                                    Past_Sen_1: Past_Sen_1,
                                    Past_Sen_2: Past_Sen_2,
                                    Past_Sen_3: Past_Sen_3,
                                    Past_Dob_1: Past_Dob_1,
                                    Past_Dob_2: Past_Dob_2,
                                    Past_Dob_3: Past_Dob_3,
                                    Pan_Queso: Pan_Queso,
                                    Pan_Inte: Pan_Inte
                                }, (err, result) => {
                                    if (err) {
                                        res.send("ocurrio un error con el query de envio" + err);
                                    } else {
                                        res.render("../../views/nuevo_pedido.ejs", {
                                            //configuracion de sweetaler2 para login correcto
                                            alert: true,
                                            alertTitle: "Registro Exitoso",
                                            alertMessage: "El Cliente y el Pedido se REGISTRO con éxito",
                                            alertIcon: "Success",
                                            showConfirmButton: false,
                                            timer: 1500,
                                            ruta: "pedidos/para_producir",
                                            Rol: req.session.Rol
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        //opcion 2: si el usuario ya existe
                        const { ID_Cliente, Fecha_de_Entrega, Past_Sen_1, Past_Sen_2, Past_Sen_3, Past_Dob_1, Past_Dob_2, Past_Dob_3, Pan_Queso, Pan_Inte } = req.body;
                        Connection.query("INSERT INTO pedidos SET?", {
                            ID_Cliente: ID_Cliente,
                            Fecha_de_Entrega: Fecha_de_Entrega,
                            Past_Sen_1: Past_Sen_1,
                            Past_Sen_2: Past_Sen_2,
                            Past_Sen_3: Past_Sen_3,
                            Past_Dob_1: Past_Dob_1,
                            Past_Dob_2: Past_Dob_2,
                            Past_Dob_3: Past_Dob_3,
                            Pan_Queso: Pan_Queso,
                            Pan_Inte: Pan_Inte
                        }, (err, result) => {
                            if (err) {
                                res.send("ocurrio un error con el query de envio" + err);
                            } else {
                                res.render("../../views/nuevo_pedido.ejs", {
                                    //configuracion de sweetaler2 para login correcto
                                    alert: true,
                                    alertTitle: "Registro Exitoso",
                                    alertMessage: "El Cliente ya EXISTIA, su Pedido se REGISTRO con éxito",
                                    alertIcon: "Success",
                                    showConfirmButton: false,
                                    timer: 1500,
                                    ruta: "pedidos/para_producir",
                                    Rol: req.session.Rol
                                });
                            }
                        });
                    }
                });
            }
        } else {
            res.render("../../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    }
}

const pedidos_para_producir = () => {
    //2.3 renderizar el listado de pedidos en PARA PRODUCIR
    (req, res) => {
        if (req.session.loggedin) {
            Connection.query('SELECT * FROM pedidos', (err, result) => { //pide los datos de la tabla de base de datos para renderizarlos en la vista
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    res.render("../../views/para_producir.ejs", {
                        pedidos: result, //pedidos toma los datos del Query (pedidos)
                        Rol: req.session.Rol
                    });
                }
            });
        } else {
            res.render("../../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    }
}

const actualizar_pedido = () => {
    //ACTUALIZAR PEIDOS
    //3.1. //obtener la id
    (req, res) => {
        if (req.session.loggedin) {
            const ID_Pedido = req.params.ID_Pedido;
            Connection.query('SELECT * FROM pedidos WHERE ID_Pedido =?', [ID_Pedido], (err, result) => {
                console.log(result);
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("ID_Pedido: " + req.params.ID_Pedido);
                    res.render("../../views/editarPed.ejs", {
                        pedidos: result[0]
                    });
                }
            });
        } else {
            res.render("../../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    }
}

const enviar_actualizar_pedido = () => {
    //3.2. actualizar pedido 
    (req, res) => {
        const ID_Pedido = req.params.ID_Pedido;
        const {
            Fecha_de_Entrega,
            Past_Sen_1,
            Past_Sen_2,
            Past_Sen_3,
            Past_Dob_1,
            Past_Dob_2,
            Past_Dob_3,
            Pan_Queso,
            Pan_Inte
        } = req.body;
        Connection.query("UPDATE pedidos SET Fecha_de_Entrega=?, Past_Sen_1=?, Past_Sen_2=?, Past_Sen_3=?, Past_Dob_1=?, Past_Dob_2=?, Past_Dob_3=?, Pan_Queso=?, Pan_Inte=? WHERE ID_Pedido = ?", [
            Fecha_de_Entrega,
            Past_Sen_1,
            Past_Sen_2,
            Past_Sen_3,
            Past_Dob_1,
            Past_Dob_2,
            Past_Dob_3,
            Pan_Queso,
            Pan_Inte,
            ID_Pedido
        ], (err, result) => {
            console.log("actualizo" + result);
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("datos actualizados del ID_Pedido: " + req.params.ID_Pedido);
                res.render("../../views/editarPed.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    pedidos: [],
                    alertTitle: "Operación éxitosa",
                    alertMessage: "El Pedido se ACTUALIZO con éxito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "pedidos/para_producir"
                });
            }
        });
    }
}

const borrar_pedido = () => {
    //ELIMINAR PEDIDOS
    //4.1. tomar id de pedido a eliminar
    (req, res) => {
        if (req.session.loggedin) {
            const ID_Pedido = req.params.ID_Pedido;
            console.log(req.params.ID_Pedido);
            Connection.query("SELECT * FROM pedidos WHERE ID_Pedido =?", [ID_Pedido], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    res.render("../../views/borrarPed.ejs", {
                        pedidos: result[0]
                    });
                };
            });
        } else {
            res.render("../../views/error.ejs", {
                alert: true,
                alertTitle: "Error de Credenciales",
                alertMessage: "Debe loguearse para acceder a esta pagina",
                alertIcon: "error",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            });
        }
    }
}

const enviar_borrar_pedido = () => {
    //4.2. eliminar pedido por id
    (req, res) => {
        const ID_Pedido = req.params.ID_Pedido;
        console.log(req.params.ID_Pedido);
        Connection.query("DELETE FROM pedidos WHERE ID_Pedido =?", [ID_Pedido], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("se elimino:" + ID_Pedido);
                //res.redirect("/inventario");
                res.render("../../views/borrarPed.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    pedidos: [],
                    alertTitle: "Operación éxitosa",
                    alertMessage: "El Pedido se ELIMINO con éxito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "pedidos/para_producir"
                });
            }
        });
    }
}


module.exports = {
    area_pedidos: area_pedidos,
    nuevo_pedido: nuevo_pedido,
    enviar_nuevo_pedido: enviar_nuevo_pedido,
    pedidos_para_producir: pedidos_para_producir,
    actualizar_pedido: actualizar_pedido,
    enviar_actualizar_pedido: enviar_actualizar_pedido,
    borrar_pedido: borrar_pedido,
    enviar_borrar_pedido: enviar_borrar_pedido
}