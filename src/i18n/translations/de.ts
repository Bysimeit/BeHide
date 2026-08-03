import type { Catalog } from "./fr";

export const de: Catalog = {
  common: {
    cancel: "Abbrechen",
    close: "Schließen",
    back: "Zurück",
    show: "Anzeigen",
    delete: "Löschen",
    erase: "Löschen",
    unlock: "Entsperren",
    continue: "Weiter",
  },
  language: {
    title: "Sprache",
    subtitle: "Wählen Sie die Sprache der App.",
    system: "Automatisch",
    systemHint: "Der Gerätesprache folgen",
    open: "Sprache ändern",
    current: "Sprache: {name}",
  },
  validation: {
    pseudoTooShort: "Das Pseudonym muss mindestens {pseudoMin} Zeichen haben.",
    pseudoTooLong: "Das Pseudonym darf höchstens {pseudoMax} Zeichen haben.",
    passphraseTooShort:
      "Die Passphrase muss mindestens {passphraseMin} Zeichen haben.",
    passphraseMismatch: "Die beiden Passphrasen stimmen nicht überein.",
    privateKeyRequired: "Fügen Sie Ihren privaten Schlüssel ein.",
    privateKeyHex: "Der Schlüssel darf nur hexadezimale Zeichen enthalten.",
    privateKeyLength:
      "Der Schlüssel muss {keyLength} Zeichen haben ({keyGiven} eingegeben).",
  },
  tabs: {
    conversations: "Unterhaltungen",
    calls: "Anrufe",
    contacts: "Kontakte",
    profile: "Profil",
  },
  login: {
    loadingTitle: "Entsperren…",
    loadingMessage: "Ihr Tresor wird auf diesem Gerät entschlüsselt.",
    welcomeBack: "Willkommen zurück, {pseudo}",
    welcome: "Willkommen bei BeHide",
    subtitleIdentity:
      "Ihre Identität verlässt dieses Gerät nie. Entsperren Sie sie lokal.",
    subtitleNew:
      "Ende-zu-Ende-verschlüsselte Nachrichten sowie Audio- und Videoanrufe, ohne Konto und ohne Server.",
    biometricAction: "Mit Biometrie entsperren",
    biometricFailed: "Biometrie nicht erkannt (Versuch {attempt} von {max}).",
    biometricExhausted:
      "Biometrie nicht erkannt. Geben Sie Ihre Passphrase ein, um fortzufahren.",
    orPassphrase: "oder die Passphrase",
    passphrase: "Passphrase",
    passphrasePlaceholder: "Ihre Passphrase",
    unlock: "Entsperren",
    wrongPassphrase: "Falsche Passphrase.",
    vaultError: "Der Tresor kann auf diesem Gerät nicht geöffnet werden.",
    otherIdentity: "Eine andere Identität verwenden?",
    recoverWithKey: "Mit einem privaten Schlüssel wiederherstellen",
    featureE2e: "Ende-zu-Ende-verschlüsselt",
    featureAnonymous: "Anonyme Nachrichten, ohne Nummer und ohne E-Mail",
    featureCalls: "Sichere Audio- und Videoanrufe",
    createIdentity: "Identität erstellen",
  },
  register: {
    loadingTitle: "Ihre Identität wird erstellt…",
    loadingMessage:
      "Ihr Schlüssel wird auf diesem Gerät erzeugt und verschlüsselt. Das kann einige Sekunden dauern.",
    title: "Identität erstellen",
    subtitle:
      "Keine E-Mail, keine Nummer, kein Name. Eine BeHide-Identität ist nur ein Schlüsselpaar, das auf diesem Gerät lebt.",
    pseudo: "Pseudonym",
    pseudoHint:
      "Für Ihre Kontakte sichtbar. Es ist weder eindeutig noch überprüft: Der Schlüssel-Fingerabdruck identifiziert Sie wirklich.",
    pseudoPlaceholder: "z. B. neuer-rabe",
    passphrase: "Passphrase",
    passphraseHint:
      "Mindestens {passphraseMin} Zeichen. Sie verschlüsselt Ihren privaten Schlüssel auf dem Gerät und kann nicht zurückgesetzt werden.",
    confirm: "Passphrase bestätigen",
    notice:
      "Niemand kann diese Passphrase für Sie zurücksetzen: Es gibt keinen Server, der Ihr Konto führt. Wenn Sie sie vergessen, kann nur der private Schlüssel, abrufbar in Ihrem Profil, Ihre Identität wiederherstellen.",
    submit: "Meine Identität erstellen",
    failed: "Die Identität kann auf diesem Gerät nicht erstellt werden.",
    haveIdentity: "Sie haben hier bereits eine Identität?",
    unlock: "Entsperren",
  },
  recovery: {
    title: "Bringen Sie Ihren Schlüssel in Sicherheit",
    subtitle:
      "Dieser private Schlüssel ist Ihre einzige Sicherung: Nur er stellt Ihre Identität wieder her, wenn Sie dieses Telefon verlieren oder Ihre Passphrase vergessen.",
    label: "Ihr privater Schlüssel",
    hint: "Lange drücken, um ihn zu kopieren. Bewahren Sie ihn offline oder in einem Passwortmanager auf. Sie finden ihn in Ihrem Profil wieder, solange Sie die App öffnen können.",
    unavailable:
      "Schlüssel nicht verfügbar: Öffnen Sie die Sitzung über Ihr Profil erneut, um ihn anzuzeigen.",
    fingerprint: "Fingerabdruck Ihres Schlüssels",
    notice:
      "Wer diesen Schlüssel erhält, kann sich als Sie ausgeben. Fotografieren Sie ihn nicht und speichern Sie ihn in keinem Onlinedienst.",
    acknowledge: "Mein Schlüssel ist sicher verwahrt",
  },
  restore: {
    loadingTitle: "Wiederherstellung…",
    loadingMessage:
      "Ihre Identität wird neu aufgebaut und auf diesem Gerät verschlüsselt.",
    title: "Konto wiederherstellen",
    subtitle:
      "Geben Sie Ihren privaten Schlüssel ein: Er stellt Ihre Identität auf diesem Gerät wieder her, ohne Server.",
    pseudo: "Pseudonym",
    pseudoHint:
      "Der Schlüssel enthält Ihr Pseudonym nicht: Wählen Sie ein neues.",
    pseudoPlaceholder: "z. B. neuer-rabe",
    privateKey: "Privater Schlüssel",
    privateKeyHint:
      "Die {keyLength} hexadezimalen Zeichen, die unter „Privaten Schlüssel abrufen“ angezeigt werden.",
    privateKeyPlaceholder: "Fügen Sie Ihren privaten Schlüssel ein",
    passphrase: "Neue Passphrase",
    passphraseHint:
      "Mindestens {passphraseMin} Zeichen. Sie verschlüsselt den wiederhergestellten Schlüssel auf diesem Gerät.",
    confirm: "Passphrase bestätigen",
    notice:
      "Die Wiederherstellung erfolgt vollständig auf dem Gerät. Ihr Schlüssel wird nirgendwohin gesendet; er wird sofort mit Ihrer neuen Passphrase verschlüsselt.",
    submit: "Meine Identität wiederherstellen",
    failed: "Wiederherstellung mit diesem Schlüssel nicht möglich.",
    rememberPassphrase: "Erinnern Sie sich an Ihre Passphrase?",
    unlock: "Entsperren",
  },
  home: {
    greetingDay: "Hallo {name}",
    greetingEvening: "Guten Abend {name}",
    conversations: "Unterhaltungen",
    empty: "Noch keine Unterhaltungen.",
    conversationWith: "Unterhaltung mit {name}",
    blockedByThem: "Hat Sie am {date} blockiert",
    blockedByMe: "Sie haben diesen Kontakt blockiert",
    noMessage: "Keine Nachrichten",
    seen: "Gesehen",
  },
  calls: {
    title: "Anrufe",
    empty: "Keine neuen Anrufe. Tippen Sie auf die Schaltfläche, um zu telefonieren.",
    newCall: "Neuen Anruf starten",
    recall: "{name} zurückrufen",
    recallVideo: "{name} per Video zurückrufen",
    unavailableTitle: "Anrufe nicht verfügbar",
    unavailableMessage:
      "Audio- und Videoanrufe erfordern einen Development Build (sie funktionieren nicht in Expo Go).",
  },
  contacts: {
    title: "Kontakte",
    search: "Kontakt suchen",
    showQr: "Meinen öffentlichen Schlüssel als QR-Code anzeigen",
    add: "Kontakt hinzufügen",
    blockedByThem: "Hat Sie blockiert",
    blockedByMe: "Kontakt blockiert",
    open: "Karte von {name} ansehen",
    emptySearch: "Kein Kontakt passt zu „{query}“.",
    empty: "Keine Kontakte. Tippen Sie auf +, um einen hinzuzufügen.",
  },
  contactDetail: {
    fallbackTitle: "Kontakt",
    title: "Kontaktkarte",
    missing: "Diesen Kontakt gibt es nicht mehr.",
    blockedBanner: "Dieser Kontakt hat Sie am {date} blockiert.",
    messagesSent: "Gesendete Nachrichten",
    messagesReceived: "Empfangene Nachrichten",
    call: "Anruf",
    callsPlural: "Anrufe",
    callTime: "Gesprächszeit",
    sendMessage: "Nachricht senden",
    block: "Diesen Kontakt blockieren",
    unblock: "Diesen Kontakt entsperren",
    delete: "Diesen Kontakt löschen",
    blockedHint:
      "Sie haben diesen Kontakt blockiert. Er kann Sie nicht erreichen, solange Sie ihn nicht entsperren.",
    deleteTitle: "Diesen Kontakt löschen?",
    deleteMessage:
      "{name}, Ihre Nachrichten und Ihr Anrufverlauf werden von diesem Gerät gelöscht. Diese Aktion ist unumkehrbar.",
  },
  contactNew: {
    title: "Neuer Kontakt",
    notice:
      "Der Name ist nur eine lokale Bezeichnung, die nur Sie sehen. Es ist der öffentliche Schlüssel, den Ihr Kontakt Ihnen direkt übergibt, der ihn wirklich identifiziert. Vergleichen Sie den Fingerabdruck mündlich.",
    firstName: "Angezeigter Name",
    firstNamePlaceholder: "z. B. Livia",
    lastName: "Nachname (optional)",
    lastNamePlaceholder: "z. B. Levin",
    key: "Schlüssel des Kontakts",
    keyHint: "Aus seinem Profil kopiert oder unten gescannt.",
    scan: "QR-Code des Kontakts scannen",
    submit: "Kontakt hinzufügen",
    nameRequired: "Geben Sie diesem Kontakt einen Namen.",
    keyRequired: "Fügen Sie den Schlüssel des Kontakts ein oder scannen Sie ihn.",
    keyInvalid: "Dieser Kontaktschlüssel ist ungültig oder unvollständig.",
    keyDuplicate: "Dieser Kontakt steht bereits in Ihrer Liste.",
  },
  chat: {
    notFound: "Unterhaltung nicht gefunden.",
    backToConversations: "Zurück zu den Unterhaltungen",
    secure: "Gesichert",
    connected: "Verbunden",
    connecting: "Verbinden…",
    disconnected: "Offline",
    blockedByMe:
      "Sie haben diesen Kontakt blockiert. Entsperren Sie ihn, um ihm zu schreiben.",
    blockedByThem:
      "Dieser Kontakt hat Sie blockiert. Ihre Nachrichten erreichen ihn nicht.",
    empty:
      "Beginnen Sie die Unterhaltung, nichts wird anderswo als auf Ihren Geräten gespeichert.",
    readMark: "hat bis hierhin gelesen",
    composerPlaceholder: "Schreiben Sie Ihre Nachricht...",
    composerLabel: "Nachrichtenfeld",
    send: "Nachricht senden",
    openLink: "Link {url} öffnen",
    attach: "Foto oder Video anhängen",
    attachTitle: "Medien senden",
    attachLibrary: "Aus der Galerie wählen",
    attachCamera: "Foto oder Video aufnehmen",
    mediaImage: "Foto",
    mediaVideo: "Video",
    mediaOpen: "Öffnen: {kind}",
    mediaSending: "Senden… {percent} %",
    mediaReceiving: "Empfangen… {percent} %",
    mediaFailed: "Übertragung unterbrochen",
    mediaRetry: "Erneut versuchen",
    mediaUnavailable: "Medien auf diesem Gerät nicht verfügbar.",
    mediaPlayerUnavailable:
      "Der Videoplayer benötigt ein natives Modul, das in dieser App-Version fehlt: Bauen Sie die App neu, um ihn zu aktivieren.",
    mediaTooLargeTitle: "Datei zu groß",
    mediaTooLargeMessage:
      "Diese Datei wiegt {size} MB. Das Limit liegt bei {limit} MB: Jede Datei läuft vollständig und verschlüsselt über das Relais.",
    mediaDeniedTitle: "Kamera abgelehnt",
    mediaDeniedMessage:
      "BeHide benötigt die Kamera, um ein Foto oder Video aufzunehmen. Erlauben Sie den Zugriff in den Geräteeinstellungen.",
    mediaUnreadableTitle: "Datei nicht lesbar",
    mediaUnreadableMessage:
      "Diese Datei konnte auf diesem Gerät nicht gelesen werden. Versuchen Sie es mit einer anderen.",
    mediaUnsupportedTitle: "Medienversand nicht verfügbar",
    mediaUnsupportedMessage:
      "Die Medienauswahl benötigt native Module, die in dieser App-Version fehlen: Bauen Sie die App neu, um sie zu aktivieren (in Expo Go funktioniert sie nicht).",
  },
  call: {
    ended: "Anruf beendet",
    video: "Videoanruf",
    ongoing: "Laufender Anruf",
    incoming: "Eingehender Anruf",
    ringing: "Es klingelt…",
    remoteCameraOff: "Kamera deaktiviert",
    muted: "Mikrofon stumm",
    mic: "Mikro",
    camera: "Kamera",
    unmute: "Mikrofon wieder einschalten",
    mute: "Mikrofon stummschalten",
    cameraOff: "Kamera ausschalten",
    cameraOn: "Kamera einschalten",
    decline: "Anruf ablehnen",
    accept: "Anruf annehmen",
    hangup: "Auflegen",
    newTitle: "Neuer Anruf",
    search: "Kontakt suchen",
    searchLabel: "Kontakt zum Anrufen suchen",
    startCall: "{name} anrufen",
    startVideoCall: "Videoanruf mit {name}",
    emptySearch: "Kein Kontakt passt zu „{query}“.",
    empty:
      "Kein Kontakt zum Anrufen. Fügen Sie einen über den Tab „Kontakte“ hinzu.",
  },
  profile: {
    publicKeyTitle: "Ihr öffentlicher Schlüssel",
    publicKeyBody:
      "Das ist Ihre öffentliche Identität: Teilen Sie sie, damit ein Kontakt Sie hinzufügen kann, sie verrät nichts Privates. Der Fingerabdruck unten ist eine kurze Zusammenfassung davon, die Sie mündlich vergleichen sollten, um sicherzugehen, dass sich niemand in die Unterhaltung schiebt.",
    fingerprint: "Fingerabdruck",
    shareQr: "Meinen Schlüssel teilen (QR-Code)",
    shareQrLabel: "Meinen öffentlichen Schlüssel als QR-Code teilen",
    biometric: "Entsperren per Biometrie",
    biometricHint:
      "Öffnen Sie BeHide, ohne die Passphrase einzugeben. Nach mehreren Fehlversuchen wird sie weiterhin verlangt.",
    biometricUnavailable:
      "Richten Sie in den Geräteeinstellungen einen Fingerabdruck oder ein Gesicht ein, um dies zu aktivieren.",
    biometricCancelledTitle: "Aktivierung abgebrochen",
    biometricCancelledMessage:
      "Die Biometrie wurde nicht bestätigt. Das schnelle Entsperren bleibt deaktiviert.",
    backups: "Lokale Sicherungen",
    backupsHint:
      "Exportieren Sie Ihre Daten in eine mit Ihrem privaten Schlüssel verschlüsselte Datei. Es wird nichts automatisch gesichert.",
    export: "Exportieren",
    exportLabel: "Sicherung exportieren",
    import: "Importieren",
    importLabel: "Sicherung importieren",
    backupNote:
      "Die Datei lässt sich auf jedem Telefon lesen, auf dem Sie diese Identität wiederherstellen: Ihr privater Schlüssel öffnet sie, nicht dieses Gerät.",
    exportedTitle: "Sicherung exportiert",
    exportedMessage:
      "Die Datei ist mit Ihrem privaten Schlüssel verschlüsselt: Für sich allein genügt sie nicht, um Ihre Daten zu lesen. Bewahren Sie sie auf, wo Sie möchten.",
    importedTitle: "Sicherung importiert",
    importedNothing:
      "Nichts hinzuzufügen: Sie hatten bereits alles aus dieser Datei.",
    importedMessage: "{count} Element(e) wiederhergestellt.",
    exportFailedTitle: "Export nicht möglich",
    importFailedTitle: "Import nicht möglich",
    backupLocked: "Sitzung gesperrt. Entsperren Sie BeHide und versuchen Sie es erneut.",
    backupUnavailable:
      "Sicherungen benötigen native Module, die in dieser Version der App fehlen: Bauen Sie sie neu, um sie zu aktivieren (sie funktionieren nicht in Expo Go).",
    backupWrongIdentity:
      "Diese Sicherung gehört zu einer anderen Identität: Sie ist mit einem anderen privaten Schlüssel verschlüsselt und bleibt hier unlesbar.",
    backupWrongVersion:
      "Diese Sicherung stammt aus einer neueren Version von BeHide. Aktualisieren Sie die App.",
    backupUnreadable:
      "Unlesbare Datei: Das ist keine BeHide-Sicherung, oder sie ist beschädigt.",
    backupErrorTitle: "Vorgang nicht möglich",
    backupErrorMessage:
      "Ein unerwarteter Fehler ist aufgetreten. Versuchen Sie es erneut.",
    importConfirmTitle: "Sicherung importieren?",
    importConfirmMessage:
      "Die Daten aus der Datei werden zu Ihren hinzugefügt. Nichts wird überschrieben: Was bereits auf diesem Gerät ist, bleibt erhalten.",
    importConfirmAction: "Datei auswählen",
    readReceipts: "Lesebestätigungen",
    readReceiptsHint:
      "Zeigen Sie Ihren Kontakten, dass Sie ihre Nachrichten gelesen haben. Deaktiviert sehen Sie auch nicht, ob sie Ihre gelesen haben.",
    lockSession: "Sitzung sperren",
    dangerZone: "Gefahrenzone",
    recoverKey: "Privaten Schlüssel abrufen",
    recoverKeyHint:
      "Zeigt Ihren privaten Schlüssel im Klartext. Tun Sie das ungestört und teilen Sie ihn niemals.",
    recoverKeyTitle: "Ihren privaten Schlüssel anzeigen?",
    recoverKeyMessage:
      "Dieser Schlüssel gibt volle Kontrolle über Ihre Identität: Wer ihn sieht, kann sich als Sie ausgeben und Ihren Austausch mitlesen. Zeigen Sie ihn nur ungestört und teilen Sie ihn niemals.",
    forget: "Meine Identität löschen",
    forgetHint:
      "Löscht die Identität und die Unterhaltungen endgültig von diesem Gerät. Ohne Ihren Schlüssel unumkehrbar.",
    forgetTitle: "Diese Identität löschen?",
    forgetMessage:
      "Kein Server bewahrt sie auf: Ohne Ihren privaten Schlüssel geht sie endgültig verloren, zusammen mit Ihren Unterhaltungen."
  },
  privateKey: {
    title: "Privater Schlüssel",
    banner:
      "Dieser Schlüssel gibt volle Kontrolle über Ihre Identität: Wer ihn sieht, kann sich als Sie ausgeben und Ihren Austausch mitlesen. Zeigen Sie ihn niemandem und fügen Sie ihn in keinen Onlinedienst ein.",
    label: "Ihr privater Schlüssel",
    hint: "Lange drücken, um ihn zu kopieren. Bewahren Sie ihn offline auf: Er ist die einzige Möglichkeit, dieses Konto wiederherzustellen.",
    locked: "Sitzung gesperrt: Öffnen Sie sie erneut, um den Schlüssel anzuzeigen.",
    done: "Mein Schlüssel ist sicher verwahrt",
  },
  qr: {
    title: "Ihr öffentlicher Schlüssel",
    subtitle:
      "Lassen Sie ihn von Ihrem Kontakt scannen oder kopieren Sie ihn ihm so, wie er ist.",
    scannerTitle: "QR-Code scannen",
    scannerClose: "Scanner schließen",
    scannerHint: "Richten Sie auf den QR-Code im Profil Ihres Kontakts.",
    scannerInvalid: "Dieser QR-Code ist keine BeHide-Identität.",
    cameraBlocked:
      "Der Kamerazugriff ist blockiert. Erlauben Sie ihn in den Einstellungen, um einen QR-Code zu scannen.",
    cameraNeeded:
      "BeHide benötigt die Kamera, um den QR-Code des Kontakts zu scannen.",
    openSettings: "Einstellungen öffnen",
    allowCamera: "Kamera erlauben",
  },
  notFound: {
    title: "Diese Seite existiert nicht.",
    link: "Zurück zu den Unterhaltungen",
  },
  notifications: {
    newMessage: "hat Ihnen eine Nachricht gesendet",
    newPhoto: "hat Ihnen ein Foto gesendet",
    newVideo: "hat Ihnen ein Video gesendet",
    incomingCall: "ruft Sie an",
    incomingVideoCall: "Eingehender Videoanruf",
  },
  biometrics: {
    unlockPrompt: "BeHide entsperren",
    enablePrompt: "Bestätigen Sie, um das Entsperren per Biometrie zu aktivieren",
    usePassphrase: "Passphrase verwenden",
  },
  datetime: {
    todayAt: "Heute um {time}",
    yesterdayAt: "Gestern um {time}",
    dateAt: "{date} um {time}",
    seconds: "{count} s",
    minutes: "{count} Min.",
    minutesSeconds: "{minutes} Min. {seconds} s",
  },
};
