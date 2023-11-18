const Router = require("express");
const router = new Router();
const matchController = require("../controllers/matchController");

router.post("/", matchController.create);
router.get("/", matchController.getAll);
router.delete("/:id", matchController.delete);
router.put("/:id", matchController.update);

module.exports = router;