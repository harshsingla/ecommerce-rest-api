import { errorObj } from "../config/settings";

let jwt = require('jsonwebtoken');
import { secret } from '../config/settings';

export default (req: any, res: any, next: any) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                return res.json({
                    ...errorObj,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        req.decoded = { userType: 'guest' }
        next();
    }
};