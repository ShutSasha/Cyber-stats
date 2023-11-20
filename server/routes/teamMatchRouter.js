const Router = require("express");
const router = new Router();

const teamMatchController = require("../controllers/teamMatchController");

router.get("/", teamMatchController.getAll);
router.post("/", teamMatchController.create);
router.put("/:id", teamMatchController.update);
router.delete("/:id", teamMatchController.delete)

module.exports = router;
