const User = require('../model/User')
const bcrypt = require('bcrypt')
const constants = require('../utilities/constant')
const registerUser = async (req, res) => {
    const { name, email, password, companyName, age, dob } = req.body
    const image = req.file
    console.log(req.body)

    const requiredFields = [
        'name',
        'email',
        'password',
        'companyName',
        'age',
        'dob',
    ]
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                message: `${
                    field.charAt(0).toUpperCase() + field.slice(1)
                } is required`,
            })
        }
    }
    if (!image) {
        return res.status(400).json({ message: constants.image_required })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: constants.invaild_format })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: constants.email_exist })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            companyName,
            age,
            dob,
            image: { data: image.buffer, contentType: image.mimetype },
        })
        await newUser.save()

        res.status(200).json({
            message: constants.regiestered,
            status: true,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: constants.server_error })
    }
}
const getUserById = async (req, res) => {
    const { email } = req.body;  

    const requiredFields = ['email'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        });
      }
    }
  
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userWithImage = {
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        age: user.age,
        dob: user.dob,
        image: user.image
          ? {
              data: user.image.data.toString('base64'),  // Convert Buffer to base64 string
              contentType: user.image.contentType,
            }
          : null,
      };
  
      res.status(200).json({ user: userWithImage });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: constants.server_error });
    }
  };
  

const deleteUserById = async (req, res) => {
    const { _id } = req.body
    const requiredFields = ['_id']
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                message: `${
                    field.charAt(0).toUpperCase() + field.slice(1)
                } is required`,
            })
        }
    }
    try {
        const user = await User.findByIdAndDelete(_id)

        if (!user) {
            return res.status(404).json({ message: constants.not_found })
        }

        res.status(200).json({ message: constants.deleted,status:true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: constants.server_error })
    }
}
const otpStore = new Map()

const storeOtp = (email, otp) => {
    otpStore.set(email, { otp, expiration: Date.now() + 600000 }) // OTP expires in 10 minutes
}
const getOtp = (email) => {
    return otpStore.get(email)
}
const loginUser = async (req, res) => {
    const { email, password } = req.body
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                message: `${
                    field.charAt(0).toUpperCase() + field.slice(1)
                } is required`,
            })
        }
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: constants.not_found })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: constants.incorrect_pass })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
        storeOtp(email, otp)
        return res.status(200).json({
            message: constants.otp_sent,
            otp,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: constants.server_error })
    }
}
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body

    const requiredFields = ['email', 'otp']
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                message: `${
                    field.charAt(0).toUpperCase() + field.slice(1)
                } is required`,
            })
        }
    }
    try {
        const otpData = getOtp(email)
        if (!otpData) {
            return res.status(400).json({ message: constants.otp_not_found })
        }

        if (otpData.otp !== otp) {
            otpStore.delete(email)
            return res.status(400).json({ message: constants.incorrect_otp })
        }

        if (otpData.expiration < Date.now()) {
            otpStore.delete(email)
            return res.status(400).json({ message: constants.exp_otp })
        }

        res.status(200).json({ message: constants.verifed_otp, status: true })

        otpStore.delete(email)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: constants.server_error })
    }
}

module.exports = {
    registerUser,
    getUserById,
    deleteUserById,
    loginUser,
    verifyOtp,
}
