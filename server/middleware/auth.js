import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    try {
      const fullUser = await User.findById(user.userId);
      req.user = {
        _id: user.userId,
        userId: user.userId,
        role: fullUser?.role || 'student'
      };
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Failed to authenticate' });
    }
  });
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
