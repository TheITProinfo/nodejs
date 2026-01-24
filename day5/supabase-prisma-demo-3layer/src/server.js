const app = require("./app");
const prisma = require("./db/prisma");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running: http://localhost:${port}`));

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
