export const categoryErrors = (err: any) => {
    let errors: Record<string, any> = {}

    if (err.message.includes("name"))
        errors.name = "Veuillez saisir un nom valide.";

    if (err.message.includes("link"))
        errors.link = "Veuillez saisir une URL valide.";
    
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("link"))
        errors.link = "Une catégorie est déjà rattachée à cette URL.";

    if (err.message.includes("parent"))
        errors.parent = "Veuillez saisir une catégorie parente valide.";

    return errors;
};