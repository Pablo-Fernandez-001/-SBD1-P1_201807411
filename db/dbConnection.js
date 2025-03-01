require('dotenv').config();
const oracledb = require('oracledb');

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });

    console.log("Successfull connection");
    return connection;
  } catch (error) {
    console.error("Error trying to connect:", error);
  }
}

module.exports = { getConnection };
