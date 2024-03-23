const express = require('express');
function checkLoggedIn(req, res, next) {
    const isLoggedIn = req.isAuthenticated() && req.user;

    if (!isLoggedIn) {
        return res.status(401).json({
            erro: 'You must log in'
        })
    }
    next()
}



module.exports = {
    checkLoggedIn
}