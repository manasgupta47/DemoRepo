const express = require('express');
const constant = require('./utilities/constant');
const userRoutes = require('./routes/userRouter');
const connectDB  = require('./dbConfig/dbConnection');
const cors = require('cors');
const app = express();
app.use(cors())
const path = require('path');
app.use(express.json());
connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/users', userRoutes);


app.listen(constant.port, () => {
  console.log(`Server running on port ${constant.port}`);
});
