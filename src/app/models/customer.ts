import mongoose from 'mongoose'
import bcrypt from "bcrypt-nodejs"
const mongoose_delete = require('mongoose-delete');
import { UserGroup } from './userGroup'
enum Gender {
    Male, Female
}

type comparePasswordFunction = (candidatePassword: string) => Promise<any>;
const comparePassword: comparePasswordFunction = function (candidatePassword) {

    return new Promise((resolve => {
        bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
            resolve({
                err, isMatch
            });
        });
    }));

};
export type CustomerDocument = mongoose.Document & {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password: string;
    userType: string;
    comparePassword: comparePasswordFunction;
    allowNotification: boolean;
    gender: Gender;
    avatar: string;
    countryId: string;
    zoneId: string;
    oauthData: string;
    customerGroupId: string;
    lastLogin: string;
    safe: number;
    ip: number;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}

const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    mobile: String,
    userType: { type: String, default: 'user', enum: ["admin", "user"] },
    password: { type: String, required: true },
    allowNotification: Boolean,
    avatar: String,
    gender: { type: String, enum: ["Male", "Female"] },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    countryId: { type: String, ref: "country" },
    zoneId: { type: String, ref: "zone" },
    oauthData: String,
    lastLogin: String,
    safe: Number,
    ip: String,
    customerGroupId: { type: String, ref: "userGroup" },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

customerSchema.pre("save", function save(next) {
    const user = this as CustomerDocument;
    if (!user.isModified("password")) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
customerSchema.methods.comparePassword = comparePassword;

customerSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'countDocuments'] })
export const Customer = mongoose.model<CustomerDocument>("customer", customerSchema);
