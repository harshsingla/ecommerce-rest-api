import mongoose from 'mongoose'
import bcrypt from "bcrypt-nodejs"

enum Gender {
    Male, Female
}
enum Usertype {
    'admin', 'user'
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
export type UserDocument = mongoose.Document & {
    name: string;
    email: string;
    mobile: string;
    userType: Usertype;
    password: string;
    comparePassword: comparePasswordFunction;
    allowNotification: boolean;
    gender: Gender;
    cart: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    mobile: String,
    userType: { type: String, default: 'user', enum: ["admin", "user"] },
    password: { type: String, required: true },
    allowNotification: Boolean,
    gender: { type: String, enum: ["Male", "Female"] },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    cart: { type: String, ref: 'cart', default: null }
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
export const User = mongoose.model<UserDocument>("User", userSchema);