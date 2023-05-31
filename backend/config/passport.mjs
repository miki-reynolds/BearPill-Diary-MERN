import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import 'dotenv/config';
import * as users from '../models/User.mjs';


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        // Find the user based on the ID from the JWT payload
        const user = await users.retrieveUserByID(jwtPayload.id);
  
        if (!user) {
          // If user not found, authentication fails
          return done(null, false);
        }
  
        // If user is found, authentication succeeds
        return done(null, user);
      } catch (error) {
        // Handle any errors that occur during authentication
        return done(error, false);
      }
    })
  );
  
// export default passport;
export { passport };
  

/**
 * https://www.passportjs.org/packages/passport-jwt/
 
The `passport.mjs` file sets up the Passport middleware with a JWT strategy. It configures Passport to use the `JwtStrategy`, which is responsible for validating and extracting JWT tokens from incoming requests. It relies on the `passport-jwt` library for the JWT-specific functionality. The `opts` object specifies the options for the JWT authentication strategy, such as extracting the token from the authorization header and providing the JWT secret key. Additionally, it defines the logic inside the JWT strategy's callback function to find the user based on the ID from the JWT payload. If the user is found, authentication succeeds; otherwise, it fails. This file exports the configured Passport middleware.

On the other hand, the `authenticationMiddleware.mjs` file sets up additional Passport middleware with a Local strategy for authentication using a username/email and password combination. It configures Passport to use the `LocalStrategy`, which is responsible for validating the credentials provided in the request body. It relies on the `passport-local` library for the local authentication functionality. The `passport.use()` function is used to define the Local strategy, specifying the field names for the username/email and password. The strategy's callback function finds the user based on the provided identifier (username or email) and compares the password hash with the provided password using bcrypt. If the credentials match, authentication succeeds; otherwise, it fails. This file also includes the serialization and deserialization functions for Passport, which are used to store and retrieve user information from the session. These functions are necessary if session-based authentication is enabled, although in this case, the `{ session: false }` option is used, indicating that session-based authentication is disabled. This file exports the configured Passport middleware.

In summary, `passport.mjs` sets up the Passport middleware with a JWT strategy, while `authenticationMiddleware.mjs` sets up additional Passport middleware with a Local strategy for username/email and password authentication. The two files can be used together to support different authentication methods in your application.
 */