const OTP_EXPIRY_TIME = 5 * 60 * 1000;

class OTPStorage {
  constructor() {
    this.tempOtp = {};
    this.tempEmailOtp = {};
  }

  storeOTP(email, otp) {
    this.tempOtp[email] = {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_TIME,
    };
  }

  verifyOTP(email, otp) {
    const record = this.tempOtp[email];
    if (!record) return { success: false, message: "OTP not found. Please resend." };
    if (record.expiresAt < Date.now()) return { success: false, message: "OTP has expired." };
    if (record.otp !== otp) return { success: false, message: "Invalid OTP." };
    
    this.tempOtp[email].verified = true;
    return { success: true, message: "OTP verified successfully." };
  }

  storeResetOTP(email, otp) {
    this.tempEmailOtp[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      verified: false,
    };
  }

  verifyResetOTP(email, otp) {
    const record = this.tempEmailOtp[email];
    if (!record) return { success: false, message: "OTP not found or expired" };
    if (Date.now() > record.expiresAt) {
      delete this.tempEmailOtp[email];
      return { success: false, message: "OTP expired" };
    }
    if (record.otp !== otp) return { success: false, message: "Invalid OTP" };
    
    record.verified = true;
    return { success: true, message: "OTP verified successfully" };
  }

  clearResetOTP(email) {
    delete this.tempEmailOtp[email];
  }
}

module.exports = new OTPStorage();