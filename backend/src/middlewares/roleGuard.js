/**
 * Middleware factory for role-based access control.
 * Usage: roleGuard('admin') or roleGuard('admin', 'hospital')
 */
const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — required role(s): ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { roleGuard };
