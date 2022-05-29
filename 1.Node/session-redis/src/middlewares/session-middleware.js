import redis from 'redis';
import connectRedis from 'connect-redis';
import session from 'express-session';

const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
  url: process.env.SESSION_REDIS_URI,
  legacyMode: true,
});
redisClient.on('ready', function () {
  console.log('redis is running');
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  redisClient.get('name', (err, reply) => {});
})();

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false, // in prod (https) must be true
    httpOnly: true,
    maxAge: 1000 * 60 * 30,
    sameSite: 'lax', //
  },
});

export const checkSession = (req, res, next) => {
  if (!req.session || !req.session.clientId) {
    const err = new Error('You shall not pass');
    err.statusCode = 401;
    next(err);
  }
  next();
};
