const Router = require("express");
const router = new Router();
const playerController = require("../controllers/playerControlles");

router.post("/", playerController.create);
router.get("/", playerController.getAll);
// router.get("/:id", playerController.getOne);
router.put("/:id", playerController.update);
router.delete("/:id", playerController.delete);

module.exports = router;
