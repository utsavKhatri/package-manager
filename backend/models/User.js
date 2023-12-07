import Joi from 'joi';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    token: { type: String },
    isActive: { type: Boolean, default: true },
    package: { type: Schema.Types.ObjectId, ref: 'UserPackageMap' },
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    lastLoginAt: { type: Date, allowNull: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    selfRegistration: { type: Boolean, default: true },
  },
  { timestamps: true }
);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().required().email().label('Email'),
    password: Joi.string().required().label('Password'),
    isAdmin: Joi.boolean().optional().label('Admin Role'),
  });
  return schema.validate(user);
}
function validateUserForAdmin(user) {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().required().email().label('Email'),
    isAdmin: Joi.boolean().optional().label('Admin Role'),
  });
  return schema.validate(user);
}

const User = model('User', UserSchema);

export { validateUser, User, validateUserForAdmin };
