import * as users from '../models/User.mjs';
import * as logger from '../utils/logger.mjs';
import bcrypt from 'bcrypt';


// CREATE controller ******************************************
const createUser = async (req, res) => { 
    const { username, email, password } = req.body
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    users.createUser( username, email, passwordHash )
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            logger.error(error);
            if (error.errors && error.errors.name && error.errors.name.kind === 'unique') {
                res.status(400).json({ error: 'User with the same email/username already exists.' });
            } else {
                res.status(500).json({ Error: "Whoops, something went wrong with registering your account... Please try again or contact us if your issue persists!" });
            }
        });
};


// RETRIEVE controller ****************************************************
const retrieveUsers = (req, res) => {
    users.retrieveUsers()
        .then(users => { 
            if (users !== null) {
                res.json(users);
            } else {
                res.status(404).json({ Error: 'No users found...' });
            }         
         })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "Whoops, something went wrong with retrieving the users... Please try again or contact us if your issue persists!" });
        });
};

// RETRIEVE by ID controller
const retrieveUserById = (req, res) => {
    users.retrieveUserByID(req.params.id)
    .then(user => { 
        if (user !== null) {
            res.json(user);
        } else {
            res.status(404).json({ Error: 'No users found...' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: '"Whoops, something went wrong with retrieving the user... Please try again or contact us if your issue persists!" ' });
    });
};

// RETRIEVE by ID controller
const retrieveUserByEmail = (req, res) => {
    users.retrieveUserByEmail(req.body.email)
    .then(user => { 
        if (user !== null) {
            res.json(user);
        } else {
            res.status(404).json({ Error: 'No users found...' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: '"Whoops, something went wrong with retrieving the user... Please try again or contact us if your issue persists!" ' });
    });
};

// UPDATE controller ************************************
const updateUserById = (req, res) => {
    const { id } = req.params;
    const { username, email, currentPassword, newPassword } = req.body;

    users.retrieveUserByID(id)
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ Error: "No user found" });
            }

            // verify current password
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isPasswordMatch) {
                return res.status(401).json({ Error: "Invalid current password" });
            }

            // Check for uniqueness of username and email
            const existingUserByUsername = await users.retrieveUserByUsername(username);
            if (existingUserByUsername && existingUserByUsername._id.toString() !== id) {
                return res.status(409).json({ Error: "Username already exists" });
            }

            const existingUserByEmail = await users.retrieveUserByEmail(email);
            if (existingUserByEmail && existingUserByEmail._id.toString() !== id) {
                return res.status(409).json({ Error: "Email already exists" });
            }

            // update password if newPassword is provided
            if (newPassword) {
                const saltRounds = 10;
                const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
                user.passwordHash = newPasswordHash;
            }

            // Update the user's properties (but in the update form, we have all fields filled out already except password)
            if (username) user.username = username;
            if (email) user.email = email;

            // Save the updated user
            user.save()
                .then((updatedUser) => {
                    const { passwordHash, ...userWithoutPassword } = updatedUser.toObject();
                    res.json(userWithoutPassword);
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ Error: "Failed to update user" });
                });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ Error: "Failed to retrieve user" });
        });
};

// DELETE by IDController ******************************
const deleteUserById = (req, res) => {
    users.deleteUserById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The user document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting the user... Please try again or contact us if your issue persists!" });
        });
};

// DELETE Controller ******************************
const deleteUsers = (req, res) => {
    users.deleteUsers()
        .then(deletedCount => {
            if (deletedCount !== 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The user document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting the users... Please try again or contact us if your issue persists!" });
        });
};


export { createUser, retrieveUsers, retrieveUserById, retrieveUserByEmail, updateUserById, deleteUserById, deleteUsers };