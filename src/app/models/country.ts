import mongoose from 'mongoose'
import bcrypt from "bcrypt-nodejs"
const mongoose_delete = require('mongoose-delete');

export type CountryDocument = mongoose.Document & {
    name: string;
    user: [];
    zone: [];

}

const CountrySchema = new mongoose.Schema({
    name: String,
    isoCode2: String,
    isoCode3: String,
    addressFormat: String,
    postcodeRequired: Number,
    zone: Array,
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

CountrySchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'countDocuments'] })
export const Country = mongoose.model<CountryDocument>("country", CountrySchema);