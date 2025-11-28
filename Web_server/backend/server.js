require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const studentRoutes = require('./routes/students')
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.method,req.path)
  next()
})

// routes
app.use('/api/students', studentRoutes)
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);

// connect to db
mongoose.connect(process.env.MONG_URI , {serverSelectionTimeoutMS: 30000,})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connect to DB & Server is running on port`, process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })

