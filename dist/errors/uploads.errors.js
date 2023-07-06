export var uploadErrors = function (err) {
    var errors = {};
    if (err.message.includes("invalid file"))
        errors.format = "Format incompatible. Les extensions acceptées sont .jpg, .jpeg, .png.";
    if (err.message.includes("max size"))
        errors.maxSize = "Le fichier dépasse 2Mo. Merci de choisir un fichier d'une taille inférieure.";
    return errors;
};
