export var carrierErrors = function (err) {
    var errors = {};
    if (err.message.includes("name"))
        errors.name = "Veuillez saisir un nom valide.";
    if (err.message.includes("ref"))
        errors.ref = "Veuillez saisir la référence du transporteur.";
    if (err.message.includes("description"))
        errors.description = "Veuillez saisir les informatiosn relatives au transporteur.";
    if (err.message.includes("price"))
        errors.price = "Veuillez saisir le prix de la livraison.";
    return errors;
};
