import mongoose from 'mongoose'
import bcrypt from "bcrypt-nodejs"
const mongoose_delete = require('mongoose-delete');

export type UserGroupDocument = mongoose.Document & {
    name: string;
    user: [];
}

const userGroupSchema = new mongoose.Schema({
    name: String,
    user: { type: Array, ref: "user" },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userGroupSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'countDocuments'] })
export const UserGroup = mongoose.model<UserGroupDocument>("userGroup", userGroupSchema);