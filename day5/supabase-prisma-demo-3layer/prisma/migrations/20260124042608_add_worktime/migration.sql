-- CreateTable
CREATE TABLE "WorkTime" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "workMinutes" INTEGER NOT NULL DEFAULT 0,
    "breakMinutes" INTEGER NOT NULL DEFAULT 0,
    "otMinutes" INTEGER NOT NULL DEFAULT 0,
    "ruleVersion" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkTime_employeeId_idx" ON "WorkTime"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkTime_employeeId_workDate_key" ON "WorkTime"("employeeId", "workDate");

-- AddForeignKey
ALTER TABLE "WorkTime" ADD CONSTRAINT "WorkTime_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
