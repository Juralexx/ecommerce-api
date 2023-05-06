export const productErrors = (err: any) => {
    let errors: Record<string, any> = {}

    if (err.message.includes("ref"))
        errors.ref = "Veuillez saisir la référence du produit.";

    if (err.message.includes("name"))
        errors.name = "Veuillez saisir le nom du produit.";

    if (err.message.includes("content"))
        errors.content = "Veuillez saisir une description.";

    if (err.message.includes("category"))
        errors.category = "Veuillez la catégorie.";

    if (err.message.includes("price"))
        errors.price = "Veuillez saisir le prix.";

    if (err.message.includes("stock"))
        errors.stock = "Veuillez indiquer le nombre de produits en stock.";

    if (err.message.includes("images"))
        errors.images = "Veuillez ajouter des images.";

    return errors;
};