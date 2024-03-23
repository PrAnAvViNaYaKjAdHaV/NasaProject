
const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')

const api = require('./routes/api')

const passport = require('passport')

const { Strategy } = require('passport-google-oauth20')

const cookieSession = require('cookie-session')

const app = express()

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2]
}))

app.use(passport.initialize())

app.use(passport.session())
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    // User.findById(id).then(user => {
    //     done(null, user)
    // })
    done(null, id)
})

const AUTH_OPTIONS = {
    callbackURL: '/v1/auth/google/callback',
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
}
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))



app.use(cors({
    origin: 'http://localhost:3000 '
}));

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(morgan('combined'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})






function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log('Google profile', profile);
    done(null, profile)
}




app.use('/v1', api)
module.exports = app
