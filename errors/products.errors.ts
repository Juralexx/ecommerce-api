import { MongooseError } from "mongoose";

export const productErrors = (err: MongooseError) => {
    let errors: Record<string, string> = {};

    if (err.message.includes("ref"))
        errors.ref = "Veuillez saisir la référence du produit.";
    if (err.message.includes("name"))
        errors.name = "Veuillez saisir le nom du produit.";
    if (err.message.includes("content"))
        errors.content = "Veuillez saisir une description.";
    if (err.message.includes("category"))
        errors.category = "Veuillez sélectionner la catégorie.";
    if (err.message.includes("price"))
        errors.price = "Veuillez saisir un prix valide.";
    if (err.message.includes("stock"))
        errors.stock = "Veuillez indiquer le nombre de produits en stock.";
    if (err.message.includes("images"))
        errors.images = "Veuillez ajouter des images.";

    return errors;
};