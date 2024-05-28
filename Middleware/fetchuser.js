var jwt = require("jsonwebtoken");
const jwt_secret = "itsgood";
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "plese enter correct auth" });
  }

  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server 2 error", message: err.message });
  }
};

module.exports = fetchuser;
