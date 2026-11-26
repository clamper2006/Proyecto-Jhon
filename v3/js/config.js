/* ===== config.js — lo único que normalmente necesitas editar ===== */
window.SITE = {
  // Fecha y hora real del taller (ISO con zona de Venezuela). null = "por anunciar".
  // Ejemplo: '2026-12-10T18:00:00-04:00'
  fechaTaller: null,
  // La primera edición es gratuita. Pon true para volver a mostrar precios, pagos y cupos VIP.
  pagosActivos: false,
  // Formulario de Google: oculto por ahora (el registro es el formulario de la página). Pon true para mostrarlo de nuevo.
  googleFormActivo: false,
  googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScn84gURqvDGxuDQjgawbleKznxOlFO-nxruaA_dk5CeyrjCA/viewform',
  // URL de tu función serverless que habla con Gemini (ver README). null = el asistente responde en modo demostración.
  asistenteEndpoint: null
};
