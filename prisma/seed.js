const { hashPassword } = require("../helpers");
const prismadb = require("../prisma-client");

async function main() {
    const hashedPassword = await hashPassword("nastifit0602");
  const adminUser = await prismadb.user.upsert({
    where: {
      email: "admin@nasti.fit",
    },
    update: {},
    create: {
      email: "admin@nasti.fit",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  console.log({ adminUser });
}

main()
  .then(async () => {
    await prismadb.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismadb.$disconnect();
    process.exit(1);
  });
