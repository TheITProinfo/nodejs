const service = require("../services/reportService");
exports.today = async (req, res, next) => {
  try {
    const data = await service.today(req.query);
    res.json({ success: true, message: "OK", data });
  } catch (e) { next(e); }
};
