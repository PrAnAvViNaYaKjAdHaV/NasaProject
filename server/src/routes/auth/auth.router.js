/** @format */


const passport = require('passport')
const express = require('express');

const authRouter = express.Router();

const { checkLoggedIn } = require('./auth.controller');


authRouter.get('/google', passport.authenticate('google', {
    scope: ['email'],
}));

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'v1/failure',
        successRedirect: '/',
        session: true,
    }),
    (req, res) => {
        console.log('google called us back');
    }
);

authRouter.get('/logout', (req, res) => {
    req.logout()
    return res.redirect('/')
});

authRouter.get('/secret', checkLoggedIn, (req, res) => {
    return res.send('Your personal secret value is 42!');
});

authRouter.get('/failure', (req, res) => {
    return res.send('Failed to loged in');
});

module.exports = authRouter;
