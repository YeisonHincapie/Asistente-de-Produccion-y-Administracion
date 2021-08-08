let area_inventario = {}

const ver_inventario = () => {
    (req, res) => {
        if (req.session.loggedin) {
            Connection.query('SELECT * FROM inventario', (err, result) => {
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("Los datos de inventario se cargaron con éxito");
                    res.render("../../views/inventario.ejs", {
                        inventario: result,
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
                    console.log("registro de Ingrediente Exitoso");
                    res.render("../../views/inventario.ejs", {
                        //configuracion de sweetaler2 para login correcto
                        alert: true,
                        inventario: [],
                        alertTitle: "Registro Exitoso",
                        alertMessage: "El Ingrediente se REGISTRO con éxito",
                        alertIcon: "Success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "inventario",
                        Rol: req.session.Rol
                    });
                }
            });
        });
    }
}

//3. inventario (actualizar)
//3.1. //obtener la id
const actualizar_producto = () => {
    (req, res) => {
        if (req.session.loggedin) {
            const ID_Ingrediente = req.params.ID_Ingrediente;
            Connection.query('SELECT * FROM inventario WHERE ID_Ingrediente =?', [ID_Ingrediente], (err, result) => {
                if (err) {
                    res.send("Algo salió mal: " + err);
                } else {
                    console.log("ID_Ingrediente: " + req.params.ID_Ingrediente);
                    res.render("../../views/editarInvt.ejs", {
                        inventario: result[0]
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

//3.2. actualizar entradas 
const enviar_actualizar_producto = () => {
    (req, res) => {
        if (req.session.loggedin) {
            const ID_Ingrediente = req.params.ID_Ingrediente;
            const { Cantidad, Fecha_de_Ingreso, Fecha_de_Vencimiento } = req.body;
            Connection.query("UPDATE inventario SET Cantidad =?, Fecha_de_Ingreso =?, Fecha_de_Vencimiento =? WHERE ID_Ingrediente =?", [
                Cantidad,
                Fecha_de_Ingreso,
                Fecha_de_Vencimiento,
                ID_Ingrediente
            ], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    console.log("datos actualizados del ID_Ingrediente: " + req.params.ID_Ingrediente);
                    res.render("../../views/editarInvt.ejs", {
                        //configuracion de sweetaler2 para la eliminación correcta
                        alert: true,
                        inventario: [],
                        alertTitle: "Operación éxitosa",
                        alertMessage: "El Ingrediente se ACTUALIZO con éxito",
                        alertIcon: "Success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "inventario"
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

//4. inventario (eliminar entradas) 
//4.1. //obtener id del Ingrediente
const borrar_producto = () => {
    (req, res) => {
        if (req.session.loggedin) {
            const ID_Ingrediente = req.params.ID_Ingrediente;
            console.log(req.params.ID_Ingrediente);
            Connection.query("SELECT * FROM inventario WHERE ID_Ingrediente =?", [ID_Ingrediente], (err, result) => {
                if (err) {
                    res.send("ocurrio un error con el query de envio" + err);
                } else {
                    res.render("../../views/borrarInvt.ejs", {
                        inventario: result[0]
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

//4.2. eliminar entrada de inventario por id
const enviar_borrar_producto = () => {
    (req, res) => {
        const ID_Ingrediente = req.params.ID_Ingrediente;
        console.log(req.params.ID_Ingrediente);
        Connection.query("DELETE FROM inventario WHERE ID_Ingrediente = ?", [ID_Ingrediente], (err, result) => {
            if (err) {
                res.send("ocurrio un error con el query de envio" + err);
            } else {
                console.log("se elimino:" + ID_Ingrediente);
                res.render("../../views/borrarInvt.ejs", {
                    //configuracion de sweetaler2 para la eliminación correcta
                    alert: true,
                    inventario: [],
                    alertTitle: "Operación éxitosa",
                    alertMessage: "El Ingrediente se ELIMINO con éxito",
                    alertIcon: "Success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "inventario"
                });
            }
        });
    }
}


area_inventario.ver_inventario = ver_inventario;
area_inventario.actualizar_producto = actualizar_producto;
area_inventario.enviar_actualizar_producto = enviar_actualizar_producto;
area_inventario.borrar_producto = borrar_producto;
area_inventario.enviar_borrar_producto = enviar_borrar_producto;

module.exports = area_inventario;