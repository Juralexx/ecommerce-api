export const promotionsErrors = (err: any) => {
    let errors: Record<string, any> = {}

    if (err.message.includes("type"))
        errors.type = "Veuillez saisir le type de promotion.";

    if (err.message.includes("code"))
        errors.code = "Veuillez saisir le code de promotion.";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("code"))
        errors.code = "Une promotion est déjà rattachée à ce code.";

        if (err.message.includes("value"))
            errors.value = "Veuillez renseigner la réduction à appliquer.";

    if (err.message.includes("start_date"))
        errors.start_date = "Veuillez indiquer la date d'activation du code.";

    if (err.message.includes("end_date"))
        errors.end_date = "Veuillez indiquer une date de fin valide.";

    return errors;
};