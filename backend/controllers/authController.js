const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if(!name || !email || !password){
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        message:"User created successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPro: user.isPro,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
// exports.updateUserProfile = async (req, res) => {
//   const bodyKeys = Object.keys(req.body || {});
//   const fileKeys = Object.keys(req.files || {});

//   // Check if the request body is empty AND no files were uploaded
//   if (bodyKeys.length === 0 && fileKeys.length === 0) {
//     // Return 400 Bad Request if the request is empty
//     return res.status(400).json({ message: 'No update data or file provided.' });
//   }
//   const avatarFileArray = req.files && req.files['avatar'];
//   const user = await User.findById(req.user._id);
//   const body = req.body || {};
//   // console.log('Request Body:', req.body);
//   //   console.log('Uploaded Files:', req.files);

//   if (user) {
//     // user.name = req.body.name || user.name;
//   //a very big problem here is if user doesnt send anything then req.body is undefined and undefined,name or password or anything will throw an error so as to safeguard we do
//     user.name = body.name || user.name;
//     user.email = body.email || user.email;
//     if (body.password) {
//       user.password = body.password;
//     }
//     if (avatarFileArray && avatarFileArray.length > 0) {
//             const avatarFile = avatarFileArray[0];
//             user.avatar = `/uploads/${avatarFile.filename.replace(/\\/g, '/')}`; 
//     }
//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       avatar: updatedUser.avatar,
//       token: generateToken(updatedUser._id),
//     });
//   } else {
//     res.status(404).json({ message: 'User not found' });
//   }
// };


// the above commented was the logic when the files were stored on the laptop now the below is when the logic is updated in cloudinary

exports.updateUserProfile = async (req, res) => {
  try {
    const bodyKeys = Object.keys(req.body || {});
    const fileKeys = Object.keys(req.files || {});

    if (bodyKeys.length === 0 && fileKeys.length === 0) {
      return res.status(400).json({ message: 'No update data or file provided.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name, email, password (same as before)
    const body = req.body || {};
    user.name = body.name || user.name;
    user.email = body.email || user.email;
    if (body.password) {
      user.password = body.password;
    }

    //  Now handle avatar (Cloudinary URL from middleware)
    // Your handleUpload middleware attached this as req.uploadedFiles.avatar
    if (req.uploadedFiles && req.uploadedFiles.avatar) {
      user.avatar = req.uploadedFiles.avatar;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
