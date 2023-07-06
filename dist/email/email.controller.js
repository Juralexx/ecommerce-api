import * as nodemailer from 'nodemailer';
import { confirmOrderTemplate } from "./templates/order.confirm.template.js";
import { confirmPaymentTemplate } from './templates/payment.confirm.template.js';
import { preparationOrderTemplate } from './templates/order.preparation.template.js';
import { shippedOrderTemplate } from './templates/order.shipped.template.js';
export function sendOrderConfirmEmail(order) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_ROUTER,
            pass: process.env.EMAIL_ROUTER_PASSWORD,
        },
    });
    var mailData = {
        from: "Le Jardin des Agrumes <".concat(process.env.EMAIL_ROUTER, ">"),
        to: order.customer.email,
        name: process.env.EMAIL_ROUTER,
        subject: '[LJDA] Confirmation de commande',
        text: confirmOrderTemplate(order),
        html: confirmOrderTemplate(order)
    };
    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
}
export function sendPaymentConfirmEmail(order) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
            user: process.env.EMAIL_ROUTER,
            pass: process.env.EMAIL_ROUTER_PASSWORD,
        },
    });
    var mailData = {
        from: "Le Jardin des Agrumes <".concat(process.env.EMAIL_ROUTER, ">"),
        to: order.customer.email,
        name: process.env.EMAIL_ROUTER,
        subject: '[LJDA] Paiement accepté',
        text: confirmPaymentTemplate(order),
        html: confirmPaymentTemplate(order)
    };
    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
}
export function sendOrderInPreparationEmail(order) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
            user: process.env.EMAIL_ROUTER,
            pass: process.env.EMAIL_ROUTER_PASSWORD,
        },
    });
    var mailData = {
        from: "Le Jardin des Agrumes <".concat(process.env.EMAIL_ROUTER, ">"),
        to: order.customer.email,
        name: process.env.EMAIL_ROUTER,
        subject: '[LJDA] En cours de préparation',
        text: preparationOrderTemplate(order),
        html: preparationOrderTemplate(order)
    };
    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
}
export function sendOrderShippedEmail(order) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
            user: process.env.EMAIL_ROUTER,
            pass: process.env.EMAIL_ROUTER_PASSWORD,
        },
    });
    var mailData = {
        from: "Le Jardin des Agrumes <".concat(process.env.EMAIL_ROUTER, ">"),
        to: order.customer.email,
        name: process.env.EMAIL_ROUTER,
        subject: '[LJDA] [IMPORTANT] Votre commande a été expédiée',
        text: shippedOrderTemplate(order),
        html: shippedOrderTemplate(order)
    };
    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
}
