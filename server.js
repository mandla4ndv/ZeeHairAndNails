const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend directory (one level up from backend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sinovuyomthiyane@gmail.com",
        pass: "ualn driy pwzv evol"
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'Zee&Nails.html'));
});

// Email sending route
app.post("/send-email", async (req, res) => {
    const { name, phone, email ,date} = req.body;
    
    try {
        // Send confirmation email to customer
        await transporter.sendMail({
            from: '"Zee\'s Hair and Nails" <sinovuyomthiyane@gmail.com>',
            to: email,
            subject: "Appointment Confirmation - Zee's Hair and Nails",
            html: `
              
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">

<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdf7f4;">
    <div style="background-color: #c57b6a; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-family: 'Playfair Display', serif;">Appointment Confirmation</h2>
    </div>

    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333;">Dear <strong>${name}</strong>,</p>

        <p style="font-size: 16px; color: #333;">Thank you for booking an appointment with <strong>Zee's Hair and Nails</strong>!</p>

        <div style="background-color: #fef1ee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d68b7a;">
            <h3 style="color: #c57b6a; margin-top: 0; font-family: 'Playfair Display', serif;">Your Booking Details:</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Appointment Date:</strong> ${date}</p>
        </div>

        
        <p style="font-size: 16px; color: #333;">We look forward to pampering you soon!</p>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #d68b7a;">
            <p style="margin: 5px 0; color: #666;"><strong>Zee's Hair and Nails</strong></p>
            <p style="margin: 5px 0; color: #666;">Contact us: sinovuyomthiyane@gmail.com</p>
        </div>
    </div>
</div>

            `
        });

        // Send notification email to business owner
        await transporter.sendMail({
            from: '"Zee\'s Hair and Nails Booking System" <sinovuyomthiyane@gmail.com>',
            to: "sinovuyomthiyane@gmail.com",
            subject: "New Appointment Booking",
            html: `
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">

<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdf7f4;">
    <h2 style="color: #c57b6a; font-family: 'Playfair Display', serif;">New Appointment Booking</h2>

    <div style="background-color: #ffffff; padding: 20px 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #d68b7a;">
        <p style="margin: 8px 0; color: #333;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Phone:</strong> ${phone}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Email:</strong> ${email}</p>
       <p style="margin: 5px 0; color: #333;"><strong>Appointment Date:</strong> ${date}</p>

    </div>

    <p style="margin-top: 20px; font-size: 15px; color: #555;">
        Please contact the client to confirm appointment details.
    </p>
</div>
            `
        });

        res.status(200).json({ 
            success: true, 
            message: "Booking confirmation sent successfully!" 
        });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to send confirmation email. Please try again." 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Make sure to set EMAIL_PASSWORD environment variable for email functionality`);
});
