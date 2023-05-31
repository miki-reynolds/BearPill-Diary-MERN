import bcrypt from 'bcrypt';
import { passport } from '../config/passport.mjs';
import { Strategy as LocalStrategy } from 'passport-local';
import 'dotenv/config';
import * as users from '../models/User.mjs';


passport.use(new LocalStrategy(
    {
      usernameField: 'identifier',
      passwordField: 'password',
    },
    (identifier, password, done) => {
      // Find the user by either username or email
      users.retrieveUserByUsernameOrEmail(identifier)
        .then((user) => {
          console.log(user)
          if (!user) {
            return done(null, false);
          }
  
          bcrypt.compare(password, user.passwordHash)
            .then((isMatch) => {
              if (isMatch) {
                return done(null, user);
              }
              return done(null, false);
            })
            .catch((error) => {
              return done(error);
            });
        })
        .catch((error) => {
          return done(error);
        });
    }
  ));
  

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users.retrieveUserByID(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error);
    });
});


export default passport;


/**
 * Passport-Local is an authentication strategy provided by the Passport.js library. It is designed for authenticating users based on a set of credentials (e.g., username and password) stored locally in your application's database.

Passport-Local allows you to authenticate users using a traditional username and password approach, where the user's credentials are verified against the stored data in your application's user database.


The `authenticationMiddleware.mjs` file sets up additional Passport middleware with a Local strategy for authentication using a username/email and password combination. It configures Passport to use the `LocalStrategy`, which is responsible for validating the credentials provided in the request body. It relies on the `passport-local` library for the local authentication functionality. The `passport.use()` function is used to define the Local strategy, specifying the field names for the username/email and password. The strategy's callback function finds the user based on the provided identifier (username or email) and compares the password hash with the provided password using bcrypt. If the credentials match, authentication succeeds; otherwise, it fails. This file also includes the serialization and deserialization functions for Passport, which are used to store and retrieve user information from the session. These functions are necessary if session-based authentication is enabled, although in this case, the `{ session: false }` option is used, indicating that session-based authentication is disabled. This file exports the configured Passport middleware.

The `passport.mjs` file sets up the Passport middleware with a JWT strategy. It configures Passport to use the `JwtStrategy`, which is responsible for validating and extracting JWT tokens from incoming requests. It relies on the `passport-jwt` library for the JWT-specific functionality. The `opts` object specifies the options for the JWT authentication strategy, such as extracting the token from the authorization header and providing the JWT secret key. Additionally, it defines the logic inside the JWT strategy's callback function to find the user based on the ID from the JWT payload. If the user is found, authentication succeeds; otherwise, it fails. This file exports the configured Passport middleware.

In summary, `passport.mjs` sets up the Passport middleware with a JWT strategy, while `authenticationMiddleware.mjs` sets up additional Passport middleware with a Local strategy for username/email and password authentication. The two files can be used together to support different authentication methods in your application.

 */