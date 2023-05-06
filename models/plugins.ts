import * as argon2 from 'argon2'

export function login(schema: any) {
    schema.statics.login = async function (email: string, password: string) {
        const user = await this.findOne({ email });
        if (user) {
            const isSamePassword = await argon2.verify(user.password, password);
            if (isSamePassword) {
                return user;
            } else {
                throw {
                    name: 'password',
                    message: 'Mot de passe incorrect.'
                };
            }
        } else {
            throw {
                name: 'email',
                message: 'Cet email n\'est rattachée à aucun compte.'
            }
        }
    };
}