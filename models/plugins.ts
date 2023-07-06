import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

/**
 * Login plugin function
 * @param schema Mongoose user schema
 */

export function login(schema: any) {
    schema.statics.login = async function (email: string, password: string) {
        //Verification that the email is attached to a user
        const user = await this.findOne({ email });
        //Si l'utilisateur existe
        if (user) {
            //Password hash decoding
        const isSamePassword = await bcrypt.compare(password, user.password);
            //Si le mot de passe est le même nous retournons l'utilisateur
            if (isSamePassword) {
                return user;
            }
            //Otherwise we return a password error
            else {
                throw {
                    name: 'password',
                    message: 'Mot de passe incorrect.'
                };
            }
        }
        //Otherwise we return an error 'cause the email does not exist in the database
        else {
            throw {
                name: 'email',
                message: 'Cet email n\'est rattachée à aucun compte.'
            }
        }
    };
}

