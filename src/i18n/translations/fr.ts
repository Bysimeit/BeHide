export const fr = {
  common: {
    cancel: "Annuler",
    close: "Fermer",
    back: "Retour",
    show: "Afficher",
    delete: "Supprimer",
    erase: "Effacer",
    unlock: "Déverrouiller",
    continue: "Continuer",
  },
  language: {
    title: "Langue",
    subtitle: "Choisissez la langue de l'application.",
    system: "Automatique",
    systemHint: "Suivre la langue de l'appareil",
    open: "Changer de langue",
    current: "Langue : {name}",
  },
  validation: {
    pseudoTooShort: "Le pseudo doit faire au moins {pseudoMin} caractères.",
    pseudoTooLong: "Le pseudo doit faire au plus {pseudoMax} caractères.",
    passphraseTooShort:
      "La passphrase doit faire au moins {passphraseMin} caractères.",
    passphraseMismatch: "Les deux passphrases ne correspondent pas.",
    privateKeyRequired: "Collez votre clé privée.",
    privateKeyHex: "La clé ne doit contenir que des caractères hexadécimaux.",
    privateKeyLength:
      "La clé doit faire {keyLength} caractères ({keyGiven} saisis).",
  },
  tabs: {
    conversations: "Conversations",
    calls: "Appels",
    contacts: "Contacts",
    profile: "Profil",
  },
  login: {
    loadingTitle: "Déverrouillage…",
    loadingMessage: "Déchiffrement de votre coffre sur cet appareil.",
    welcomeBack: "Bon retour, {pseudo}",
    welcome: "Bienvenue sur BeHide",
    subtitleIdentity:
      "Votre identité ne quitte jamais cet appareil. Déverrouillez-la localement.",
    subtitleNew:
      "Messagerie et appels audio et vidéo chiffrés de bout en bout, sans compte ni serveur.",
    biometricAction: "Déverrouiller par biométrie",
    biometricFailed:
      "Données biométriques non reconnues (essai {attempt} sur {max}).",
    biometricExhausted:
      "Données biométriques non reconnues. Saisissez votre passphrase pour continuer.",
    orPassphrase: "ou la passphrase",
    passphrase: "Passphrase",
    passphrasePlaceholder: "Votre passphrase",
    unlock: "Déverrouiller",
    wrongPassphrase: "Passphrase incorrecte.",
    vaultError: "Impossible d'ouvrir le coffre sur cet appareil.",
    otherIdentity: "Utiliser une autre identité ?",
    recoverWithKey: "Récupérer avec une clé privée",
    featureE2e: "Chiffré de bout en bout",
    featureAnonymous: "Messagerie anonyme, sans numéro ni e-mail",
    featureCalls: "Appels audio et vidéo sécurisés",
    createIdentity: "Créer une identité",
  },
  register: {
    loadingTitle: "Création de votre identité…",
    loadingMessage:
      "Génération et chiffrement de votre clé sur cet appareil. Cela peut prendre quelques secondes.",
    title: "Créer une identité",
    subtitle:
      "Aucun e-mail, aucun numéro, aucun nom. Une identité BeHide n'est qu'une paire de clés vivant sur cet appareil.",
    pseudo: "Pseudo",
    pseudoHint:
      "Visible par vos contacts. Il n'est ni unique ni vérifié : c'est l'empreinte de clé qui identifie réellement.",
    pseudoPlaceholder: "ex. corbeau-neuf",
    passphrase: "Passphrase",
    passphraseHint:
      "{passphraseMin} caractères minimum. Elle chiffre votre clé privée sur l'appareil et ne peut pas être réinitialisée.",
    confirm: "Confirmer la passphrase",
    notice:
      "Personne ne peut réinitialiser cette passphrase à votre place : il n'existe aucun serveur qui détienne votre compte. Si vous l'oubliez, seule la clé privée, récupérable sur votre profil, permettra de restaurer votre identité.",
    submit: "Créer mon identité",
    failed: "Impossible de créer l'identité sur cet appareil.",
    haveIdentity: "Vous avez déjà une identité ici ?",
    unlock: "Déverrouiller",
  },
  recovery: {
    title: "Mettez votre clé en sécurité",
    subtitle:
      "Cette clé privée est votre seule sauvegarde : elle seule restaure votre identité si vous perdez ce téléphone ou oubliez votre passphrase.",
    label: "Votre clé privée",
    hint: "Appui long pour la copier. Rangez-la hors ligne, ou dans un gestionnaire de mots de passe. Vous pourrez la retrouver depuis votre profil, tant que vous pouvez ouvrir l'application.",
    unavailable:
      "Clé indisponible : rouvrez la session depuis votre profil pour l'afficher.",
    fingerprint: "Empreinte de votre clé",
    notice:
      "Quiconque obtient cette clé peut se faire passer pour vous. Ne la photographiez pas et ne la stockez pas dans un service en ligne.",
    acknowledge: "J'ai mis ma clé en sécurité",
  },
  restore: {
    loadingTitle: "Restauration…",
    loadingMessage:
      "Reconstruction de votre identité et chiffrement sur cet appareil.",
    title: "Récupérer un compte",
    subtitle:
      "Saisissez votre clé privée : elle restaure votre identité sur cet appareil, sans serveur.",
    pseudo: "Pseudo",
    pseudoHint: "La clé ne contient pas votre pseudo : rechoisissez-en un.",
    pseudoPlaceholder: "ex. corbeau-neuf",
    privateKey: "Clé privée",
    privateKeyHint:
      "Les {keyLength} caractères hexadécimaux affichés depuis « Récupérer la clé privée ».",
    privateKeyPlaceholder: "Collez votre clé privée",
    passphrase: "Nouvelle passphrase",
    passphraseHint:
      "{passphraseMin} caractères minimum. Elle chiffre la clé restaurée sur cet appareil.",
    confirm: "Confirmer la passphrase",
    notice:
      "La restauration se fait entièrement sur l'appareil. Votre clé n'est envoyée nulle part ; elle est aussitôt chiffrée sous votre nouvelle passphrase.",
    submit: "Restaurer mon identité",
    failed: "Impossible de restaurer avec cette clé.",
    rememberPassphrase: "Vous vous souvenez de votre passphrase ?",
    unlock: "Déverrouiller",
  },
  home: {
    greetingDay: "Bonjour {name}",
    greetingEvening: "Bonsoir {name}",
    conversations: "Conversations",
    empty: "Aucune conversation pour le moment.",
    conversationWith: "Conversation avec {name}",
    blockedByThem: "Vous a bloqué le {date}",
    blockedByMe: "Vous avez bloqué ce contact",
    noMessage: "Aucun message",
    seen: "Vu",
  },
  calls: {
    title: "Appels",
    empty: "Aucun appel récent. Touchez le bouton pour en passer un.",
    newCall: "Passer un nouvel appel",
    recall: "Rappeler {name}",
    recallVideo: "Rappeler {name} en vidéo",
    unavailableTitle: "Appels indisponibles",
    unavailableMessage:
      "Les appels audio/vidéo nécessitent un development build (ils ne fonctionnent pas dans Expo Go).",
  },
  contacts: {
    title: "Contacts",
    search: "Rechercher un contact",
    showQr: "Afficher ma clé publique en QR code",
    add: "Ajouter un contact",
    blockedByThem: "Vous a bloqué",
    blockedByMe: "Contact bloqué",
    open: "Voir la fiche de {name}",
    emptySearch: "Aucun contact ne correspond à « {query} ».",
    empty: "Aucun contact. Touchez + pour en ajouter un.",
  },
  contactDetail: {
    fallbackTitle: "Contact",
    title: "Fiche contact",
    missing: "Ce contact n'existe plus.",
    blockedBanner: "Ce contact vous a bloqué le {date}.",
    messagesSent: "Messages envoyés",
    messagesReceived: "Messages reçus",
    call: "Appel",
    callsPlural: "Appels",
    callTime: "Temps d'appel",
    sendMessage: "Envoyer un message",
    block: "Bloquer ce contact",
    unblock: "Débloquer ce contact",
    delete: "Supprimer ce contact",
    blockedHint:
      "Vous avez bloqué ce contact. Il ne peut plus vous joindre tant que vous ne le débloquez pas.",
    deleteTitle: "Supprimer ce contact ?",
    deleteMessage:
      "{name}, vos messages et votre historique d'appels seront effacés de cet appareil. Cette action est irréversible.",
  },
  contactNew: {
    title: "Nouveau contact",
    notice:
      "Le nom n'est qu'une étiquette locale, visible de vous seul. C'est la clé publique, transmise directement par votre contact, qui l'identifie réellement. Comparez son empreinte de vive voix.",
    firstName: "Nom affiché",
    firstNamePlaceholder: "ex. Livia",
    lastName: "Nom de famille (optionnel)",
    lastNamePlaceholder: "ex. Levin",
    key: "Clé du contact",
    keyHint: "Copiée depuis son profil, ou scannée ci-dessous.",
    scan: "Scanner le QR code du contact",
    submit: "Ajouter le contact",
    nameRequired: "Donnez un nom à ce contact.",
    keyRequired: "Collez ou scannez la clé du contact.",
    keyInvalid: "Cette clé de contact est invalide ou incomplète.",
    keyDuplicate: "Ce contact figure déjà dans votre liste.",
  },
  chat: {
    notFound: "Conversation introuvable.",
    backToConversations: "Retour aux conversations",
    secure: "Sécurisé",
    connected: "Connecté",
    connecting: "Connexion…",
    disconnected: "Hors ligne",
    blockedByMe: "Vous avez bloqué ce contact. Débloquez-le pour lui écrire.",
    blockedByThem:
      "Ce contact vous a bloqué. Vos messages ne lui parviendront pas.",
    empty:
      "Démarrez la conversation, rien ne sera stocké ailleurs que sur vos appareils.",
    readMark: "a vu jusqu'ici",
    composerPlaceholder: "Écrivez votre message...",
    composerLabel: "Champ de message",
    send: "Envoyer le message",
  },
  call: {
    ended: "Appel terminé",
    video: "Appel vidéo",
    ongoing: "Appel en cours",
    incoming: "Appel entrant",
    ringing: "Sonnerie…",
    remoteCameraOff: "Caméra désactivée",
    muted: "Micro coupé",
    mic: "Micro",
    camera: "Caméra",
    unmute: "Réactiver le micro",
    mute: "Couper le micro",
    cameraOff: "Couper la caméra",
    cameraOn: "Réactiver la caméra",
    decline: "Refuser l'appel",
    accept: "Accepter l'appel",
    hangup: "Raccrocher",
    newTitle: "Nouvel appel",
    search: "Rechercher un contact",
    searchLabel: "Rechercher un contact à appeler",
    startCall: "Appeler {name}",
    startVideoCall: "Appel vidéo avec {name}",
    emptySearch: "Aucun contact ne correspond à « {query} ».",
    empty: "Aucun contact à appeler. Ajoutez-en un depuis l'onglet Contacts.",
  },
  profile: {
    publicKeyTitle: "Votre clé publique",
    publicKeyBody:
      "C'est votre identité publique : partagez-la pour qu'un contact puisse vous ajouter, elle ne révèle rien de privé. L'empreinte ci-dessous en est un résumé court, à comparer de vive voix pour être sûr que personne ne s'intercale dans la conversation.",
    fingerprint: "Empreinte",
    shareQr: "Partager ma clé (QR code)",
    shareQrLabel: "Partager ma clé publique en QR code",
    biometric: "Déverrouillage par données biométriques",
    biometricHint:
      "Ouvrez BeHide sans saisir la passphrase. Elle reste demandée après plusieurs échecs.",
    biometricUnavailable:
      "Configurez une empreinte ou un visage dans les réglages de l'appareil pour l'activer.",
    biometricCancelledTitle: "Activation annulée",
    biometricCancelledMessage:
      "Les données biométriques n'ont pas été confirmées. Le déverrouillage rapide reste désactivé.",
    backups: "Sauvegardes locales",
    backupsHint:
      "Exportez vos données dans un fichier chiffré avec votre clé privée. Rien n'est sauvegardé automatiquement.",
    export: "Exporter",
    exportLabel: "Exporter une sauvegarde",
    import: "Importer",
    importLabel: "Importer une sauvegarde",
    backupNote:
      "Le fichier se relit sur tout téléphone où vous restaurez cette identité : c'est votre clé privée qui l'ouvre, pas cet appareil.",
    exportedTitle: "Sauvegarde exportée",
    exportedMessage:
      "Le fichier est chiffré avec votre clé privée : lui seul ne suffit pas à lire vos données. Rangez-le où vous voulez.",
    importedTitle: "Sauvegarde importée",
    importedNothing:
      "Rien à ajouter : vous aviez déjà tout ce que contenait ce fichier.",
    importedMessage: "{count} élément(s) restauré(s).",
    exportFailedTitle: "Export impossible",
    importFailedTitle: "Import impossible",
    backupLocked: "Session verrouillée. Déverrouillez BeHide et réessayez.",
    backupUnavailable:
      "Les sauvegardes s'appuient sur des modules natifs absents de cette version de l'application : reconstruisez-la pour les activer (elles ne fonctionnent pas dans Expo Go).",
    backupWrongIdentity:
      "Cette sauvegarde appartient à une autre identité : elle est chiffrée avec une autre clé privée et restera illisible ici.",
    backupWrongVersion:
      "Cette sauvegarde vient d'une version plus récente de BeHide. Mettez l'application à jour.",
    backupUnreadable:
      "Fichier illisible : ce n'est pas une sauvegarde BeHide, ou il est endommagé.",
    backupErrorTitle: "Opération impossible",
    backupErrorMessage: "Une erreur inattendue est survenue. Réessayez.",
    importConfirmTitle: "Importer une sauvegarde ?",
    importConfirmMessage:
      "Les données du fichier seront ajoutées aux vôtres. Rien n'est écrasé : ce qui est déjà sur cet appareil est conservé.",
    importConfirmAction: "Choisir un fichier",
    readReceipts: "Accusés de lecture",
    readReceiptsHint:
      "Indiquer à vos contacts que vous avez lu leurs messages. Désactivé, vous ne verrez pas non plus s'ils ont lu les vôtres.",
    lockSession: "Verrouiller la session",
    dangerZone: "Zone de danger",
    recoverKey: "Récupérer la clé privée",
    recoverKeyHint:
      "Affiche votre clé privée en clair. À faire à l'abri des regards, ne la partagez jamais.",
    recoverKeyTitle: "Afficher votre clé privée ?",
    recoverKeyMessage:
      "Cette clé donne un contrôle total sur votre identité : quiconque la voit peut vous usurper et lire vos échanges. Ne l'affichez qu'à l'abri des regards et ne la partagez jamais.",
    forget: "Effacer mon identité",
    forgetHint:
      "Supprime définitivement l'identité et les conversations de cet appareil. Irréversible sans votre clé.",
    forgetTitle: "Effacer cette identité ?",
    forgetMessage:
      "Aucun serveur ne la détient : sans votre clé privée, elle sera définitivement perdue, ainsi que vos conversations."
  },
  privateKey: {
    title: "Clé privée",
    banner:
      "Cette clé donne un contrôle total sur votre identité : quiconque la voit peut vous usurper et lire vos échanges. Ne la montrez à personne et ne la collez dans aucun service en ligne.",
    label: "Votre clé privée",
    hint: "Appui long pour la copier. Conservez-la hors ligne : c'est le seul moyen de restaurer ce compte.",
    locked: "Session verrouillée : rouvrez-la pour afficher la clé.",
    done: "J'ai mis ma clé en sécurité",
  },
  qr: {
    title: "Votre clé publique",
    subtitle: "À faire scanner par votre contact, ou à lui copier tel quel.",
    scannerTitle: "Scanner un QR code",
    scannerClose: "Fermer le scanner",
    scannerHint: "Visez le QR code affiché sur le profil de votre contact.",
    scannerInvalid: "Ce QR code n'est pas une identité BeHide.",
    cameraBlocked:
      "L'accès à la caméra est bloqué. Autorisez-le dans les réglages pour scanner un QR code.",
    cameraNeeded:
      "BeHide a besoin de la caméra pour scanner le QR code du contact.",
    openSettings: "Ouvrir les réglages",
    allowCamera: "Autoriser la caméra",
  },
  notFound: {
    title: "Cette page n'existe pas.",
    link: "Retour aux conversations",
  },
  notifications: {
    newMessage: "vous a envoyé un message",
    incomingCall: "vous appelle",
    incomingVideoCall: "Appel vidéo entrant",
  },
  biometrics: {
    unlockPrompt: "Déverrouiller BeHide",
    enablePrompt: "Confirmez pour activer le déverrouillage par empreinte",
    usePassphrase: "Utiliser la passphrase",
  },
  datetime: {
    todayAt: "Aujourd'hui à {time}",
    yesterdayAt: "Hier à {time}",
    dateAt: "{date} à {time}",
    seconds: "{count} s",
    minutes: "{count} min",
    minutesSeconds: "{minutes} min {seconds} s",
  },
};

export type Catalog = typeof fr;
