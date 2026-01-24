const express=require('express');
const {PrismaClient}=require('@prisma/client');
const app=express();
const prisma=new PrismaClient();
// 中间件：解析 JSON 请求体
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, message: "OK" });
});

// API #1: Create employee (POST /api/employees)
app.post("/api/employees", async (req, res) => {
  try {
    const { employeeNo, firstName, lastName, email } = req.body || {};

    if (!employeeNo?.trim()) {
      return res.status(400).json({ success: false, message: "employeeNo is required" });
    }
    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({ success: false, message: "firstName and lastName are required" });
    }
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: "email is required" });
    }

    // 根据你的 schema：employeeNo 多半是 unique
    const exists = await prisma.employee.findUnique({
      where: { employeeNo: employeeNo.trim() },
    });
    if (exists) {
      return res.status(400).json({ success: false, message: "employeeNo already exists" });
    }

    const emp = await prisma.employee.create({
      data: {
        employeeNo: employeeNo.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      },
    });

    return res.status(201).json({ success: true, message: "Employee created", data: emp });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

// GET /api/attendance/today
// 可选：?status=PRESENT 或 ?employeeNo=E-1004
app.get("/api/attendance/today", async (req, res) => {
  try {
    const { status, employeeNo } = req.query || {};

    // 1) 今天日期归零（UTC）
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // 2) 可选：按 employeeNo 过滤 -> 先转 employeeId
    let employeeId = undefined;
    if (employeeNo?.trim()) {
      const emp = await prisma.employee.findUnique({
        where: { employeeNo: employeeNo.trim() },
      });
      if (!emp) {
        return res.status(404).json({ success: false, message: "employee not found" });
      }
      employeeId = emp.id;
    }

    // 3) 可选：status 校验
    let finalStatus = undefined;
    if (status) {
      finalStatus = String(status).toUpperCase();
      const allowed = ["PRESENT", "ABSENT", "LATE", "SICK", "VACATION"];
      if (!allowed.includes(finalStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Use: PRESENT, ABSENT, LATE, SICK, VACATION",
        });
      }
    }

    // 4) 查今天所有 attendance（带 employee 信息，报表更直观）
    const records = await prisma.attendance.findMany({
      where: {
        workDate: today,
        ...(employeeId ? { employeeId } : {}),
        ...(finalStatus ? { status: finalStatus } : {}),
      },
      include: {
        employee: {
          select: {
            employeeNo: true,
            firstName: true,
            lastName: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: [
        { status: "asc" },
        { employeeId: "asc" },
      ],
    });

    // 5) 简单汇总（当天报表）
    const totalRecords = records.length;
    const byStatus = records.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      success: true,
      message: "OK",
      data: {
        date: today.toISOString().slice(0, 10),
        totalRecords,
        byStatus,
        records: records.map((r) => ({
          id: r.id,
          workDate: r.workDate,
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          status: r.status,
          note: r.note,
          employee: r.employee,
        })),
      },
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});


// API #2: Upsert attendance by employeeNo + date (POST /api/attendance)
app.post("/api/attendance", async (req, res) => {
  try {
    const { employeeNo, workDate, status, note } = req.body || {};

    if (!employeeNo?.trim()) {
      return res.status(400).json({ success: false, message: "employeeNo is required" });
    }

    // 1) 找员工
    const emp = await prisma.employee.findUnique({
      where: { employeeNo: employeeNo.trim() },
    });
    if (!emp) {
      return res.status(404).json({ success: false, message: "employee not found" });
    }

    // 2) 日期归零（与你脚本一致）
    const day = workDate ? new Date(workDate) : new Date();
    if (Number.isNaN(day.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid workDate. Use YYYY-MM-DD" });
    }
    day.setUTCHours(0, 0, 0, 0);

    // 3) upsert（依赖你 schema 有 employeeId_workDate 复合 unique）
    const record = await prisma.attendance.upsert({
      where: {
        employeeId_workDate: {
          employeeId: emp.id,
          workDate: day,
        },
      },
      update: {
        checkIn: new Date(),
        status: status ?? "PRESENT",
        note: note ?? "Updated via API",
      },
      create: {
        employeeId: emp.id,
        workDate: day,
        checkIn: new Date(),
        status: status ?? "PRESENT",
        note: note ?? "First check-in via API",
      },
    });

    return res.status(201).json({ success: true, message: "Attendance saved", data: record });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running: http://localhost:${port}`));

// 进程退出时关闭连接（课堂更稳）
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});