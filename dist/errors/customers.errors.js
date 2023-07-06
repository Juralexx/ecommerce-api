export var customerErrors = function (err) {
    var errors = {};
    if (err.message.includes("name"))
        errors.name = "Veuillez saisir un prénom valide.";
    if (err.message.includes("lastname"))
        errors.lastname = "Veuillez saisir un nom valide.";
    if (err.message.includes("email"))
        errors.email = "Veuillez saisir une adresse email valide.";
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Un compte est déjà rattaché à cet email.";
    if (err.message.includes("password"))
        errors.password = "Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins :\n        ".concat('- Une majuscule', "\n        ").concat('- Une minuscule', "\n        ").concat('- Un chiffre', "\n        ").concat('- Un charactère spécial', "\n        ").concat('- Contenir 8 caractères');
    if (err.message.includes("phone"))
        errors.phone = "Veuillez préciser une numéro de téléphone.";
    return errors;
};
