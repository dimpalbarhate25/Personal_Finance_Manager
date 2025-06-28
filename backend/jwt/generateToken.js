// jwt/generateToken.js
import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "50d"
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });

  return token;
};

export default createTokenAndSaveCookie;
