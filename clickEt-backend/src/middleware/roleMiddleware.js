export function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have the required role.",
      });
    }

    next();
  };
}
