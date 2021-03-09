const { userService, emailService } = require('../service');
const { errorCodes, emailActions } = require('../constant');
const { passwordsHasher } = require('../helper');
const { errorMessages } = require('../error');

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const allUsers = await userService.findUsers();

            res.json(allUsers);
        } catch (e) {
            next(e);
        }
    },

    getSingleUser: async (req, res, next) => {
        try {
            const userId = req.params.id;

            const user = await userService.findUserById(userId);

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const { password, email, name } = req.body;

            const hashPassword = await passwordsHasher.hash(password);

            await userService.createUser({ ...req.body, password: hashPassword });

            await emailService.sendMail(email, emailActions.WELCOME, { userName: name });

            res.status(201).json(errorMessages.USER_IS_CREATED);
        } catch (e) {
            next(e);
        }
    },

    deleteSingleUser: async (req, res, next) => {
        try {
            const userId = req.params.id;

            const user = await userService.findUserById(userId);

            const { email, name } = user;

            await userService.deleteSingleUser(userId);

            await emailService.sendMail(email, emailActions.USER_DELETED, { userName: name });

            res.json(`${name} was deleted`);
        } catch (e) {
            next(e);
        }
    }
};
