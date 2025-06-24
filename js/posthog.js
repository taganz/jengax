
export function posthogInitUser(jengax_version) {
    // 1. Asegúrate de que PostHog ya esté inicializado
  if (!window.posthog) {
    console.error("PostHog no está cargado.");
    return;
  }

  // 2. Recuperar o generar un user_id único
  let uid = localStorage.getItem('jengax_uid');
  if (!uid) {
    uid = crypto.randomUUID(); // genera UUID v4
    localStorage.setItem('jengax_uid', uid);
  }

  // 3. Identificar al usuario ante PostHog
  posthog.identify(uid);

  // 4. (Opcional) Añadir propiedades del usuario
  posthog.people.set({
    jengax_version: jengax_version,
    idioma: navigator.language,
    first_visit: !localStorage.getItem('jengax_first_visit') ? true : false
  });

  // Guardar que ya vino
  localStorage.setItem('jengax_first_visit', 'false');

  // 5. (Opcional) Registrar que entró
  posthog.capture('jengax_abierto');
}