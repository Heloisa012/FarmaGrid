const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '143.106.241.4',
  user: 'cl204215',
  password: 'cl*26012009', 
  database: 'cl204215', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL com sucesso!');
    connection.release();
  }
});

module.exports = pool;

