const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    try {
        console.log('In verifyJWT middleware');
        console.log('Headers:', JSON.stringify(req.headers));
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Authorization token is required' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Token is missing' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            req.user = decoded; // Add the decoded token data to the request object
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token',
                error: jwtError.message
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Authentication error', 
            error: error.message 
        });
    }
};

module.exports = verifyJWT;
