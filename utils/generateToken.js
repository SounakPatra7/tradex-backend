import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export default generateToken;


function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is sent as Bearer <token>
  if (!token) return res.status(403).send('Token is required');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}