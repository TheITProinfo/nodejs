// index.js
// require("dotenv").config(); // load .env
// Using node --env-file=.env instead

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting Prisma Supabase test...");

    // 1. Create or Update Employee
    const newEmployee = await prisma.employee.upsert({
      where: { employeeNo: "E-1002" },
      update: {},
      create: {
        employeeNo: "E-1002",
        firstName: "Hello",
        lastName: "Eric",
        email: "helloeric@toronto.ca",
      },
    });

    console.log("Employee created:", newEmployee);

    // Normalize work date (YYYY-MM-DD)
    const workDate = new Date();
    workDate.setUTCHours(0, 0, 0, 0);

    // 2. Upsert Attendance
    const newAttendance = await prisma.attendance.upsert({
      where: {
        employeeId_workDate: {
          employeeId: newEmployee.id,
          workDate: workDate,
        },
      },
      update: {
        checkIn: new Date(),
        note: "Updated check-in via Prisma",
      },
      create: {
        employeeId: newEmployee.id,
        workDate: workDate,
        checkIn: new Date(),
        status: "PRESENT",
        note: "First check-in via Prisma",
      },
    });

    console.log("Attendance created:", newAttendance);

    // 3. Query employee with attendance records
    const employeeWithAttendance = await prisma.employee.findUnique({
      where: { id: newEmployee.id },
      include: {
        attendances: true,
      },
    });

    console.log("Employee with attendance:", employeeWithAttendance);

  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Always close Prisma connection
    await prisma.$disconnect();
    console.log("Prisma connection closed.");
  }
}

main();
