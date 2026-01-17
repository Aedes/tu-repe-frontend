export const openWhatsappTuRepe = () => {
    const phoneNumber = "5492604204836";

    const message = `
        ¡Hola!
Quiero sumar *Tu Repe* para grabar los partidos y ofrecer un servicio diferencial a mis jugadores.

• Nombre del club:
• Tipo de canchas (pádel, futbol, etc.):
• Cantidad de canchas:
• Ciudad:
    `.trim();

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
};
