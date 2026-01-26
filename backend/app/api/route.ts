import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export async function POST(request: Request) {
  const body = await request.json();
  const { answer } = body;

  // 1. Setup Email Transporter (Using Gmail as an example)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your gmail address
      pass: process.env.EMAIL_PASS, // Your gmail APP PASSWORD (not login password)
    },
  });

  // 2. Setup Twilio Client
  const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  try {
    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'imbeka06@gmail.com',
      subject: `💘 SHE PICKED: ${answer}`,
      html: `<h1>Status Update</h1><p>She chose <b>${answer}</b> at ${new Date().toLocaleString()}</p>`,
    });

    // Send SMS
    if (answer === 'YES') {
        await twilioClient.messages.create({
        body: `URGENT UPDATE: She said YES! 💖 Time to celebrate.`,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
        to: '+254757059907', // Your number
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}