import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = "10h";

export const signToken = (payload: object) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
