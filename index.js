const express = require("express");

// middlewares
const bodyParser = require("body-parser");
const cors = require("cors");
const bodyParserMiddleWare = bodyParser.json();
const corsMiddleWare = cors();
const authMiddleWare = require("./auth/middleware");

// Routers
const teamRouter = require("./team/router");
const playerRouter = require("./player/router");
const authRouter = require("./auth/router");
const userRouter = require("./user/router");

// Models & DB
const Team = require("./team/model");
const Player = require("./player/model");
const User = require("./user/model");
const db = require("./db");

// Init
const app = express();
const port = process.env.PORT || 4000;

// If req.body is undefined
// - use bodyparser
// - make sure to app.use(bodyparser) before doing app.use(blablRouter)
// - order matters here (wtf?) -> probably for a good reason

const loggingMiddleWare = (req, res, next) => {
  console.log("I am a middleware", Date.now());
  next(); // everything is ok -> next()
};

app
  // use auth middleware for entire routers (maybe a bit heavy handed)
  // .use(authMiddleWare)
  .use(loggingMiddleWare)
  .use(corsMiddleWare)
  .use(bodyParserMiddleWare)
  .use(userRouter)
  .use(authRouter)
  .use(playerRouter)
  .use(teamRouter)
  .listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });

db.sync({ force: true })
  .then(() => {
    console.log("Database schema has been updated.");

    // simple seeding script
    // const team = Team.create({ name: 'Egel'})
    // const team2 = Team.create({ name: 'Das'})
    // return Promise.all([team, team2])

    // Script that iterates over arrays and creates rows in the database for them
    const teamNames = ['Nihilists', 'NatureForces', 'Mathematicians', 'Wizards'];

    const teams = teamNames.map(teamName => Team.create({ name: teamName }));
    return Promise.all(teams);
  })
 
  .then(() => {
    const players = [
      { name: 'Žižek', number: 4, teamId: 1 },
      { name: 'Tzara', number: 1, teamId: 1 },
      { name: 'de Sade', number: 9, teamId: 1 },
      { name: 'Nietzsche', number: 8, teamId: 1 },
      { name: 'Carravetta', number: 10, teamId: 1 },
      { name: 'Brassier', number: 2, teamId: 1 },
      { name: 'Fardid', number: 3, teamId: 2 },
      { name: 'GrumpyCat', number: 5, teamId: 2 },
      { name: 'Bacteria', number: 6, teamId: 2 },
      { name: 'Water', number: 7, teamId: 2 },
      { name: 'Earth', number: 10, teamId: 2 },
      { name: 'Fire', number: 12, teamId: 2 },
      { name: 'Wind', number: 11, teamId: 2 },
    ]

    const playerPromises = players.map(player => Player.create(player));
    return Promise.all(playerPromises);
  })
  .catch(console.error);

/*

TODO

- player Model
- router -> Player router
- Define the relationships
- router -> add routes to team router so you can get the players of a team?

*/
