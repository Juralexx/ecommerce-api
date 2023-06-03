import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

//Assure qu'uniquement les valeur présents dans les models soit envoyé à la base de donnée
mongoose.set('strictQuery', true);

//URL de connexion à la base de donnée
const database: string = process.env.MONGODB_URI.replace('<USER:PASSWORD>', `${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}`);

//Connexion à la base de donnée
mongoose
    .connect(database)
    .then(() => {
        console.log('Base de donnée connectée.')
    })
    .catch(err => {
        console.log('Impossible de se connecter à la base de donnée : ', err)
    });