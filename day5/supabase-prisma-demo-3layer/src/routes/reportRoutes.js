const router = require("express").Router();
const c = require("../controllers/reportController");
router.get("/today", c.today);
module.exports = router;
