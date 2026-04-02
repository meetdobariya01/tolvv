const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
// Add this to your nodemailer utility file
const sendAdminSubscriptionNotification = async (userEmail, userName) => {
  return await transporter.sendMail({
    from: `"Tolvv System" <${process.env.MAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "📧 New Newsletter Subscriber",
    html: `
      <h2>New Subscription Request</h2>
      <p><strong>Name:</strong> ${userName}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p>This user checked the subscription box during checkout.</p>
    `
  });
};
const sendOTPEmail = async (email, otp) => {
  return await transporter.sendMail({
    from: `"Tolvv Support" <no-reply@tolvv.com>`,
    replyTo: "no-reply@tolvv.com",
    to: email,
    subject: "OTP Verification – Secure Login",
    html: `
      <div style="font-family: Arial, sans-serif; color:#333;">
        <p>Dear User,</p>
        <p>We received a request to log in to your account.</p>
        <p>Your OTP code is:</p>
        <div style="font-size: 28px; font-weight: bold; color: #000; text-align: center; letter-spacing: 6px; margin: 20px 0;">
          ${otp}
        </div>
        <p><strong>⏳ Valid for 5 minutes</strong></p>
        <p style="font-size: 13px; color: #555;">
          For your security:<br/>• Do not share this OTP with anyone<br/>• Our team will never ask for your OTP
        </p>
        <p>Regards,<br/><strong>Tolvv – Nurture your Nature</strong><br/>Support Team</p>
      </div>
    `,
  });
};

const sendPasswordResetOTP = async (email, otp) => {
  return await transporter.sendMail({
    from: `"Tolvv Support" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h3>Password Reset</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {

  const { customOrderId, paymentMethod, totalAmount, itemsHtml, phone } = orderDetails;

  return await transporter.sendMail({
    from: `"Tolvv Orders" <${process.env.MAIL_USER}>`,
    to: userEmail,
    subject: "✅ Order Confirmed – Tolvv",
    html: `
      <h2>Thank you for your order 🎉</h2>

      <p><strong>Order ID:</strong> ${customOrderId}</p>

      <p><strong>Payment Method:</strong> ${paymentMethod}</p>

      <p><strong>Total:</strong> ₹${totalAmount}</p>

      <p><strong>Phone:</strong> ${phone}</p>

      <h3>Items</h3>

      <ul>
        ${itemsHtml}
      </ul>

      <p>We’ll notify you once your order is shipped.</p>
    `
  });
};

const sendAdminOrderNotification = async (orderDetails, user, address, note) => {

  const { customOrderId, paymentMethod, totalAmount, itemsHtml } = orderDetails;

  return await transporter.sendMail({
    from: `"Tolvv Orders" <${process.env.MAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🚨 New Order Received – Tolvv",
    html: `
      <h2>🛒 New Order Placed</h2>

      <p><strong>Order ID:</strong> ${customOrderId}</p>

      <!-- <p><strong>Customer Name:</strong> ${user.name || "Customer"}</p> -->

      <p><strong>Email:</strong> ${user.email}</p>

      <p><strong>Phone:</strong> ${address.mobile}</p>

      <p><strong>Payment Method:</strong> ${paymentMethod}</p>

      <p><strong>Total:</strong> ₹${totalAmount}</p>

      <h3>Delivery Address</h3>

      <p>
        Customer Name: ${address.buildingName || ""},
        address: ${address.houseNumber || ""}<br/>
        ${address.road || ""}<br/>
        ${address.city} - ${address.pincode}
      </p>

      <h3>Items</h3>

      <ul>
        ${itemsHtml}
      </ul>

      ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
    `
  });
};

const sendContactEmail = async (name, email, phone, subject, message) => {
  try {
    // ✅ Admin email
    const adminMail = transporter.sendMail({
      from: `"Tolvv Connect" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Connect Request: ${subject}`,
      html: `
        <h2>New Connect Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // ✅ User email
    const userMail = transporter.sendMail({
      from: `"Tolvv" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "We received your request – Tolvv",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>

        <hr/>

        <p><strong>Your Message:</strong></p>
        <p>${message}</p>

        <br/>
        <p>— Team Tolvv</p>
      `
    });

    // ✅ Run both together
    await Promise.all([adminMail, userMail]);

    return true;

  } catch (error) {
    console.error("Contact Email Error:", error);
    throw error;
  }
};

const sendcouponcodeEmail = async (userEmail, couponCode) => {
  return await transporter.sendMail({
    from: `"Tolvv" <${process.env.MAIL_USER}>`,
    to: userEmail,
    subject: "🎁 Your Exclusive Coupon Code",
    html: `
      <div style="font-family: Arial; text-align: center;">
        <h2>✨ Welcome to Tolvv ✨</h2>

        <p>Here’s your exclusive coupon code:</p>

        <h1 style="letter-spacing: 3px;">
          ${couponCode}
        </h1>

        <p>Use this code on checkout to get your discount 🎉</p>

        <p>Happy Shopping 💜</p>
      </div>
    `
  });
};

module.exports = {
  transporter,
  sendOTPEmail,
  sendPasswordResetOTP,
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  sendContactEmail,
  sendAdminSubscriptionNotification,
  sendcouponcodeEmail
};


