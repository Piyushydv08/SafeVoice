import 'dotenv/config'; // Replaces require('dotenv').config();
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Allow requests from your frontend's origin
const corsOptions = {
  origin: ['http://localhost:5173', 'https://safevoiceforwomen.netlify.app'], // Add your frontend URLs here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));


app.use(bodyParser.json());

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL; // Supabase URL from .env
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Supabase Key from .env
const supabase = createClient(supabaseUrl, supabaseKey);
const verificationCodes = [];

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saishmungase@gmail.com', // Replace with your email
    pass: 'kszo mktf hhwt ypvs', // Replace with your email password or app password
  },
});

// Auth Stuff
app.post("/send-verification", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const code = uuidv4().slice(0, 6).toUpperCase();
  const expiresAt = Date.now() + 2 * 60 * 1000; 

  verificationCodes.push({ email, code, expiresAt });

  try {
    await transporter.sendMail({
    from: `"SafeVoice" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify your SafeVoice email",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #2c3e50;">SafeVoice Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border: 1px solid #ddd; display: inline-block; font-size: 1.2rem; font-weight: bold; letter-spacing: 2px;">
          ${code}
        </div>
      
        <p style="color: #e74c3c; font-weight: bold;">
          ⚠️ This code will expire in <strong>2 minutes</strong>.
        </p>
      
        <p>If you did not request this, please ignore this email.</p>
      
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      
        <p style="font-size: 0.9rem; color: #555;">
          SafeVoice Team<br />
          <a href="https://your-website.com" style="color: #3498db; text-decoration: none;">https://your-website.com</a>
        </p>
      </div>
    `
  });

    res.json({ message: "Verification code sent to your email." });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send verification code" });
  }
});

app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Email and code required" });

  const record = verificationCodes.find(
    (item) => item.email === email && item.code === code
  );

  if (!record) return res.status(400).json({ message: "Invalid code" });
  if (record.expiresAt < Date.now()) return res.status(400).json({ message: "Code expired" });

  const index = verificationCodes.indexOf(record);
  verificationCodes.splice(index, 1);

  res.json({ verified: true, message: "Email verified successfully" });
});


// Endpoint to handle NGO requests
app.post('/api/send-ngo-request', async (req, res) => {
    const { name, description, contact, email, registrationNumber } = req.body;
  
    console.log('Request data:', { name, description, contact, email, registrationNumber });
  
    try {
      const { data, error } = await supabase.from('ngo_requests').insert([
        {
          name,
          description,
          contact,
          email,
          registration_number: registrationNumber,
          approved: false,
        },
      ]);
  
      if (error) {
        console.error('Error inserting NGO request into database:', error);
        return res.status(500).send('Failed to save NGO request to the database');
      }
  
      // Email content
      const mailOptions = {
        from: 'safevoiceforwomen@gmail.com', // Owner's email (authenticated email)
        to: 'safevoiceforwomen@gmail.com', // Owner's email (recipient)
        replyTo: email, // User's email (for replies)
        subject: 'New NGO Request for Approval',
        html: `
          <h1>New NGO Request</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Registration Number:</strong> ${registrationNumber}</p>
          <p>
            <a href="http://localhost:3000/api/approve-ngo?id=${data[0].id}" style="color: green; text-decoration: none;">
              Approve NGO
            </a>
          </p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      res.status(200).send('NGO request submitted and email sent successfully');
    } catch (error) {
      console.error('Error handling NGO request:', error);
      res.status(500).send('Failed to handle NGO request');
    }
  });

// Endpoint to approve NGO
app.get('/api/approve-ngo', async (req, res) => {
  const { id } = req.query;

  try {
    // Update the NGO request in the database to mark it as approved
    const { data, error } = await supabase
      .from('ngo_requests')
      .update({ approved: true })
      .eq('id', id);

    if (error) {
      console.error('Error approving NGO:', error);
      return res.status(500).send('Failed to approve NGO');
    }

    res.send('NGO approved and updated in the database!');
  } catch (error) {
    console.error('Error handling NGO approval:', error);
    res.status(500).send('Failed to handle NGO approval');
  }
});

// Endpoint to fetch approved NGOs
app.get('/api/approved-ngos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ngo_requests')
      .select('*')
      .eq('approved', true);

    if (error) {
      console.error('Error fetching approved NGOs:', error);
      return res.status(500).send('Failed to fetch approved NGOs');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching approved NGOs:', error);
    res.status(500).send('Failed to fetch approved NGOs');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});