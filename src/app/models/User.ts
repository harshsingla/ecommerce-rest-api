import mongoose from 'mongoose'
import bcrypt from "bcrypt-nodejs"
const mongoose_delete = require('mongoose-delete');
import {UserGroup} from './userGroup'
enum Gender {
    Male, Female
}
enum Usertype {
      'superAdmin','admin', 'user'
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
util.inherits(UserGroup, Schema);

export type UserDocument = mongoose.Document & {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    userType: Usertype;
    password: string;
    comparePassword: comparePasswordFunction;
    allowNotification: boolean;
    gender: Gender;
    avatar:string;
    userGroup:string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    mobile: String,
    userType: { type: String, default: 'user', enum: ["admin", "user"] },
    password: { type: String, required: true },
    allowNotification: Boolean,
    avatar:String,
    gender: { type: String, enum: ["Male", "Female"] },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    userGroup:{type:String,ref:"userGroup"},
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
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
userSchema.methods.comparePassword = comparePassword;

userSchema.plugin(mongoose_delete, {overrideMethods : ['count' , 'find' , 'countDocuments']})
export const User = mongoose.model<UserDocument>("User", userSchema);
