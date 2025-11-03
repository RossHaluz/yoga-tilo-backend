const { ctrlWrapper } = require("../helpers");
const prismadb = require("../prisma-client");

exports.getAllClients = ctrlWrapper(async (req, res) => {
    const clients = await prismadb.client.findMany();

    return res.status(200).json(clients);
});