import { Schema, model } from 'mongoose';

const UserPackageMapSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  package: { type: Schema.Types.ObjectId, ref: 'Package' },
  enrolledAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, default: Date.now },
  isExpired: { type: Boolean, default: false },
});

const UserPackageMap = model('UserPackageMap', UserPackageMapSchema);

export { UserPackageMap };
