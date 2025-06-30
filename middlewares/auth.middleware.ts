import jwt from'jsonwebtoken';

const verifyToken = (req:any, res:any, next:any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied: No token provided.');

    try {
        const decoded = jwt.verify(token, "blablabla"); // Replace with your secret key
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).send('Invalid token.');
    }
};

const isAdmin = (req:any, res:any, next:any) => {
    if (req.user?.role === 'admin') return next();
    return res.status(403).send('Access Denied: Admins only.');
};

const isSelfOrAdmin = (req:any, res:any, next:any) => {
    const targetEmail = req.params.email;
    const currentUser = req.user;

    if (currentUser?.role === 'admin' || currentUser?.email === targetEmail) {
        return next();
    }
    return res.status(403).send('Access Denied: You can only act on your own account.');
};

export default{
    verifyToken,
    isAdmin,
    isSelfOrAdmin
};