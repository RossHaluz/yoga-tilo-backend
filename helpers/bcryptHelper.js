const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
     return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log('Password not hash. Something went wrong.', error);
    }
}

const comparePassword = async (password, currentPassword) => {
    try {
        return await bcrypt.compare(password, currentPassword);
    } catch (error) {
        console.log('Password is not compare.', error);
    }
}

module.exports = {
  hashPassword,
  comparePassword,
};