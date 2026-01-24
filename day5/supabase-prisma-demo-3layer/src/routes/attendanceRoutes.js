const router = require("express").Router();
const c = require("../controllers/attendanceController");

router.get("/today", c.today);
router.get("/", c.range);
router.post("/", c.upsert);

module.exports = router;
