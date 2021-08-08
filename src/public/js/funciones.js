function Enlistar_ID_Pedidos(result, list) {
    list = "";
    for (let i = 0; i < result.length; i++) {
        if (i === (result.length - 1)) {
            list += result[i].ID_Pedido;
        } else {
            list += result[i].ID_Pedido + ",";
        }
        console.log("Id pedido " + [i + 1] + ":", result[i].ID_Pedido);
    }
    return list;
}

module.exports = {
    Enlistar_ID_Pedidos: Enlistar_ID_Pedidos
}


/*
1.en rutas:

 //la llamo a rutas
    const funcion_login = require("./helpers/login");

 //cuando la use
app.get("/login", funcion_login);

2. en el archivo de la función login.js(que esta dentro de helpers):

const funcion_login = (parameters) => {​​​
    //contenido de lo que vaya en login
}​​​
module.exports = funcion_login;

*/