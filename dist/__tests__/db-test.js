import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
mongoose.set('strictQuery', true);
var database = process.env.MONGODB_URI_TEST.replace('<USER:PASSWORD>', "".concat(process.env.MONGODB_USER, ":").concat(process.env.MONGODB_PASS));
mongoose
    .connect(database)
    .then(function () {
    console.log('Base de donnée connectée.');
})
    .catch(function (err) {
    console.log('Impossible de se connecter à la base de donnée : ', err);
});
