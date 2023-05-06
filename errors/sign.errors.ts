/**
 * Signup errors
 */

export const registerErrors = (err: any) => {
    let errors: Record<string, any> = {}

    if (err.message.includes("name"))
        errors.name = "Veuillez saisir un prénom valide.";

    if (err.message.includes("lastname"))
        errors.lastname = "Veuillez saisir un nom valide.";

    if (err.message.includes("email"))
        errors.email = "Veuillez saisir un email valide.";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Un compte est déjà assigné à cet email.";

    if (err.message.includes("password"))
        errors.password = `Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins :
        ${'- Une majuscule'}
        ${'- Une minuscule'}
        ${'- Un chiffre'}
        ${'- Un charactère spécial'}
        ${'- Contenir 8 caractères'}`;

    if (err.message.includes("role"))
        errors.role = "Veuillez assigner un rôle.";

    return errors;
};

/**
 * login errors
 */

export const loginErrors = (err: any) => {
    let errors: Record<string, any> = {}

    if (err.name.includes("email"))
        errors.email = "Cet email n\'est rattachée à aucun compte."

    if (err.name.includes("password"))
        errors.password = "Mot de passe incorrect."

    return errors
}