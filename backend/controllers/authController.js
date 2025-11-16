import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const OTP_TTL_MS = 5 * 60 * 1000; 

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    console.log(user)
    
    if (!user) {
      // Do not reveal whether the email exists; return generic success to prevent enumeration
      return res.status(200).json({ message: 'If the email is registered, an OTP has been sent.' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + OTP_TTL_MS);
    try {
      await user.save();
    } catch (saveErr) {
      console.error('OTP save failed:', saveErr?.message || saveErr);
      // Still return generic success (client UX), user can retry.
      return res.status(200).json({ message: 'If the email is registered, an OTP has been sent.' });
    }

    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Stranger Things Portal OTP</h2>
        <p>Your login OTP is:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:3px">${otp}</p>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    // Try to send email, but don't fail the whole request if mail transport has a hiccup.
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your OTP for Stranger Things Portal',
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        html
      });
      return res.status(200).json({ message: 'OTP sent to email' });
    } catch (mailErr) {
      console.error('sendEmail failed:', mailErr?.message || mailErr);
      // Still return success since OTP is generated and saved; user can request again if needed.
      return res.status(200).json({ message: 'OTP generated. Email delivery attempt made.' });
    }
  } catch (err) {
    console.error('checkEmail error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP pending verification' });
    }

    if (user.otp !== String(otp)) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(401).json({ message: 'OTP expired. Please request a new one.' });
    }
    
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { email: user.email, year: user.year },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    const redirectPath = `/portal/year${user.year}`;

    return res.status(200).json({
      message: 'Authentication successful',
      token,
      redirectPath,
      user
    });
  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default { checkEmail, verifyOtp };
