import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
//Ensures that only values present in models are sent to the database
mongoose.set('strictQuery', true);
//Database connection URI
const database_uri: string = process.env.MONGODB_URI.replace(
    '<USER:PASSWORD>',
    `${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}`
);
//Database connection
mongoose
    .connect(database_uri)
    .then(() => {
        console.log('Base de donnée connectée.')
    })
    .catch(err => {
        console.log('Impossible de se connecter à la base de donnée : ', err)
    });