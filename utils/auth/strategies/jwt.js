const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { config } = require("../../../config");
const MongoLib = require("../../../lib/mongo");

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, cb) {
      const mongoDB = new MongoLib();

      try {
        const [user] = await mongoDB.getAll("users", {
          email: tokenPayload.email
        });

        if (!user) {
          const error = new Error('Unauthorized');
          error.statusCode = 401;
          return cb(error, false);
        }

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);