const jwt = require('jsonwebtoken');
const config = require('../../env/config');

const generateAccessToken = (payload) => {
    const token = jwt.sign(payload, config.secret, { expiresIn: '1d' });
    return token;
}

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Access denied / Unauthorized request');
    }

    try {
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Unauthorized request');
        }
    
        const verifiedUser = jwt.verify(token, config.secret);
        if (!verifiedUser) {
            return res.status(401).send('Unauthorized request');
        }

        req.user = verifiedUser;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}

const isStudent = async (req, res, next) => {
    if (req.user.scope.includes('STUDENT')) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

const isTeacher = async (req, res, next) => {
    if (req.user.scope.includes('TEACHER')) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

const isAdvisor = async (req, res, next) => {
    if (req.user.scope.includes('ADVISOR')) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}


module.exports = {
    generateAccessToken,
    authenticateToken,
    isStudent,
    isTeacher,
    isAdvisor,
};