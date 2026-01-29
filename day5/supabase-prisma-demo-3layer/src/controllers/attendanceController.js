const service = require("../services/attendanceService");

exports.upsert = async (req, res, next) => {
  try {
    const record = await service.upsertAttendance(req.body);
    res.status(201).json({ success: true, message: "Attendance saved", data: record });
  } catch (e) {
    next(e);
  }
};

exports.range = async (req, res, next) => {
  try {
    const data = await service.getRange(req.query);
    res.json({ success: true, message: "OK", data });
  } catch (e) {
    next(e);
  }
};

exports.today = async (req, res, next) => {
  try {
    const data = await service.today(req.query);
    res.json({ success: true, message: "OK", data });
  } catch (e) {
    next(e);
  }
};
