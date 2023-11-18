const Router = require("express");
const router = new Router();
const esportsPlayerRouter = require("./esportsPlayerRouter");
const matchRouter = require("./matchRouter");
const teamRouter = require("./teamRouter");
const tournamentRouter = require("./tournamentRouter");
const queryRouter = require("./queryToDbRouter");
const tour_destination = require("./tourDestinations");
const matchTeam = require("./teamMatchRouter");

router.use("/player", esportsPlayerRouter);
router.use("/match", matchRouter);
router.use("/team", teamRouter);
router.use("/tournament", tournamentRouter);
router.use("/query-to-db", queryRouter);
router.use("/tour-destinations", tour_destination);
router.use("/matchTeam", matchTeam);

module.exports = router;
