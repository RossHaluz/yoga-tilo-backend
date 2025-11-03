const jwt = require('jsonwebtoken');
const prismadb = require('../prisma-client');
const { ctrlWrapper, httpError } = require('../helpers');

const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({
        message: 'Unauthorized: Missing token'
    })

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err) return res.status(401).json({
          message: "Unauthorized: Invalid token",
        });

        req.userId = decoded.userId;
        next()
    });
}

const authorizationRole  = (role) => {
    return ctrlWrapper(async (req, res, next) => {
        const userId = req.userId;
        const user = await prismadb.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) throw httpError(404, 'User not found');
        
        if(user?.role !== role) throw httpError(403, "Forbidden - Insufficient permissions");

        next();
    })
}

module.exports = {
    checkAuth,
    authorizationRole
}