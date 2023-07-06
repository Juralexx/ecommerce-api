export var userRegisterErrors = function (err) {
    var errors = {};
    if (err.message.includes("name"))
        errors.name = "Veuillez saisir un prénom valide.";
    if (err.message.includes("lastname"))
        errors.lastname = "Veuillez saisir un nom valide.";
    if (err.message.includes("email"))
        errors.email = "Veuillez saisir un email valide.";
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Un compte est déjà rattaché à cet email.";
    if (err.message.includes("password"))
        errors.password = "Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins :\n        ".concat('- Une majuscule', "\n        ").concat('- Une minuscule', "\n        ").concat('- Un chiffre', "\n        ").concat('- Un charactère spécial', "\n        ").concat('- Contenir 8 caractères');
    if (err.message.includes("role"))
        errors.role = "Veuillez assigner un rôle.";
    return errors;
};
export var customerRegisterErrors = function (err) {
    var errors = {};
    if (err.message.includes("email"))
        errors.email = "Veuillez saisir un email valide.";
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Un compte est déjà rattaché à cet email.";
    if (err.message.includes("password"))
        errors.password = "Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins :\n        ".concat('- Une majuscule', "\n        ").concat('- Une minuscule', "\n        ").concat('- Un chiffre', "\n        ").concat('- Un charactère spécial', "\n        ").concat('- Contenir 8 caractères');
    return errors;
};
export var loginErrors = function (err) {
    var errors = {};
    if (err.name.includes("email"))
        errors.email = "Cet email n\'est rattachée à aucun compte.";
    if (err.name.includes("password"))
        errors.password = "Mot de passe incorrect.";
    return errors;
};
