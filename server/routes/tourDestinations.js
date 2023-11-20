const Router = require("express");
const router = new Router();
const tourDestinationsController = require("../controllers/tourDestinationsController");

router.post("/", tourDestinationsController.create);
router.get("/", tourDestinationsController.getAll);
router.delete("/:id", tourDestinationsController.delete);
router.put("/:id", tourDestinationsController.update);
router.get("/:teamId", tourDestinationsController.getByTeam);

module.exports = router;
