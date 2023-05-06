export const navigationErrors = (err: any) => {
    let errors: Record<string, any> = {}

    if (err.message.includes("type"))
        errors.type = "Veuillez selectionner le type de navigation.";

    if (err.message.includes("name"))
        errors.name = "Veuillez saisir un nom valide.";

    if (err.message.includes("link"))
        errors.link = "Veuillez saisir un lien valide.";

    if (err.message.includes("links"))
        errors.links = "Veuillez renseigner les liens du sous-menu.";

    return errors;
};