import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import passport from '../middlewares/authenticationMiddleware.mjs';
import * as logger from '../utils/logger.mjs';
import * as users from '../models/User.mjs';


const signUp = (req, res) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;

  // Hash the password
  bcrypt.hash(password, saltRounds)
    .then( async (passwordHash) => {
      // Create a new user in the database
      return users.createUser(username, email, passwordHash)
      .then((user) => {
        // Return the user object or a success message
        res.status(201).json(user);
      })
      .catch((error) => {
        logger.error(error);
        if (error.errors && error.errors.email && error.errors.email.kind === 'unique') {
          res.status(400).json({ error: "User with the same email already exists." });
        } else {
          res.status(500).json({ error: "Failed to register user" });
        }
      });
    })
    .catch((error) => {
        logger.error(error);
        res.status(500).json({ error: "Whoops, something went wrong with registering your account... Please try again or contact us if your issue persists!" });
    })
};

const signIn = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    };

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    };

    req.login(user, { session: false }, async (error) => {
      if (error) {
        return next(error);
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return res.json({ token });
    });
  })(req, res, next);
};

async function createAdminAccount(req, res) {
    const { username, email, password } = req.body;
    const role = 'admin';

    try {
        // check if an admin account already exists
        const adminExists = await users.User.exists({ role: 'admin' });
        if (adminExists) {
            return res.status(400).json({ Error: "Admin account already exists" });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new users.User({ username, email, passwordHash, role });
        // Save the admin user to the database
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ Error: "Failed to create admin account" });
    }
}


export { signIn, signUp, createAdminAccount };


/**
1. **signIn**: This function is used for user sign-in/authentication.
   - It uses `passport.authenticate()` with the strategy named `'local'` (configured using `passport.use(new LocalStrategy(...))`) to authenticate the user based on their credentials.
   - The `{ session: false }` option is passed to disable session-based authentication since JWT tokens are used.
   - If authentication fails (`!user`), a 401 status code with an error message is returned.
   - If authentication is successful, the `req.login()` function is called to manually log in the user (since session-based authentication is disabled). It stores the user object in the `req.user` property.
   - A JWT token is generated using `jwt.sign()` and returned in the response.
   - The (req, res, next) at the end of the code snippet is a function call that immediately executes the middleware returned by passport.authenticate(). This is a common pattern used to invoke the authentication middleware directly with the current request, response, and next middleware function.
   - example: 
     app.post('/protected-route', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // This function is invoked after authentication is successful
    // and before executing the route handler logic

    // You can access the authenticated user's information using req.user
    const authenticatedUser = req.user;

    // Perform additional operations or checks based on the authenticated user
    // ...

    // If everything is fine, pass control to the next middleware or route handler
    next();
    }, (req, res) => {
      // Route handler logic
      res.json({ message: 'Protected route accessed successfully' });
    });


2. **signUp**: This function handles user registration/sign-up.
   - It extracts the username, email, and password from the request body.
   - The password is hashed using bcrypt's `bcrypt.hash()` function with a salt round of 10.
   - The `users.createUser()` function is called to create a new user in the database with the hashed password.
   - If the user is successfully created, a 201 status code with the user object is returned.
   - If an error occurs, it is logged, and an appropriate error response is sent back.

3. **createAdminAccount**: This function creates an admin account.
   - It extracts the username, email, and password from the request body.
   - It checks if an admin account already exists in the database using `users.User.exists()`.
   - If an admin account exists, a 400 status code with an error message is returned.
   - The password is hashed using bcrypt's `bcrypt.hash()` function with a salt round of 10.
   - A new `users.User` object is created with the provided information and a role of `'admin'`.
   - The admin user is saved to the database using `newUser.save()`.
   - If successful, a 201 status code with the created admin user object is returned.
   - If an error occurs, it is logged, and an appropriate error response is sent back.

The `logger` module is used for logging errors, and the `users` module is assumed to handle interactions with the user model in the database.

Finally, the `signIn`, `signUp`, and `createAdminAccount` functions are exported to be used by other modules.
 */