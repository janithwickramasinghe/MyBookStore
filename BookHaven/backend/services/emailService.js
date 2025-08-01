require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, otp) => {
    
    const mailOptions = {
        from: `"YourApp" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It will expire in 30 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

const sendInvoiceEmail = async (userEmail, userData, orderData, paymentData) => {
    try {
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASSWORD ? '***' : 'MISSING');
        const invoiceNumber = `INV-${Date.now()}`;
        const orderDate = new Date(orderData.createdAt).toLocaleDateString();

        // Create HTML invoice template
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                    .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .invoice-title { color: #333; font-size: 28px; margin: 0; }
                    .invoice-number { color: #666; font-size: 16px; margin: 5px 0; }
                    .customer-info { margin-bottom: 30px; }
                    .customer-info h3 { color: #333; margin-bottom: 10px; }
                    .customer-info p { margin: 5px 0; color: #666; }
                    .order-details { margin-bottom: 30px; }
                    .order-details h3 { color: #333; margin-bottom: 15px; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    .items-table th { background-color: #f8f9fa; font-weight: bold; color: #333; }
                    .total-section { text-align: right; border-top: 2px solid #333; padding-top: 20px; }
                    .total-amount { font-size: 20px; font-weight: bold; color: #333; }
                    .payment-info { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px; }
                    .payment-info h3 { color: #333; margin-bottom: 10px; }
                    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <h1 class="invoice-title">INVOICE</h1>
                        <p class="invoice-number">Invoice #: ${invoiceNumber}</p>
                        <p>Date: ${orderDate}</p>
                    </div>
                    
                    <div class="customer-info">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
                        <p><strong>Email:</strong> ${userEmail}</p>
                        <p><strong>Phone:</strong> ${userData.phone}</p>
                        <p><strong>Address:</strong> ${userData.address}</p>
                    </div>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> ${orderData._id}</p>
                        <p><strong>Order Status:</strong> ${orderData.status}</p>
                        <p><strong>Delivery Address:</strong></p>
                        <p style="margin-left: 20px;">
                            ${orderData.deliveryAddress.fullName}<br>
                            ${orderData.deliveryAddress.street}<br>
                            ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.postalCode}<br>
                            ${orderData.deliveryAddress.country}
                        </p>
                    </div>
                    
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderData.items.map(item => `
                                <tr>
                                    <td>${item.book.name || 'Book'}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${(item.book.price || 0).toFixed(2)}</td>
                                    <td>$${((item.book.price || 0) * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="total-section">
                        <p class="total-amount">Total Amount: $${orderData.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    <div class="payment-info">
                        <h3>Payment Information</h3>
                        <p><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
                        <p><strong>Card Last Four:</strong> ****${paymentData.cardLastFour}</p>
                        <p><strong>Payment Status:</strong> ${paymentData.status}</p>
                        <p><strong>Payment Date:</strong> ${new Date(paymentData.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for your purchase!</p>
                        <p>If you have any questions, please contact our support team.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `"BookStore" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Invoice for Order #${orderData._id}`,
            html: htmlContent,
            text: `
                Invoice for Order #${orderData._id}
                
                Customer: ${userData.firstName} ${userData.lastName}
                Email: ${userEmail}
                Total Amount: $${orderData.totalAmount.toFixed(2)}
                Payment Status: ${paymentData.status}
                
                Thank you for your purchase!
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Invoice email sent successfully to ${userEmail}`);

    } catch (error) {
        console.error('Error sending invoice email:', error);
        throw error;
    }
};

const sendBookNotificationEmail = async (action, book) => {
    const subject = `Book ${action.toUpperCase()}: ${book.name}`;
    const htmlContent = `
        <h2>Book ${action}</h2>
        <p>The following book has been <strong>${action}</strong>:</p>
        <ul>
            <li><strong>Name:</strong> ${book.name}</li>
            <li><strong>Author:</strong> ${book.author}</li>
            <li><strong>Publisher:</strong> ${book.publisher}</li>
            <li><strong>Language:</strong> ${book.language}</li>
            <li><strong>Price:</strong> $${book.price}</li>
            <li><strong>Quantity:</strong> ${book.quantity}</li>
            <li><strong>Category:</strong> ${book.category}</li>
            <li><strong>ISBN:</strong> ${book.isbn}</li>
            <li><strong>ISBN13:</strong> ${book.isbn13}</li>
            <li><strong>Description:</strong> ${book.description}</li>
        </ul>
    `;

    const mailOptions = {
        from: `"BookStore Notification" <${process.env.EMAIL_USER}>`,
        to: "sahanjayastc0@gmail.com",
        subject,
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};

const sendStockAlertEmail = async (book) => {
    const subject = `Stock Alert: ${book.name}`;
    const htmlContent = `
        <h2>Stock Alert</h2>
        <p>The following book is <strong>${book.quantity === 0 ? 'OUT OF STOCK' : 'LOW IN STOCK'}</strong>:</p>
        <ul>
            <li><strong>Name:</strong> ${book.name}</li>
            <li><strong>Quantity:</strong> ${book.quantity}</li>
            <li><strong>Author:</strong> ${book.author}</li>
            <li><strong>Publisher:</strong> ${book.publisher}</li>
            <li><strong>Category:</strong> ${book.category}</li>
        </ul>
    `;

    const mailOptions = {
        from: `"BookStore Alert" <${process.env.EMAIL_USER}>`,
        to: "sahanjayastc0@gmail.com",
        subject,
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};


module.exports = {
    sendVerificationEmail,
    sendInvoiceEmail,
    sendBookNotificationEmail,
    sendStockAlertEmail
};
