const authorizationMiddleware = (req, res, next) => {
    // Check if the request is for creating an admin account
    if (req.path === '/admin/register') {
      // Proceed to the next middleware or route handler
      return next();
    }
    
    // check if the user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
  
    // check if the user has the necessary role or permission
    // example: Only allow users with an 'admin' role to access the resource
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden" });
    }
  
    // if the user is authorized, proceed to the next middleware or route handler
    next();
};
  

export default authorizationMiddleware;
  