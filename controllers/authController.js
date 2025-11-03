const { httpError, ctrlWrapper, comparePassword, singToken } = require("../helpers");
const prismadb = require("../prisma-client");

exports.login = ctrlWrapper(async(req, res) => {
    const {password, email} = req.body;
    const user = await prismadb.user.findFirst({
        where: {
            email
        }
    });

    if(!user) throw httpError(404, 'User not found');
    if(!comparePassword(password, user?.password)) throw httpError(400, 'Password is not correct');

    const payload = {
        userId: user?.id
    }

    const token = await singToken(payload);

    return res.status(200).json({
        user, 
        token
    });
});


exports.current = ctrlWrapper(async (req, res) => {
    const userId = req.userId;
    const user = await prismadb.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user) throw httpError(404, 'User not found');

    return res.status(200).json(user);
})