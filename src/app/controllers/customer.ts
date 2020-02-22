import jwt from "jsonwebtoken";
import { Customer, CustomerDocument } from "../models/customer";
import { errorObj, successObj, secret, ErrorObj, SuccessObj } from "../../config/settings";
import _ from "lodash";
import console from "../../utils/logger";

let CustomerCtrl = {
    add: (data: any) => {
        return new Promise(async (resolve) => {
            const entity: any = new Customer();
            _.each(data, (value: any, key: keyof CustomerDocument) => {
                entity[key] = value;
            });
            entity.save(async (err: object, doc: CustomerDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Error Saving Customer Details" });
                }
                return resolve({ ...successObj, message: "Customer added successfully", data: doc });
            });

        });
    },
    update: (id: string, data: CustomerDocument) => {
        return new Promise(async (resolve) => {
            Customer.updateOne({ _id: id }, async (err: object, doc: CustomerDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Customer not found" });
                }
                _.each(data, (value: any, key: keyof CustomerDocument) => {
                    (doc[key] as any) = value;
                });
                doc.save(async (error: object, updatedDoc: CustomerDocument) => {
                    if (err || !updatedDoc) {
                        return resolve({ ...errorObj, message: "Customer not found" });
                    }
                    return resolve({ ...successObj, message: "Customer updated successfully", data: doc });
                });
            })
        });
    },
    getById: (data: any) => {
        return new Promise(async (resolve) => {
            Customer.findOne({ ...data }, async (err: object, doc: CustomerDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Customer not found" });
                }
                return resolve({ ...successObj, message: "Customer fetched successfully", data: doc });
            })
        });
    },
    list: (data: any) => {
        return new Promise(async (resolve) => {
            Customer.find({ ...data }, async (err: object, docs: CustomerDocument[]) => {
                if (err) {
                    return resolve({ ...errorObj, message: "Error in fetching Customers" });
                }
                return resolve({ ...successObj, message: "Customers fetched successfully", data: docs });
            })
        });
    },
    delete: (ids: string[])=> {
        return new Promise((resolve) => {
            //@ts-ignore
            Customer.delete({ _id: { $in: ids } })
                .exec((err: any, data: any) => {
                    if (err || !data) {
                        return resolve({ ...errorObj, message: "unable to delete", err });
                    }
                    if (data.nModified == 0) {
                        return resolve({ ...errorObj, message: "Customer not found", err, data });
                    }
                    return resolve({ ...successObj, message: "Customer deleted", data });

                });
        });
    },

    restore: (ids: string[]): Promise<object> => {
        return new Promise((resolve) => {
            //@ts-ignore
            Customer.restore({ _id: { $in: ids._ids } }, function (err, result) {
                if (err) {
                    return resolve({ ...errorObj, message: "cannot restore", err })
                }
                if (result.nModified == 0) {
                    return resolve({ ...errorObj, message: "Customer not found", err, data: result });
                } return resolve({ ...successObj, message: "restore successfully", data: result })
            });
        })
    },
    loginWithPassword: (data: any) => (new Promise((resolve) => {
        const { email, password } = data;
        const error = "wrong email or password";
        let query = Customer.findOne({ email })
        query.exec(function (err, Customer) {
            if (!Customer) return resolve({ ...errorObj, message: error });

            Customer.comparePassword(password).then(({ err, isMatch }) => {

                if (!isMatch) {
                    // return false;
                    return resolve({ ...errorObj, message: "Invalid password" });
                }

                const JWTToken = jwt.sign({
                    _id: Customer._id,
                    email: Customer.email,
                    CustomerType: Customer.userType,
                    name: Customer.firstName+Customer.lastName,
                    mobile: Customer.mobile

                },
                    secret,
                    {
                        expiresIn: "365d",
                    });

                return resolve({
                    ...successObj,
                    token: JWTToken,
                    Customer: {
                        _id: Customer._id,
                        email: Customer.email,
                        CustomerType: Customer.userType,
                        name: Customer.firstName+Customer.lastName,
                        mobile: Customer.mobile
                    },
                });

            });

        });
    }))
}
export default CustomerCtrl;
