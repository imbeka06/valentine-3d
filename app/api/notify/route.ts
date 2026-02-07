// @ts-nocheck
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  console.log("🚀 API HIT: Attempting to send email...");

  try {
    const body = await request.json();
    const { answer } = body;

    // --- EMERGENCY CONFIGURATION ---
    const myEmail = 'imbeka06@gmail.com'; 
    
    // ⚠️ REPLACE THE TEXT BELOW WITH YOUR 16-CHAR APP PASSWORD ⚠️
    // Keep the quotes! No spaces inside the quotes!
    const myPassword = 'guboqoomdqrcrlzs'; 
    // -------------------------------

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myEmail,
        pass: myPassword, 
      },
    });

    await transporter.sendMail({
      from: myEmail,
      to: myEmail, 
      subject: `💘 SHE SAID ${answer}!`,
      html: `
        <div style="background-color: #ffebf5; padding: 40px; text-align: center; font-family: sans-serif;">
          <h1 style="color: #ff006e; font-size: 30px;">She Chose: ${answer} 🥂</h1>
          <p style="font-size: 18px; color: #333;">Celebration time! The website worked.</p>
          <p style="color: #666;">Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ SUCCESS: Email sent!");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ FAILED:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}