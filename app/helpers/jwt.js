const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class Token{
    static generateToken(payload){
        const token = jwt.sign(payload, process.env.JWT_PUBLIC_KEY, { expiresIn: 60 * 60 * 24 * 7 });        
        return token;
    }
}

module.exports = {Token};