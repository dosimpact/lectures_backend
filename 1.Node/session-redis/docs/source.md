

https://gist.github.com/productioncoder/3d2f27753b5a952f23383334a25c2ed2
https://www.youtube.com/watch?v=mzG3tpZmRUE&list=PL1Nml43UBm6fPP7cW9pAFTdZ_9QX2mBn2&index=3


```js
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

const app = express();

// if you run behind a proxy (e.g. nginx)
// app.set('trust proxy', 1);
// nginx, k8s 을 앞단에 두고, HTTPS 요청에서, HTTP 요청으로 프록시 되면 쿠기가 빠지게 되어있다. 

const RedisStore = connectRedis(session);

// 1 configure our redis
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost'
});

// 2. configure session middleware
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: 'mySecret',
    saveUninitialized: false,
    resave: false, 
    cookie: {
        secure: false, // if true: only transmit cookie over https
        httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000 * 60 * 30, // session max age in milliseconds
        sameSite: 'lax' // make sure sameSite is not none
    }
}));

// 3. create an unprotected login endpoint
app.post('/login', (req, res) => {
    const {email, password} = req;

    // check if the credentials are correct
    // ...

    // assume that credentials are correct
    req.session.clientId = 'abc123';
    req.session.myNum = 5;

    res.json('you are now logged in');
});

// 4. plug in another middleware that will check if the user is authenticated or not
// all requests that are plugged in after this middleware will only be accessible if the user is logged in
app.use((req, res, next) => {
    if (!req.session || !req.session.clientId) {
        const err = new Error('You shall not pass');
        err.statusCode = 401;
        next(err);
    }
    next();
});

// 5. plug in all routes that the user can only access if logged in
app.get('/profile', (req, res) => {
    res.json(req.session);
});

app.listen(8080, () => console.log('server is running on port 8080'));

```