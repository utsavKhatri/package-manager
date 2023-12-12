import { Schema, model } from 'mongoose';

/* The code is defining a Mongoose schema for a collection called "UserPackageMap". The schema
specifies the structure and data types of the documents that will be stored in the collection. */
const UserPackageMapSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  package: { type: Schema.Types.ObjectId, ref: 'Package' },
  enrolledAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, default: Date.now },
  isExpired: { type: Boolean, default: false },
});

const UserPackageMap = model('UserPackageMap', UserPackageMapSchema);

export { UserPackageMap };
