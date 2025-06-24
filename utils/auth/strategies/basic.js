const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const bcrypt = require("bcrypt");
const MongoLib = require("../../../lib/mongo");

passport.use(
  new BasicStrategy(async function(username, password, cb) {
    const mongoDB = new MongoLib();

    try {
      const [user] = await mongoDB.getAll("users", { phone: username });
      if (!user) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        return cb(error, false);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        return cb(error, false);
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);