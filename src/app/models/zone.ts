import mongoose from 'mongoose'
import bcrypt from "bcrypt-nodejs"
const mongoose_delete = require('mongoose-delete');

export type ZoneDocument = mongoose.Document & {
    name: string;
    code: string;
    country: string;
}

const ZoneSchema = new mongoose.Schema({
    name: String,
    code: String,
    country: { type: String, ref: "country" },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

ZoneSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'countDocuments'] })
export const Zone = mongoose.model<ZoneDocument>("zone", ZoneSchema);