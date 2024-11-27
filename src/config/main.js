module.exports = {
    port: process.env.PORT || 80,
    mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/pbl4',
    env: process.env.NODE_ENV || 'development',
};