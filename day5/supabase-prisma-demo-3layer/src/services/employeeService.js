const repo = require("../repositories/employeeRepo");
const { httpError } = require("./_errors");

function parseBool(v) {
  if (v === undefined) return undefined;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  if (["true", "1", "yes"].includes(s)) return true;
  if (["false", "0", "no"].includes(s)) return false;
  return undefined;
}

async function createEmployee({ employeeNo, firstName, lastName, email }) {
  if (!employeeNo?.trim()) throw httpError(400, "employeeNo is required");
  if (!firstName?.trim() || !lastName?.trim()) throw httpError(400, "firstName and lastName are required");

  const no = employeeNo.trim();
  if (await repo.findByEmployeeNo(no)) throw httpError(400, "employeeNo already exists");

  const em = email?.trim() || null;
  if (em && (await repo.findByEmail(em))) throw httpError(400, "email already exists");

  return repo.createEmployee({
    employeeNo: no,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: em,
  });
}

async function listEmployees(query) {
  const page = Math.max(parseInt(query.page || "1", 10), 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize || "20", 10), 1), 100);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const q = query.q ? String(query.q).trim() : "";
  const isActive = parseBool(query.isActive);

  const { items, total } = await repo.listEmployees({ skip, take, q, isActive });

  return { page, pageSize, total, items };
}

async function getEmployeeById(id) {
  if (!id) throw httpError(400, "id is required");
  const emp = await repo.findById(id);
  if (!emp) throw httpError(404, "employee not found");
  return emp;
}

async function updateEmployee(id, payload) {
  const emp = await getEmployeeById(id);

  const data = {};
  if (payload.employeeNo !== undefined) {
    const newNo = String(payload.employeeNo || "").trim();
    if (!newNo) throw httpError(400, "employeeNo cannot be empty");

    if (newNo !== emp.employeeNo) {
      const exists = await repo.findByEmployeeNo(newNo);
      if (exists) throw httpError(400, "employeeNo already exists");
    }
    data.employeeNo = newNo;
  }

  if (payload.firstName !== undefined) {
    const v = String(payload.firstName || "").trim();
    if (!v) throw httpError(400, "firstName cannot be empty");
    data.firstName = v;
  }

  if (payload.lastName !== undefined) {
    const v = String(payload.lastName || "").trim();
    if (!v) throw httpError(400, "lastName cannot be empty");
    data.lastName = v;
  }

  if (payload.email !== undefined) {
    const em = payload.email ? String(payload.email).trim() : null;
    if (em && em !== emp.email) {
      const exists = await repo.findByEmail(em);
      if (exists) throw httpError(400, "email already exists");
    }
    data.email = em;
  }

  if (payload.isActive !== undefined) {
    const b = parseBool(payload.isActive);
    if (b === undefined) throw httpError(400, "isActive must be boolean");
    data.isActive = b;
  }

  return repo.updateEmployee(id, data);
}

async function deleteEmployee(id, { hard = false } = {}) {
  await getEmployeeById(id);

  if (hard) {
    return repo.hardDeleteEmployee(id);
  }
  return repo.softDeleteEmployee(id);
}

module.exports = {
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
