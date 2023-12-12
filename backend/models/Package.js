import Joi from 'joi';
import { Schema, model } from 'mongoose';

/* The `PackageSchema` is defining the structure and properties of a package object in a MongoDB
database using Mongoose. */
const PackageSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    duration: { type: Number, required: true },
    stripe_p_id: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

/**
 * The function `validatePackage` validates the data of a package object against a predefined schema
 * using the Joi library in JavaScript.
 * @param packagedata - The `packagedata` parameter is an object that contains the information of a
 * package. It should have the following properties:
 * @returns the result of validating the `packagedata` object against the defined schema using the
 * `Joi` library.
 */
function validatePackage(packagedata) {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    price: Joi.number().required().label('Price'),
    duration: Joi.number().required().label('Duration'),
    status: Joi.boolean().optional().label('Status'),
  });
  return schema.validate(packagedata);
}

const Package = model('Package', PackageSchema);

export { Package, validatePackage };
