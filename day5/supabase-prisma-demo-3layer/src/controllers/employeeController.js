const service = require("../services/employeeService");

exports.create = async (req, res, next) => {
  try {
    const emp = await service.createEmployee(req.body);
    res.status(201).json({ success: true, message: "Employee created", data: emp });
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const data = await service.listEmployees(req.query);
    res.json({ success: true, message: "OK", data });
  } catch (e) {
    next(e);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const emp = await service.getEmployeeById(req.params.id);
    res.json({ success: true, message: "OK", data: emp });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const emp = await service.updateEmployee(req.params.id, req.body);
    res.json({ success: true, message: "Employee updated", data: emp });
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    // 默认软删除；hard=true 才硬删
    const hard = String(req.query.hard || "").toLowerCase() === "true";
    const result = await service.deleteEmployee(req.params.id, { hard });
    res.json({ success: true, message: hard ? "Employee hard-deleted" : "Employee deactivated", data: result });
  } catch (e) {
    next(e);
  }
};

