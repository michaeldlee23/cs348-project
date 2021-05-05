const jwt = require('jsonwebtoken');
const config = require('../../env/config');

const generateAccessToken = (payload) => {
    const token = jwt.sign(payload, config.secret, { expiresIn: '1y' });
    return token;
}

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || '';
    try {
        const decrypt = await jwt.verify(token, config.secret);
        req.user = decrypt
        // Invalid token
        if (!req.user){
            return res.status(401).send('Unauthorized request');
        }
        // If request has ID param, verify IDs match
        if (req.params.id) {
            if (req.user.id != req.params.id) {
                return res.status(403).send("Forbidden");
            }
        }
        next();
    } catch (err) {
      return res.status(500).json(err.toString());
    }
  };

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
    if (req.user.scope.includes('STUDENT')
        || req.user.scope.includes('ADVISOR')
        || req.user.scope.includes('ADMIN')) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

const isTeacher = async (req, res, next) => {
    if (req.user.scope.includes('TEACHER') 
        || req.user.scope.includes('ADVISOR')
        || req.user.scope.includes('ADMIN')) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

const isAdvisor = async (req, res, next) => {
    if (req.user.scope.includes('ADVISOR') || req.user.scope.includes('ADMIN')) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

const isAdmin = async (req, res, next) => {
    if (req.user.scope.includes('ADMIN')) {
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
    isAdmin,
    verifyToken,
};