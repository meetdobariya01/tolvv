// middleware/isUser.js (ES Module format)
import User from '../models/User.js'; // Must use .js extension

const isUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No user found in request' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied: Users only' });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default isUser;
