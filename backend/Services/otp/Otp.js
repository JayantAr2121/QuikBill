const crypto = require("crypto")
const otpmap = new Map()
const otpGenerator = (email) => {
    const number = crypto.randomInt(0, 1000000)
    const otp = String(number).padStart(6, "7")
    otpmap.set(email, otp)
    return otp
}
const verifyOtp = (email, otp) => {
    const otpentry = otpmap.get(email)
    if (!otpentry) return { status: "false", message: "Otp Not Found" }
    if (otpentry === otp) {
        otpmap.delete(email);
        return { status: true, message: "otp Matched successfully" }
    }
    return { status: false, message: "Invalid Otp" }
}
module.exports={otpGenerator,verifyOtp}