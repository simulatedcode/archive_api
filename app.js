const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mysql = require("mysql2");

const app = express();
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "prod_ivaa",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database as ID " + connection.threadId);
});

const schema = buildSchema(`
  type artists {
    id: Int
    fullname: String
    nickname: String
    description: String
  }

  type Query {
        artists(id: String): [artists]!
     }
`);

const resolvers = {
  artists: (args, request) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM artists", (err, rows) => {
        if (err) {
          console.error("Error fetching artists: " + err.stack);
          reject("Error fetching artists");
        }
        resolve(rows);
      });
    });
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server run on port 3000");
});
