const express = require('express');
const mongoose = require('mongoose');
const router = require("./Routes/UserRoutes");
const bookRoutes = require("./Routes/BookRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");
const orderRoutes = require("./Routes/OrderRoutes");
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config();

const app = express();

// Serve uploads folder as static
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json()); // To parse JSON bodies
app.use("/api/users", router);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);


//Database Connection
mongoose.connect("mongodb+srv://Admin:Bookstore1234@cluster0.ljmf1p3.mongodb.net/")

.then(() =>console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})

.catch((err) => console.log((err)))
