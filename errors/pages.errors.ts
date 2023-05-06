export const pageErrors = (err: any) => {
    let errors: Record<string, any> = {}

    if (err.message.includes("title"))
        errors.title = "Veuillez saisir un titre.";

    if (err.message.includes("link"))
        errors.link = "Veuillez saisir une URL valide.";
    
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("link"))
        errors.link = "Une page est déjà rattachée à cette URL.";

    if (err.message.includes("content"))
        errors.content = "Veuillez saisir le contenu de la page.";

    return errors;
};