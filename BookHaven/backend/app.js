const express = require('express');
const mongoose = require('mongoose');
const router = require("./Routes/UserRoutes");
const bookRoutes = require("./Routes/BookRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");
const orderRoutes = require("./Routes/OrderRoutes");
const cors = require('cors');
const dotenv = require('dotenv')
const uploadRoutes = require('./Routes/UploadRoutes');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    'https://my-book-store-brown.vercel.app',
    process.env.FRONTEND_URL
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    },
    credentials: true
  }));
  

// Serve uploads folder as static
app.use('/upload', uploadRoutes);
app.use(express.json()); // To parse JSON bodies
app.use("/api/users", router);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);


//Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })

    .catch((err) => console.log((err)))
