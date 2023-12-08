import Joi from 'joi';
import { Schema, model } from 'mongoose';

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
