import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
  
    const authHeader = req.headers.authorization;

  console.log("RAW HEADER:", req.headers.authorization);

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization missing" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Malformed token" });
  }

console.log("JWT_SECRET =", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    return next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
export const onlyFirstYears = (req, res, next) => {
  if (req.user?.year === 1) return next();
  return res.status(403).json({ message: 'Access restricted to first-year students' });
};

export const onlySecondYears = (req, res, next) => {
  if (req.user?.year === 2) return next();
  return res.status(403).json({ message: 'Access restricted to second-year students' });
};

export default { verifyToken, onlyFirstYears, onlySecondYears };
