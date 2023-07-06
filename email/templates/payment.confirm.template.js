export const confirmPaymentTemplate = order => {
    return (`
        <div style="margin:0;padding:0;padding:20px 0;word-spacing:normal;background-color:#87CAB2" bgcolor="#87CAB2">
            <div style="background-color:#87CAB2" bgcolor="#87CAB2">
                <div style="background:#ffffff;background-color:#ffffff;margin:20px auto;border-radius:4px;max-width:604px" bgcolor="#ffffff">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;background:#ffffff;background-color:#ffffff;width:100%;border-radius:4px;" bgcolor="#ffffff" width="100%">
                        <tbody>
                            <tr>
                                <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:30px 0;text-align:center" align="center">
                                    <div style="margin:0px auto;max-width:604px">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:100%" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:0 25px;text-align:center" align="center">
                                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="border-collapse:collapse;vertical-align:top;padding:0">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:20px;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:20px;font-weight:600;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                Bonjour ${order.customer.name},
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
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:100%" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:0 25px 0;text-align:center" align="center">
                                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="border-collapse:collapse;vertical-align:top;padding:0">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:16px;font-weight:600;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                Merci d'avoir effectué vos achats chez nous !
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
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:100%" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;direction:ltr;font-size:0px;padding:15px 25px;text-align:center" align="center">
                                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%" align="left" width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:collapse">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="border-collapse:collapse;background-color:#fefefe;border:1px solid #dfdfdf;vertical-align:top;padding-top:10px;padding-bottom:10px" bgcolor="#fefefe">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" style="border-collapse:collapse;font-size:0px;padding:10px 25px;word-break:break-word">
                                                                                            <div style="font-family:Open sans,arial,sans-serif;font-size:14px;line-height:25px;text-align:left;color:#253858" align="left">
                                                                                                Le paiement pour votre commande ayant pour référence <span style="font-weight:700;color:#253858">${order._id}</span> a bien été effectué.
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
        </div>
    `)
}