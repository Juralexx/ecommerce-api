import { numericDateParser } from "../../utils/utils.js"

export const confirmOrderTemplate = (order) => {
    return (`
        <div style="margin:0;padding:0;padding:20px 0;word-spacing:normal;background-color:#87CAB2" bgcolor="#87CAB2">
            <div style="background-color:#87CAB2" bgcolor="#87CAB2">
                <div style="background:#ffffff;background-color:#ffffff;margin:20px auto;border-radius:4px;max-width:604px" bgcolor="#ffffff">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;background:#ffffff;background-color:#ffffff;width:100%;border-radius:4px" bgcolor="#ffffff" width="100%">
                        <tbody>
                            <tr>
                                <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:0 0 30px;text-align:center" align="center">
                                    <div style="margin:0px auto;max-width:604px">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;width:100%" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:25px 25px 0px;text-align:center" align="center">
                                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="border-collapse:collapse;vertical-align:top;padding:0">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 0;padding-top:0;padding-bottom:20px;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:20px;font-weight:600;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                Bonjour ${order.customer.name},
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 0;padding-top:0px;padding-bottom:25px;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:16px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                Merci d'avoir effectué vos achats sur chez nous !
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style="margin:0px auto;max-width:604px">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;width:100%" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:0 25px 0;text-align:center" align="center">
                                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="border-collapse:collapse;vertical-align:top;padding:0">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:0px;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:16px;font-weight:800;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                <span style="font-weight:800;color:#659785">
                                                                                                    Détails de la commande
                                                                                                </span>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style="margin:0px auto;max-width:604px">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;width:100%" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:15px 25px 40px;text-align:center" align="center">
                                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="border-collapse:collapse;background-color:#fefefe;border:1px solid #dfdfdf;vertical-align:top;padding-top:10px;padding-bottom:10px" bgcolor="#fefefe">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 25px;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:16px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                <span style="font-weight:700;color:#253858">
                                                                                                    Commande :
                                                                                                </span>
                                                                                                ${order._id} passée le
                                                                                                ${numericDateParser(order.date)} ${new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:16px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                <span style="font-weight:700;color:#253858">
                                                                                                    Paiement :
                                                                                                </span>
                                                                                                ${order.payment_method}
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style="margin:0px auto;max-width:604px">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;width:100%" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:15px 25px 40px;text-align:center" align="center">
                                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="border-collapse:collapse;vertical-align:top;padding:0">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:0;word-break:break-word">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%" border="0" style="border-collapse:collapse;color:#000000;font-family:Open sans,arial,sans-serif;font-size:14px;line-height:22px;table-layout:auto;width:100%;border:none">
                                                                                                <tbody>
                                                                                                    ${order.products.map(product => {
                                                                                                        return (`
                                                                                                            <tr>
                                                                                                                <td>
                                                                                                                    <p>
                                                                                                                        <strong>${product.name} - Pot : ${product.variant.size}L - Hauteur : ${product.variant.height}cm</strong>
                                                                                                                    </p>
                                                                                                                    <p>
                                                                                                                        <span>Quantité: <strong>${product.quantity}</strong></span>
                                                                                                                        <span style="float:right">Prix: ${product.price.toFixed(2)}€</span>
                                                                                                                    </p>
                                                                                                                    <p>
                                                                                                                        <span style="float:right">Total: <strong>${(product.price * product.quantity).toFixed(2)}€</strong></span>
                                                                                                                    </p>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <td colspan="2">
                                                                                                                    <p style="border-top:solid 1px #659785;font-size:1px;margin:10px auto;width:100%"></p>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        `)
                                                                                                    }).join('')}
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            <p>
                                                                                                                <strong>Frais de livraison</strong>
                                                                                                                <span style="float:right">${order.shipping_fees.toFixed(2)}€</span>
                                                                                                            </p>
                                                                                                            <p>
                                                                                                                <strong>Total</strong>
                                                                                                                <span style="float:right">${order.total.toFixed(2)}€</span>
                                                                                                            </p>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style="margin:0px auto;max-width:604px">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;width:100%" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:0 25px 0;text-align:left" align="left">
                                                    <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="border-collapse:collapse;vertical-align:top;padding:0">
                                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" style="border-collapse:collapse;font-size:0px;padding:0;word-break:break-word">
                                                                                        <div style="font-family:Open sans,arial,sans-serif;font-size:16px;font-weight:800;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                            <span style="font-weight:800;color:#659785">Livraison</span>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style="margin:0px auto;max-width:604px">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;width:100%" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:15px 25px 40px;text-align:center" align="center">
                                                    <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="border-collapse:collapse;background-color:#fefefe;border:1px solid #dfdfdf;vertical-align:top;padding-top:10px;padding-bottom:10px" bgcolor="#fefefe">
                                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 25px;word-break:break-word">
                                                                                        <div style="font-family:Open sans,arial,sans-serif;font-size:16px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                            <span style="font-weight:700;color:#253858">
                                                                                                Transporteur :
                                                                                            </span>
                                                                                            ${order.carrier.name}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word">
                                                                                        <div style="font-family:Open sans,arial,sans-serif;font-size:16px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                            <span style="font-weight:700;color:#253858">
                                                                                                Paiement :
                                                                                            </span>
                                                                                            Paiement par ${order.payment_method}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style="margin:0px auto;max-width:604px">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;width:100%" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:0 25px 0;text-align:center" align="center">
                                                    <div class="m_-7942284763231543012mj-column-per-50" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;vertical-align:top" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" style="border-collapse:collapse;font-size:0px;word-break:break-word">
                                                                        <div style="font-family:Open sans,arial,sans-serif;font-size:14px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                            <p style="display:block;margin:13px 0;font-weight:800;color:#659785">
                                                                                Adresse de livraison
                                                                            </p>
                                                                            <p style="display:block;margin:13px 0;border:1px solid #dfdfdf;background-color:#fefefe;padding:20px;font-size:14px" bgcolor="#FEFEFE">
                                                                                <span style="font-weight:bold">
                                                                                    ${order.customer.name}
                                                                                </span>
                                                                                <br />
                                                                                ${order.delivery_address.street}
                                                                                <br />
                                                                                ${order.delivery_address.postcode} ${order.delivery_address.city}
                                                                                <br />
                                                                                France
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div class="m_-7942284763231543012mj-column-per-50" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-family:Open sans,Arial,sans-serif;font-size:14px;vertical-align:top" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" style="border-collapse:collapse;font-size:0px;word-break:break-word">
                                                                        <div style="font-family:Open sans,arial,sans-serif;font-size:14px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                            <p style="display:block;margin:13px 0;font-weight:800;color:#659785">
                                                                                Adresse de facturation
                                                                            </p>
                                                                            <p style="display:block;margin:13px 0;border:1px solid #dfdfdf;background-color:#fefefe;padding:20px;font-size:14px" bgcolor="#FEFEFE">
                                                                                <span style="font-weight:bold">
                                                                                    ${order.customer.name}
                                                                                </span>
                                                                                <br />
                                                                                ${order.billing_address.street}
                                                                                <br />
                                                                                ${order.billing_address.postcode} ${order.billing_address.city}
                                                                                <br />
                                                                                France
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style="margin:0px auto;max-width:604px">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:100%" width="100%">
                        <tbody>
                            <tr>
                                <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:20px 0;text-align:center" align="center">
                                    <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;vertical-align:top" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td align="center" style="border-collapse:collapse;font-size:0px;padding:10px 25px;word-break:break-word">
                                                        <div style="font-family:Open sans,arial,sans-serif;font-size:14px;line-height:25px;text-align:center;color:#253858" align="center">
                                                            <p style="display:block;color:#000;font-size:12px;margin:5px 0">
                                                                <a href="https://www.lejardindesagrumes.com" style="text-decoration:none;font-weight:800;color:#659785;font-size:18px" target="_blank">
                                                                lejardindesagrumes.com
                                                                </a>
                                                                <br />
                                                                © 2022 - MPM SARL - RCS B 494 383 359
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div >
    `)
}