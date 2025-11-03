const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const singToken = async  (payload) => {
    try {
        return await jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
    } catch (error) {
          console.error(error);
        throw new Error('Error creating JWT token');

    }
}

const verifyToken = async (token) => {
    try {
       return await jwt.verify(token, SECRET_KEY); 
    } catch (error) {
          console.error(error);
          throw new Error("Error verifying JWT token");

    }
}

module.exports = {
    singToken,
    verifyToken
}