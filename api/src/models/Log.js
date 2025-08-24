import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    action: { type: String, enum: ['created', 'updated', 'deleted'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    details: { type: String }
  },
  { timestamps: { createdAt: 'timestamp', updatedAt: false } }
);

logSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Log', logSchema);