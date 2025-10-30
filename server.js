const { app } = require("./app");
const prismadb = require("./prisma-client");

(async () => {
    try {
        await prismadb.$connect();
        console.log('Success connect to the database');
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server run on the port ${PORT}`);
        })
    } catch (error) {
        console.log('Something went wrong', error);
        process.exit(1);
    }
})();
