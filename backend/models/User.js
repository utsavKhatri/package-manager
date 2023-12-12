import Joi from 'joi';
import { Schema, model } from 'mongoose';

/* The `UserSchema` is defining the structure and properties of a user document in a MongoDB
collection. It is using the `Schema` class from the Mongoose library to create a new schema object. */
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

/**
 * The function `validateUser` is used to validate a user object against a schema using the Joi library
 * in JavaScript.
 * @param user - The `user` parameter is an object that contains the following properties:
 * @returns The function `validateUser` returns the result of validating the `user` object against the
 * defined schema using the `Joi` library.
 */
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().required().email().label('Email'),
    password: Joi.string().required().label('Password'),
    isAdmin: Joi.boolean().optional().label('Admin Role'),
  });
  return schema.validate(user);
}

/**
 * The function validates a user object for admin role, ensuring that it has a name and email, and
 * optionally an isAdmin property.
 * @param user - An object representing a user, with properties such as name, email, and isAdmin
 * (indicating whether the user has admin privileges).
 * @returns the result of validating the user object against the defined schema using the Joi library.
 */
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
