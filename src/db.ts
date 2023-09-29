import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'hosteddb.it.auth.gr',
  user: 'userdb',
  password: 'password',
  database: 'greenpro-admin_',
  port: 3306,
};

export const pool = mysql.createPool(dbConfig);
