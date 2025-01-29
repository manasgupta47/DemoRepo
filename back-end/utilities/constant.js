const constants = {
    port: 8080,
    mongoDBURL:
        'mongodb+srv://manasgupta47:q6gO4FKFIHCeroTQ@userdata.rivh8.mongodb.net/?retryWrites=true&w=majority',
    connected: 'MongoDB connected',
    connectionErr: 'MongoDB connection error:',
    image_size: 5 * 1024 * 1024,
    image_types: ['image/png', 'image/jpeg'],
    image_upload_err: 'Only PNG and JPG files are allowed',
    not_found: 'User not found',
    image_required: 'Image is required',
    invaild_format: 'Invalid email format',
    email_exist: 'Email already exists',
    regiestered: 'User registered successfully',
    server_error: 'Internal Server Error',
    deleted: 'User deleted successfully',
    incorrect_pass: 'Password is incorrect',
    otp_sent: 'OTP sent to your email. Please check your Logs.',
    otp_not_found: 'OTP not found or expired',
    incorrect_otp: 'Incorrect OTP',
    exp_otp: 'OTP has expired',
    verifed_otp: 'OTP verified successfully. You are logged in.',
}
module.exports = constants
