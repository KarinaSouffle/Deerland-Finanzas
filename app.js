/**
 * @apiName Api-Finanzas
 * */

const express = require('express');
const mysql = require('mysql');
const cors = require("cors");

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors({
  origin: "*"  
}));

//Fechas
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10){
  dd = '0' + dd;
}
if (mm < 10){
  mm = '0' + mm;
}
today = yyyy + '-' + mm + '-' + dd;
//console.log(today);

// MySql
const connection = mysql.createConnection({
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'b195ebf0384247',
  password: '1ddf6c63',
  database: 'heroku_38cdc152decb720'
});
setInterval(function () {
  connection.query('SELECT 1');
}, 5000);
// Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});


//                                         -----Areas Deerland-----
// Desplegar todos los registros de areas
app.get('/areasdeerland', (req, res) => {
  const sql = 'SELECT * FROM areasdeerland';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
});
//Desplegar un registro en especifico
app.get('/areasdeerland/:ID_A', (req, res) => {
  const { ID_A } = req.params;
  if(!isNaN(ID_A)){
    const sql = `SELECT * FROM areasdeerland WHERE ID_A = ${ID_A}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
  });
    
  }else{
    res.json('Error, valores no validos. Si desea buscar algun registro de solicitud el formato es: https://deerland-finanzas.herokuapp.com/areasdeerland/ID_de_la_solicitud');
  }
  
});
//Desplegar ultimo registro
app.get('/areasdeerland/ultimo', (req, res) => {
  const sql = 'SELECT MAX(ID_A) AS ID_A, Nombre_A FROM areasdeerland';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });

});
//Añadir registro
app.post('/areasdeerland/agregar', (req, res) => {
  
  const AreaObj = {
    Nombre_A: req.body.Nombre_A
  };

  const sql = 'INSERT INTO areasdeerland SET ?';
  connection.query(sql, AreaObj, error => {
    if (error) throw error;
    const sql2 = 'SELECT * FROM areasdeerland ORDER BY ID_A DESC LIMIT 1';
    connection.query(sql2, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
  });
});
//Editar area
app.put('/areasdeerland/editar/:ID_A', (req, res) => {
  const { ID_A } = req.params;
  const { Nombre_A } = req.body;
  const sql = `UPDATE areasdeerland SET Nombre_A='${Nombre_A}' WHERE ID_A =${ID_A}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Area editada con exito!');
  });
});
//Eliminar un area
app.delete('/areasdeerland/eliminar/:ID_A', (req, res) => {
  const { ID_A } = req.params;
  const sql = `DELETE FROM areasdeerland WHERE ID_A= ${ID_A}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Area eliminada');
  });
});

//                                         -----Solicitud de Nomina-----
/**
 * @api {post} https://deerland-finanzas.herokuapp.com/solicitud-nomina/agregar Registro de Solicitudes de Nomina
 * @apiName PostSolicitudNomina
 * @apiGroup Empleados
 * 
 * @apiParam {Number} IDNomina Id de la Nomina
 * @apiParam {Date} FechaPago Fecha del pago de la Nomina
 * @apiParam {Number} SalarioBase Salario base de los empleados
 * @apiParam {Number} HorasE Horas extras trabajadas por los empleados
 * @apiParam {Number} SalarioT Salario total.
 * 
 * @apiParamExample Ejemplo:
 * {
 *  "IDNomina" : 18,
 *  "FechaPago" : "2022-02-02",
 *  "SalarioBase" : 2000,
 *  "HorasE" : 20,
 *  "SalarioT" : 20
 * }
 * 
 * @apiSucessExample Solicitud exitosa:
 *      HTTP/1.1 200 OK
 *      {
 *          status: "Solicitud enviada correctamente."
 *      }
 * @apiError Error al registrar una solicitud
 *
 * @apiErrorExample Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       mensaje:"No hay resultado"
 *     }
 */
//Añadir registro
app.post('/solicitud-nomina/agregar', (req, res) => {
  const sql = 'INSERT INTO solicitudnomina SET ?';
//Objeto con los datos recibidos
  const NominaObj = {
    IDNomina: req.body.IDNomina,
    FechaPago: req.body.FechaPago,
    SalarioBase: req.body.SalarioBase,
    HorasE: req.body.HorasE,
    SalarioT: req.body.SalarioT

  };
//Objeto con los datos a añadir a la BD
  const SolicitudNomObj = {
    ID_A: 4,
    NumNomina: NominaObj.IDNomina,
    Total_Horas_T: NominaObj.HorasE,
    Total_Sueldo_B: NominaObj.SalarioBase,
    Sueldo_Total: NominaObj.SalarioT,
    Fecha: today,
    ES_Solicitud_N: 'En proceso'

  }

  connection.query(sql, SolicitudNomObj, error => {
    if (error) throw error;
    const sql2 = 'SELECT * FROM solicitudnomina ORDER BY ID_Solicitud_N DESC LIMIT 1';
    connection.query(sql2, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
  });
});
// Desplegar todos los registros de areas
app.get('/solicitud-nomina', (req, res) => {
  const sql = 'SELECT * FROM solicitudnomina';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
});
/**
 * @api {get} https://deerland-finanzas.herokuapp.com/solicitud-nomina/:ID_Solicitud_N Información sobre el estado una solicitud
 * @apiName GetEstadoDeSolicitudNomina
 * @apiGroup Empleados
 * 
 * @apiSuccess {Number} ID_Solicitud_N Id de la Solicitud
 * @apiSuccess {Number} ID_A ID del area deerland
 * @apiSuccess {String} NumNomina Numero de nomina
 * @apiSuccess {Number} Total_Horas_T Total de horas trabajadas
 * @apiSuccess {Number} Total_Sueldo_B Total de horas del sueldo base
 * @apiSuccess {Date} Fecha Fecha de la solicitud
 * @apiSuccess {String} ES_Solicitud_N Estado de la solicitud
 * 
 * @apiParamExample Ejemplo:{
 *    https://deerland-finanzas.herokuapp.com/solicitud-nomina/2
 * }
 * 
 * @apiSucessExample Solicitud exitosa:
 *      HTTP/1.1 200 OK
 *      {
 *          "ID_Solicitud_N": 1,
 *          "ID_A": 4,
 *          "NumNomina": "124564",
 *          "Total_Horas_T": 46,
 *          "Total_Sueldo_B": 545,
 *          "Sueldo_Total": 546,
 *          "Fecha": "2022-01-01",
 *          "ES_Solicitud_N": "En Proceso"
 *      }
 * @apiError Error al obtener información de la solicitud
 *
 * @apiErrorExample Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       mensaje:"No se encuentran resultados"
 *     }
 */

//Desplegar un registro en especifico
app.get('/solicitud-nomina/:ID_Solicitud_N', (req, res) => {
  const { ID_Solicitud_N } = req.params;
  if(!isNaN(ID_Solicitud_N)){
    const sql = `SELECT * FROM solicitudnomina WHERE ID_Solicitud_N = ${ID_Solicitud_N}`;
    connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
    });
  }else{
    res.json('Error, valores no validos. Si desea buscar algun registro de solicitud el formato es: https://deerland-finanzas.herokuapp.com/solicitud_nomina/ID_de_la_solicitud');
  }
  
});

//Desplegar solicitudes en proceso
app.get('/nominaproceso', (req, res) => {
  const sql = 'SELECT * FROM solicitudnomina WHERE ES_Solicitud_N = "En proceso"';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
});

//Editar Solicitud
app.put('/solicitud-nomina/editar/:ID_Solicitud_N', (req, res) => {
  const { ID_Solicitud_N } = req.params;
  const { ES_Solicitud_N } = req.body;
  const sql = `UPDATE solicitudnomina SET ES_Solicitud_N='${ES_Solicitud_N}' WHERE ID_Solicitud_N =${ID_Solicitud_N}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Solicitud actualizada con exito!');
  });
});
//Eliminar una solicitud
app.delete('/solicitud-nomina/eliminar/:ID_Solicitud_N', (req, res) => {
  const { ID_Solicitud_N } = req.params;
  const sql = `DELETE FROM solicitudnomina WHERE ID_Solicitud_N= ${ID_Solicitud_N}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Solicitud eliminada');
  });
});

//                                         -----Solicitud de Recursos-----
/**
 * @api {post} https://deerland-finanzas.herokuapp.com/solicitud-recursos/agregar Registro de Solicitudes de Recursos
 * @apiName PostSolicitudRecursos
 * @apiGroup Proveedores
 * 
 * @apiParam {String} NombreArea Nombre del area deerland
 * @apiParam {String} NombreProveedor Nombre del proveedor
 * @apiParam {Number} Subtotal Subtotal de la compra
 * @apiParam {Number} IVA IVA de la compra
 * @apiParam {Number} Total Total de la compra
 * @apiParam {String} Firma Firma del solicitante
 * 
 * @apiParamExample Ejemplo:
 * {
 *  "NombreArea": "Tienda",
 *  "NombreProveedor": "Abcd",
 *  "Subtotal": 23,
 *  "IVA": 32,
 *  "Total": 23,
 *  "Firma": "ND"
 * }
 * 
 * @apiSucessExample Solicitud exitosa:
 *      HTTP/1.1 200 OK
 *      {
 *          status: "Solicitud enviada correctamente."
 *      }
 * @apiError Error al registrar una solicitud
 *
 * @apiErrorExample Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       mensaje:"No hay resultado"
 *     }
 */
//Añadir registro
app.post('/solicitud-recursos/agregar', (req, res) => {
  const sql = 'INSERT INTO solicitudrecursos SET ?';
//Objeto con los datos recibidos
  const RecursosObj = {
    NombreArea: req.body.NombreArea,
    NombreProveedor: req.body.NombreProveedor,
    Subtotal: req.body.Subtotal,
    IVA: req.body.IVA,
    Total: req.body.Total,
    Firma: req.body.Firma

  };
//Objeto con los datos a añadir a la BD
  const SolicitudRecObj = {
    ID_A: 14,
    Nombre_P: RecursosObj.NombreProveedor,
    Subtotal: RecursosObj.Subtotal,
    IVA: RecursosObj.IVA,
    Total_C: RecursosObj.Total,
    Fecha: today,
    ES_Solicitud_R: 'En proceso',
    Ajuste: 'No'

  }

  connection.query(sql, SolicitudRecObj, error => {
    if (error) throw error;
    const sql2 = 'SELECT * FROM solicitudrecursos ORDER BY ID_Solicitud_R DESC LIMIT 1';
    connection.query(sql2, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
  });
});
// Desplegar todos los registros de areas
app.get('/solicitud-recursos', (req, res) => {
  const sql = 'SELECT * FROM solicitudrecursos';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
});
/**
 * @api {get} https://deerland-finanzas.herokuapp.com/solicitud-recursos/:ID_Solicitud_R Información sobre el estado una solicitud
 * @apiName GetEstadoDeSolicitudRecursos
 * @apiGroup Proveedores
 * 
 * @apiSuccess {Number} ID_Solicitud_R Id de la Solicitud
 * @apiSuccess {Number} ID_A ID del area deerland
 * @apiSuccess {String} Nombre_P Nombre del proveedor
 * @apiSuccess {Number} Subtotal Subtotal de la compra
 * @apiSuccess {Number} IVA IVA de la compra
 * @apiSuccess {Number} Total_C Total de la compra
 * @apiSuccess {Date} Fecha Fecha de la solicitud
 * @apiSuccess {String} ES_Solicitud_R Estado de la solicitud
 * @apiSuccess {String} Ajuste Se realizo un ajuste con la solicitud o no
 * 
 * @apiParamExample Ejemplo:{
 *    https://deerland-finanzas.herokuapp.com/solicitud-recursos/2
 * }
 * 
 * @apiSucessExample Solicitud exitosa:
 *      HTTP/1.1 200 OK
 *      {
 *          "ID_Solicitud_R": 1, 
 *          "ID_A": 14,
 *          "Nombre_P": "",
 *          "Subtotal": 456,
 *          "IVA": 54,
 *          "Total_C": 65,
 *          "Fecha": "2022-01-01T00:00:00.000Z",
 *          "ES_Solicitud_R": "En Proceso",
 *          "Ajuste": "No"
 *      }
 * @apiError Error Al obtener información de la solicitud
 *
 * @apiErrorExample Error:
 *     HTTP/1.1 404 Not Found
 *     {
 *       mensaje:"No se encuentran resultados"
 *     }
 */
//Desplegar un registro en especifico
app.get('/solicitud-recursos/:ID_Solicitud_R', (req, res) => {
  const { ID_Solicitud_R } = req.params;
  if(!isNaN(ID_Solicitud_R)){
    const sql = `SELECT * FROM solicitudrecursos WHERE ID_Solicitud_R = ${ID_Solicitud_R}`;
    connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
    });
  }else{
    res.json('Error, valores no validos. Si desea buscar algun registro de solicitud el formato es: https://deerland-finanzas.herokuapp.com/solicitud_recursos/ID_de_la_solicitud');
  }
  
});

//Desplegar solicitudes en proceso
app.get('/recursosproceso', (req, res) => {
  const sql = 'SELECT * FROM solicitudrecursos WHERE ES_Solicitud_R = "En proceso"';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
});

//Editar Solicitud
app.put('/solicitud-recursos/editar/:ID_Solicitud_R', (req, res) => {
  const { ID_Solicitud_R } = req.params;
  const { ES_Solicitud_R } = req.body;
  const sql = `UPDATE solicitudrecursos SET ES_Solicitud_R='${ES_Solicitud_R}' WHERE ID_Solicitud_R =${ID_Solicitud_R}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Solicitud actualizada con exito!');
  });
});
//Eliminar una solicitud
app.delete('/solicitud-recursos/eliminar/:ID_Solicitud_R', (req, res) => {
  const { ID_Solicitud_R } = req.params;
  const sql = `DELETE FROM solicitudrecursos WHERE ID_Solicitud_R= ${ID_Solicitud_R}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Solicitud eliminada');
  });
});

//                                         -----Transacciones con Banco-----
// Desplegar todos los registros de transacciones
app.get('/transaccion', (req, res) => {
  const sql = 'SELECT * FROM transaccion';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
});
//Desplegar una transaccion en especifico
app.get('/transaccion/:Transaction_num', (req, res) => {
  const { Transaction_num } = req.params;
  if(!isNaN(Transaction_num)){
    const sql = `SELECT * FROM transaccion WHERE Transaction_num = ${Transaction_num}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
  });
    
  }else{
    res.json('Error, valores no validos. Si desea buscar algun registro de solicitud el formato es: https://deerland-finanzas.herokuapp.com/areasdeerland/ID_de_la_solicitud');
  }
  
});
//Desplegar ultimo registro
app.get('/transaccion/ultimo', (req, res) => {
  const sql = 'SELECT MAX(Transaction_num) AS Transaction_num, Fecha, Recibo, Origen, Destino, Estatus, Monto FROM transaccion';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });

});
//Añadir registro
app.post('/transaccion/agregar', (req, res) => {
  
  const TransaccionObj = {
    Nombre_A: req.body.Nombre_A,
    Fecha: req.body.Fecha,
    Recibo: req.body.Recibo,
    Origen: req.body.Origen,
    Destino: req.body.Destino,
    Estatus: req.body.Estatus,
    Monto: req.body.Monto
  };

  const sql = 'INSERT INTO transaccion SET ?';
  connection.query(sql, TransaccionObj, error => {
    if (error) throw error;
    const sql2 = 'SELECT * FROM transaccion ORDER BY Transaction_num DESC LIMIT 1';
    connection.query(sql2, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
  });
});
//Eliminar una transaccion
app.delete('/transaccion/eliminar/:Transaction_num', (req, res) => {
  const { Transaction_num } = req.params;
  const sql = `DELETE FROM transaccion WHERE Transaction_num= ${Transaction_num}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Transaccion eliminada');
  });
});

//                                         -----Usuarios Finanzas-----
// Desplegar todos los registros de usuarios
app.get('/usuarios', (req, res) => {
  const sql = 'SELECT * FROM usuarios';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
});
//Desplegar un registro en especifico
app.get('/usuarios/:ID_U', (req, res) => {
  const { ID_U } = req.params;
  if(!isNaN(ID_U)){
    const sql = `SELECT * FROM usuarios WHERE ID_U = ${ID_U}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
  });
    
  }else{
    res.json('Error, valores no validos. Si desea buscar algun registro de solicitud el formato es: https://deerland-finanzas.herokuapp.com/areasdeerland/ID_de_la_solicitud');
  }
  
});
//Desplegar ultimo registro
app.get('/usuarios/ultimo', (req, res) => {
  const sql = 'SELECT MAX(ID_U) AS ID_U, Puesto, Usuario FROM usuarios';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });

});
//Añadir registro
app.post('/usuarios/agregar', (req, res) => {
  
  const UsuarioObj = {
    Puesto: req.body.Puesto,
    Usuario: req.body.Usuario,
    Contraseña: req.body.Contraseña
  };

  const sql = 'INSERT INTO usuarios SET ?';
  connection.query(sql, UsuarioObj, error => {
    if (error) throw error;
    const sql2 = 'SELECT * FROM usuarios ORDER BY ID_A DESC LIMIT 1';
    connection.query(sql2, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultado');
    }
  });
  });
});
//Editar usuarios
app.put('/usuarios/editar/:ID_U', (req, res) => {
  const { ID_U } = req.params;
  const { Contraseña } = req.body;
  const sql = `UPDATE usuarios SET Contraseña='${Contraseña}' WHERE ID_U =${ID_U}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Area editada con exito!');
  });
});
//Eliminar un usuarios
app.delete('/usuarios/eliminar/:ID_U', (req, res) => {
  const { ID_U } = req.params;
  const sql = `DELETE FROM usuarios WHERE ID_U= ${ID_U}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Usuario eliminado');
  });
});


// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

