// index.js
require("dotenv").config(); // load .env

const { PrismaClient } = require("@prisma/client");
// IMPORTANT: use the custom generated client path
//const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  try {
    console.log("Starting Prisma Supabase test...");

    // 1. Create Employee
    const newEmployee = await prisma.employee.create({
      data: {
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

    // 2. Create Attendance (linked to employee)
    const newAttendance = await prisma.attendance.create({
      data: {
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
