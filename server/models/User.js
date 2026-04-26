import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
  },
  department: String,
  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student',
  },
  notifEmail: {
    type: Boolean,
    default: true,
  },
  anonData: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;

//   const salt = await bcryptjs.genSalt(10);
//   this.password = await bcryptjs.hash(this.password, salt);
// });

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
