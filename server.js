const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./services/mongo');
const cors = require('cors');
const { userRouter } = require('./routes/api/users');
const { profileRouter } = require('./routes/api/profile');
const { authRouter } = require('./routes/api/auth');
const { postsRouter } = require('./routes/api/posts');
const { arubaRouter } = require('./routes/api/aruba');
const { merakiRouter } = require('./routes/api/meraki');
const { ruckusRouter } = require('./routes/api/ruckus');

const app = express();

const corsOptions = {
  exposedHeaders: 'Authorization'
}


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

connectDB();

app.get('/', (req, res) => {
    res.status(201).json({
        message: 'App running'
    });
});

app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/aruba', arubaRouter);
app.use('/api/meraki', merakiRouter);
app.use('/api/ruckus', ruckusRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    `Server started on port ${PORT}`
});