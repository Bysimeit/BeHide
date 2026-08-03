import type { Catalog } from "./fr";

export const es: Catalog = {
  common: {
    cancel: "Cancelar",
    close: "Cerrar",
    back: "Volver",
    show: "Mostrar",
    delete: "Eliminar",
    erase: "Borrar",
    unlock: "Desbloquear",
    continue: "Continuar",
  },
  language: {
    title: "Idioma",
    subtitle: "Elija el idioma de la aplicación.",
    system: "Automático",
    systemHint: "Seguir el idioma del dispositivo",
    open: "Cambiar de idioma",
    current: "Idioma: {name}",
  },
  validation: {
    pseudoTooShort: "El seudónimo debe tener al menos {pseudoMin} caracteres.",
    pseudoTooLong: "El seudónimo debe tener como máximo {pseudoMax} caracteres.",
    passphraseTooShort:
      "La frase de contraseña debe tener al menos {passphraseMin} caracteres.",
    passphraseMismatch: "Las dos frases de contraseña no coinciden.",
    privateKeyRequired: "Pegue su clave privada.",
    privateKeyHex: "La clave solo debe contener caracteres hexadecimales.",
    privateKeyLength:
      "La clave debe tener {keyLength} caracteres ({keyGiven} introducidos).",
  },
  tabs: {
    conversations: "Conversaciones",
    calls: "Llamadas",
    contacts: "Contactos",
    profile: "Perfil",
  },
  login: {
    loadingTitle: "Desbloqueando…",
    loadingMessage: "Descifrando su caja fuerte en este dispositivo.",
    welcomeBack: "Bienvenido de nuevo, {pseudo}",
    welcome: "Bienvenido a BeHide",
    subtitleIdentity:
      "Su identidad nunca sale de este dispositivo. Desbloquéela localmente.",
    subtitleNew:
      "Mensajería y llamadas de audio y vídeo cifradas de extremo a extremo, sin cuenta ni servidor.",
    biometricAction: "Desbloquear con biometría",
    biometricFailed: "Biometría no reconocida (intento {attempt} de {max}).",
    biometricExhausted:
      "Biometría no reconocida. Introduzca su frase de contraseña para continuar.",
    orPassphrase: "o la frase de contraseña",
    passphrase: "Frase de contraseña",
    passphrasePlaceholder: "Su frase de contraseña",
    unlock: "Desbloquear",
    wrongPassphrase: "Frase de contraseña incorrecta.",
    vaultError: "No se puede abrir la caja fuerte en este dispositivo.",
    otherIdentity: "¿Usar otra identidad?",
    recoverWithKey: "Recuperar con una clave privada",
    featureE2e: "Cifrado de extremo a extremo",
    featureAnonymous: "Mensajería anónima, sin número ni correo electrónico",
    featureCalls: "Llamadas de audio y vídeo seguras",
    createIdentity: "Crear una identidad",
  },
  register: {
    loadingTitle: "Creando su identidad…",
    loadingMessage:
      "Generando y cifrando su clave en este dispositivo. Puede tardar unos segundos.",
    title: "Crear una identidad",
    subtitle:
      "Sin correo electrónico, sin número, sin nombre. Una identidad BeHide no es más que un par de claves que vive en este dispositivo.",
    pseudo: "Seudónimo",
    pseudoHint:
      "Visible para sus contactos. No es único ni verificado: es la huella de la clave la que le identifica realmente.",
    pseudoPlaceholder: "p. ej. cuervo-nuevo",
    passphrase: "Frase de contraseña",
    passphraseHint:
      "Mínimo {passphraseMin} caracteres. Cifra su clave privada en el dispositivo y no se puede restablecer.",
    confirm: "Confirmar la frase de contraseña",
    notice:
      "Nadie puede restablecer esta frase de contraseña por usted: no existe ningún servidor que guarde su cuenta. Si la olvida, solo la clave privada, disponible en su perfil, permitirá restaurar su identidad.",
    submit: "Crear mi identidad",
    failed: "No se puede crear la identidad en este dispositivo.",
    haveIdentity: "¿Ya tiene una identidad aquí?",
    unlock: "Desbloquear",
  },
  recovery: {
    title: "Ponga su clave a buen recaudo",
    subtitle:
      "Esta clave privada es su única copia de seguridad: solo ella restaura su identidad si pierde este teléfono u olvida su frase de contraseña.",
    label: "Su clave privada",
    hint: "Mantenga pulsado para copiarla. Guárdela sin conexión o en un gestor de contraseñas. Podrá encontrarla desde su perfil mientras pueda abrir la aplicación.",
    unavailable:
      "Clave no disponible: vuelva a abrir la sesión desde su perfil para mostrarla.",
    fingerprint: "Huella de su clave",
    notice:
      "Cualquiera que obtenga esta clave puede hacerse pasar por usted. No la fotografíe ni la guarde en un servicio en línea.",
    acknowledge: "He guardado mi clave a buen recaudo",
  },
  restore: {
    loadingTitle: "Restaurando…",
    loadingMessage:
      "Reconstruyendo su identidad y cifrándola en este dispositivo.",
    title: "Recuperar una cuenta",
    subtitle:
      "Introduzca su clave privada: restaura su identidad en este dispositivo, sin servidor.",
    pseudo: "Seudónimo",
    pseudoHint: "La clave no contiene su seudónimo: elija uno nuevo.",
    pseudoPlaceholder: "p. ej. cuervo-nuevo",
    privateKey: "Clave privada",
    privateKeyHint:
      "Los {keyLength} caracteres hexadecimales mostrados desde «Recuperar la clave privada».",
    privateKeyPlaceholder: "Pegue su clave privada",
    passphrase: "Nueva frase de contraseña",
    passphraseHint:
      "Mínimo {passphraseMin} caracteres. Cifra la clave restaurada en este dispositivo.",
    confirm: "Confirmar la frase de contraseña",
    notice:
      "La restauración se realiza íntegramente en el dispositivo. Su clave no se envía a ninguna parte; se cifra de inmediato con su nueva frase de contraseña.",
    submit: "Restaurar mi identidad",
    failed: "No se puede restaurar con esta clave.",
    rememberPassphrase: "¿Recuerda su frase de contraseña?",
    unlock: "Desbloquear",
  },
  home: {
    greetingDay: "Hola {name}",
    greetingEvening: "Buenas noches {name}",
    conversations: "Conversaciones",
    empty: "Todavía no hay conversaciones.",
    conversationWith: "Conversación con {name}",
    blockedByThem: "Le bloqueó el {date}",
    blockedByMe: "Ha bloqueado a este contacto",
    noMessage: "Ningún mensaje",
    seen: "Visto",
  },
  calls: {
    title: "Llamadas",
    empty: "No hay llamadas recientes. Toque el botón para hacer una.",
    newCall: "Hacer una nueva llamada",
    recall: "Devolver la llamada a {name}",
    recallVideo: "Devolver la llamada a {name} por vídeo",
    unavailableTitle: "Llamadas no disponibles",
    unavailableMessage:
      "Las llamadas de audio y vídeo requieren una development build (no funcionan en Expo Go).",
  },
  contacts: {
    title: "Contactos",
    search: "Buscar un contacto",
    showQr: "Mostrar mi clave pública como código QR",
    add: "Añadir un contacto",
    blockedByThem: "Le bloqueó",
    blockedByMe: "Contacto bloqueado",
    open: "Ver la ficha de {name}",
    emptySearch: "Ningún contacto coincide con «{query}».",
    empty: "Sin contactos. Toque + para añadir uno.",
  },
  contactDetail: {
    fallbackTitle: "Contacto",
    title: "Ficha de contacto",
    missing: "Este contacto ya no existe.",
    blockedBanner: "Este contacto le bloqueó el {date}.",
    messagesSent: "Mensajes enviados",
    messagesReceived: "Mensajes recibidos",
    call: "Llamada",
    callsPlural: "Llamadas",
    callTime: "Tiempo de llamada",
    sendMessage: "Enviar un mensaje",
    block: "Bloquear este contacto",
    unblock: "Desbloquear este contacto",
    delete: "Eliminar este contacto",
    blockedHint:
      "Ha bloqueado a este contacto. No podrá contactarle mientras no lo desbloquee.",
    deleteTitle: "¿Eliminar este contacto?",
    deleteMessage:
      "{name}, sus mensajes y su historial de llamadas se borrarán de este dispositivo. Esta acción es irreversible.",
  },
  contactNew: {
    title: "Nuevo contacto",
    notice:
      "El nombre es solo una etiqueta local, visible únicamente para usted. Es la clave pública, transmitida directamente por su contacto, la que lo identifica realmente. Compare su huella de viva voz.",
    firstName: "Nombre mostrado",
    firstNamePlaceholder: "p. ej. Livia",
    lastName: "Apellido (opcional)",
    lastNamePlaceholder: "p. ej. Levin",
    key: "Clave del contacto",
    keyHint: "Copiada de su perfil o escaneada a continuación.",
    scan: "Escanear el código QR del contacto",
    submit: "Añadir el contacto",
    nameRequired: "Dé un nombre a este contacto.",
    keyRequired: "Pegue o escanee la clave del contacto.",
    keyInvalid: "Esta clave de contacto no es válida o está incompleta.",
    keyDuplicate: "Este contacto ya está en su lista.",
  },
  chat: {
    notFound: "Conversación no encontrada.",
    backToConversations: "Volver a las conversaciones",
    secure: "Seguro",
    connected: "Conectado",
    connecting: "Conectando…",
    disconnected: "Sin conexión",
    blockedByMe:
      "Ha bloqueado a este contacto. Desbloquéelo para poder escribirle.",
    blockedByThem:
      "Este contacto le ha bloqueado. Sus mensajes no le llegarán.",
    empty:
      "Inicie la conversación, no se almacenará nada fuera de sus dispositivos.",
    readMark: "ha leído hasta aquí",
    composerPlaceholder: "Escriba su mensaje...",
    composerLabel: "Campo de mensaje",
    send: "Enviar el mensaje",
    openLink: "Abrir el enlace {url}",
    attach: "Adjuntar una foto o un vídeo",
    attachTitle: "Enviar un archivo multimedia",
    attachLibrary: "Elegir de la galería",
    attachCamera: "Hacer una foto o un vídeo",
    mediaImage: "Foto",
    mediaVideo: "Vídeo",
    mediaOpen: "Abrir: {kind}",
    mediaSending: "Enviando… {percent} %",
    mediaReceiving: "Recibiendo… {percent} %",
    mediaFailed: "Transferencia interrumpida",
    mediaRetry: "Reintentar",
    mediaUnavailable: "Archivo no disponible en este dispositivo.",
    mediaPlayerUnavailable:
      "El reproductor de vídeo depende de un módulo nativo ausente de esta versión de la aplicación: reconstrúyela para activarlo.",
    mediaTooLargeTitle: "Archivo demasiado grande",
    mediaTooLargeMessage:
      "Este archivo pesa {size} MB. El límite es de {limit} MB: cada archivo pasa entero por el relé, cifrado.",
    mediaDeniedTitle: "Cámara denegada",
    mediaDeniedMessage:
      "BeHide necesita la cámara para hacer una foto o un vídeo. Autorízala en los ajustes del dispositivo.",
    mediaUnreadableTitle: "Archivo ilegible",
    mediaUnreadableMessage:
      "No se ha podido leer este archivo en este dispositivo. Inténtelo con otro.",
    mediaUnsupportedTitle: "Envío de archivos no disponible",
    mediaUnsupportedMessage:
      "El selector de archivos depende de módulos nativos ausentes de esta versión de la aplicación: reconstrúyela para activarlos (no funciona en Expo Go).",
  },
  call: {
    ended: "Llamada finalizada",
    video: "Videollamada",
    ongoing: "Llamada en curso",
    incoming: "Llamada entrante",
    ringing: "Llamando…",
    remoteCameraOff: "Cámara desactivada",
    muted: "Micrófono silenciado",
    mic: "Micro",
    camera: "Cámara",
    unmute: "Reactivar el micrófono",
    mute: "Silenciar el micrófono",
    cameraOff: "Apagar la cámara",
    cameraOn: "Encender la cámara",
    decline: "Rechazar la llamada",
    accept: "Aceptar la llamada",
    hangup: "Colgar",
    newTitle: "Nueva llamada",
    search: "Buscar un contacto",
    searchLabel: "Buscar un contacto para llamar",
    startCall: "Llamar a {name}",
    startVideoCall: "Videollamada con {name}",
    emptySearch: "Ningún contacto coincide con «{query}».",
    empty:
      "No hay contactos a los que llamar. Añada uno desde la pestaña Contactos.",
  },
  profile: {
    publicKeyTitle: "Su clave pública",
    publicKeyBody:
      "Esta es su identidad pública: compártala para que un contacto pueda añadirle, no revela nada privado. La huella de abajo es un resumen corto de ella, que conviene comparar de viva voz para asegurarse de que nadie se interpone en la conversación.",
    fingerprint: "Huella",
    shareQr: "Compartir mi clave (código QR)",
    shareQrLabel: "Compartir mi clave pública como código QR",
    biometric: "Desbloqueo con datos biométricos",
    biometricHint:
      "Abra BeHide sin escribir la frase de contraseña. Se sigue pidiendo tras varios fallos.",
    biometricUnavailable:
      "Configure una huella o un rostro en los ajustes del dispositivo para activarlo.",
    biometricCancelledTitle: "Activación cancelada",
    biometricCancelledMessage:
      "Los datos biométricos no se han confirmado. El desbloqueo rápido sigue desactivado.",
    backups: "Copias de seguridad locales",
    backupsHint:
      "Exporte sus datos a un archivo cifrado con su clave privada. No se guarda nada automáticamente.",
    export: "Exportar",
    exportLabel: "Exportar una copia de seguridad",
    import: "Importar",
    importLabel: "Importar una copia de seguridad",
    backupNote:
      "El archivo se puede leer en cualquier teléfono donde restaure esta identidad: lo abre su clave privada, no este dispositivo.",
    exportedTitle: "Copia de seguridad exportada",
    exportedMessage:
      "El archivo está cifrado con su clave privada: por sí solo no basta para leer sus datos. Guárdelo donde quiera.",
    importedTitle: "Copia de seguridad importada",
    importedNothing: "Nada que añadir: ya tenía todo lo que contenía el archivo.",
    importedMessage: "{count} elemento(s) restaurado(s).",
    exportFailedTitle: "Exportación imposible",
    importFailedTitle: "Importación imposible",
    backupLocked: "Sesión bloqueada. Desbloquee BeHide e inténtelo de nuevo.",
    backupUnavailable:
      "Las copias de seguridad dependen de módulos nativos ausentes en esta versión de la aplicación: reconstrúyala para activarlas (no funcionan en Expo Go).",
    backupWrongIdentity:
      "Esta copia de seguridad pertenece a otra identidad: está cifrada con otra clave privada y seguirá siendo ilegible aquí.",
    backupWrongVersion:
      "Esta copia de seguridad viene de una versión más reciente de BeHide. Actualice la aplicación.",
    backupUnreadable:
      "Archivo ilegible: no es una copia de seguridad de BeHide o está dañado.",
    backupErrorTitle: "Operación imposible",
    backupErrorMessage: "Se ha producido un error inesperado. Inténtelo de nuevo.",
    importConfirmTitle: "¿Importar una copia de seguridad?",
    importConfirmMessage:
      "Los datos del archivo se añadirán a los suyos. No se sobrescribe nada: lo que ya está en este dispositivo se conserva.",
    importConfirmAction: "Elegir un archivo",
    readReceipts: "Confirmaciones de lectura",
    readReceiptsHint:
      "Indique a sus contactos que ha leído sus mensajes. Si lo desactiva, tampoco verá si ellos han leído los suyos.",
    lockSession: "Bloquear la sesión",
    dangerZone: "Zona de peligro",
    recoverKey: "Recuperar la clave privada",
    recoverKeyHint:
      "Muestra su clave privada en claro. Hágalo lejos de miradas ajenas y no la comparta nunca.",
    recoverKeyTitle: "¿Mostrar su clave privada?",
    recoverKeyMessage:
      "Esta clave da control total sobre su identidad: quien la vea puede suplantarle y leer sus intercambios. Muéstrela solo lejos de miradas ajenas y no la comparta nunca.",
    forget: "Borrar mi identidad",
    forgetHint:
      "Elimina definitivamente la identidad y las conversaciones de este dispositivo. Irreversible sin su clave.",
    forgetTitle: "¿Borrar esta identidad?",
    forgetMessage:
      "Ningún servidor la conserva: sin su clave privada, se perderá definitivamente, junto con sus conversaciones."
  },
  privateKey: {
    title: "Clave privada",
    banner:
      "Esta clave da control total sobre su identidad: quien la vea puede suplantarle y leer sus intercambios. No se la muestre a nadie ni la pegue en ningún servicio en línea.",
    label: "Su clave privada",
    hint: "Mantenga pulsado para copiarla. Consérvela sin conexión: es la única forma de restaurar esta cuenta.",
    locked: "Sesión bloqueada: vuelva a abrirla para mostrar la clave.",
    done: "He guardado mi clave a buen recaudo",
  },
  qr: {
    title: "Su clave pública",
    subtitle: "Para que su contacto la escanee, o para copiársela tal cual.",
    scannerTitle: "Escanear un código QR",
    scannerClose: "Cerrar el escáner",
    scannerHint: "Apunte al código QR mostrado en el perfil de su contacto.",
    scannerInvalid: "Este código QR no es una identidad BeHide.",
    cameraBlocked:
      "El acceso a la cámara está bloqueado. Permítalo en los ajustes para escanear un código QR.",
    cameraNeeded:
      "BeHide necesita la cámara para escanear el código QR del contacto.",
    openSettings: "Abrir los ajustes",
    allowCamera: "Permitir la cámara",
  },
  notFound: {
    title: "Esta página no existe.",
    link: "Volver a las conversaciones",
  },
  notifications: {
    newMessage: "le ha enviado un mensaje",
    newPhoto: "le ha enviado una foto",
    newVideo: "le ha enviado un vídeo",
    incomingCall: "le está llamando",
    incomingVideoCall: "Videollamada entrante",
  },
  biometrics: {
    unlockPrompt: "Desbloquear BeHide",
    enablePrompt: "Confirme para activar el desbloqueo biométrico",
    usePassphrase: "Usar la frase de contraseña",
  },
  datetime: {
    todayAt: "Hoy a las {time}",
    yesterdayAt: "Ayer a las {time}",
    dateAt: "{date} a las {time}",
    seconds: "{count} s",
    minutes: "{count} min",
    minutesSeconds: "{minutes} min {seconds} s",
  },
};
