const express = require('express');
const mysql = require('mysql');

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

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

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
  const sql = `SELECT * FROM areasdeerland WHERE ID_A = ${ID_A}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
  });
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
  
  const sql = 'INSERT INTO areasdeerland SET ?';

  const AreaObj = {
    Nombre_A: req.body.Nombre_A
  };

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
//Desplegar un registro en especifico
app.get('/solicitud-nomina/:ID_Solicitud_N', (req, res) => {
  const { ID_Solicitud_N } = req.params;
  const sql = `SELECT * FROM solicitudnomina WHERE ID_Solicitud_N = ${ID_Solicitud_N}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
  });
});
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
//Desplegar un registro en especifico
app.get('/solicitud-recursos/:ID_Solicitud_R', (req, res) => {
  const { ID_Solicitud_R } = req.params;
  const sql = `SELECT * FROM solicitudrecursos WHERE ID_Solicitud_R = ${ID_Solicitud_R}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No se encuentran resultados');
    }
  });
});
//Añadir registro
app.post('/solicitud-recursos/agregar', (req, res) => {
  const sql = 'INSERT INTO solicitudrecursos SET ?';
//Objeto con los datos recibidos
  const RecursosObj = {
    NombreArea: req.body.NombreArea,
    NombreProveedor: req.body.NombreProveedor,
    //CArticulo: req.body.CArticulo,
    //DArticulo: req.body.DArticulo,
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