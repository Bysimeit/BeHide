import type { Catalog } from "./fr";

export const nl: Catalog = {
  common: {
    cancel: "Annuleren",
    close: "Sluiten",
    back: "Terug",
    show: "Tonen",
    delete: "Verwijderen",
    erase: "Wissen",
    unlock: "Ontgrendelen",
    continue: "Doorgaan",
  },
  language: {
    title: "Taal",
    subtitle: "Kies de taal van de app.",
    system: "Automatisch",
    systemHint: "De taal van het toestel volgen",
    open: "Taal wijzigen",
    current: "Taal: {name}",
  },
  validation: {
    pseudoTooShort: "De bijnaam moet minstens {pseudoMin} tekens lang zijn.",
    pseudoTooLong: "De bijnaam mag hoogstens {pseudoMax} tekens lang zijn.",
    passphraseTooShort:
      "De wachtwoordzin moet minstens {passphraseMin} tekens lang zijn.",
    passphraseMismatch: "De twee wachtwoordzinnen komen niet overeen.",
    privateKeyRequired: "Plak uw privésleutel.",
    privateKeyHex: "De sleutel mag alleen hexadecimale tekens bevatten.",
    privateKeyLength:
      "De sleutel moet {keyLength} tekens lang zijn ({keyGiven} ingevoerd).",
  },
  tabs: {
    conversations: "Gesprekken",
    calls: "Oproepen",
    contacts: "Contacten",
    profile: "Profiel",
  },
  login: {
    loadingTitle: "Ontgrendelen…",
    loadingMessage: "Uw kluis wordt op dit toestel ontsleuteld.",
    welcomeBack: "Welkom terug, {pseudo}",
    welcome: "Welkom bij BeHide",
    subtitleIdentity:
      "Uw identiteit verlaat dit toestel nooit. Ontgrendel ze lokaal.",
    subtitleNew:
      "End-to-end versleutelde berichten en audio- en videogesprekken, zonder account of server.",
    biometricAction: "Ontgrendelen met biometrie",
    biometricFailed: "Biometrie niet herkend (poging {attempt} van {max}).",
    biometricExhausted:
      "Biometrie niet herkend. Voer uw wachtwoordzin in om door te gaan.",
    orPassphrase: "of uw wachtwoordzin",
    passphrase: "Wachtwoordzin",
    passphrasePlaceholder: "Uw wachtwoordzin",
    unlock: "Ontgrendelen",
    wrongPassphrase: "Onjuiste wachtwoordzin.",
    vaultError: "Kan de kluis op dit toestel niet openen.",
    otherIdentity: "Een andere identiteit gebruiken?",
    recoverWithKey: "Herstellen met een privésleutel",
    featureE2e: "End-to-end versleuteld",
    featureAnonymous: "Anonieme berichten, zonder nummer of e-mail",
    featureCalls: "Beveiligde audio- en videogesprekken",
    createIdentity: "Een identiteit aanmaken",
  },
  register: {
    loadingTitle: "Uw identiteit wordt aangemaakt…",
    loadingMessage:
      "Uw sleutel wordt op dit toestel gegenereerd en versleuteld. Dit kan enkele seconden duren.",
    title: "Een identiteit aanmaken",
    subtitle:
      "Geen e-mail, geen telefoonnummer, geen naam. Een BeHide-identiteit is niet meer dan een sleutelpaar dat op dit toestel leeft.",
    pseudo: "Bijnaam",
    pseudoHint:
      "Zichtbaar voor uw contacten. Hij is niet uniek en niet geverifieerd: de sleutelvingerafdruk identificeert u echt.",
    pseudoPlaceholder: "bv. nieuwe-raaf",
    passphrase: "Wachtwoordzin",
    passphraseHint:
      "Minstens {passphraseMin} tekens. Ze versleutelt uw privésleutel op het toestel en kan niet opnieuw worden ingesteld.",
    confirm: "Wachtwoordzin bevestigen",
    notice:
      "Niemand kan deze wachtwoordzin voor u opnieuw instellen: er is geen server die uw account bijhoudt. Vergeet u ze, dan kan alleen de privésleutel, op te halen via uw profiel, uw identiteit herstellen.",
    submit: "Mijn identiteit aanmaken",
    failed: "Kan de identiteit op dit toestel niet aanmaken.",
    haveIdentity: "Hebt u hier al een identiteit?",
    unlock: "Ontgrendelen",
  },
  recovery: {
    title: "Berg uw sleutel veilig op",
    subtitle:
      "Deze privésleutel is uw enige back-up: alleen zij herstelt uw identiteit als u deze telefoon verliest of uw wachtwoordzin vergeet.",
    label: "Uw privésleutel",
    hint: "Lang indrukken om ze te kopiëren. Bewaar ze offline of in een wachtwoordmanager. U vindt ze terug via uw profiel, zolang u de app kunt openen.",
    unavailable:
      "Sleutel niet beschikbaar: heropen de sessie via uw profiel om ze te tonen.",
    fingerprint: "Vingerafdruk van uw sleutel",
    notice:
      "Wie deze sleutel bemachtigt, kan zich als u voordoen. Fotografeer ze niet en bewaar ze niet in een onlinedienst.",
    acknowledge: "Mijn sleutel is veilig opgeborgen",
  },
  restore: {
    loadingTitle: "Herstellen…",
    loadingMessage:
      "Uw identiteit wordt heropgebouwd en op dit toestel versleuteld.",
    title: "Een account herstellen",
    subtitle:
      "Voer uw privésleutel in: die herstelt uw identiteit op dit toestel, zonder server.",
    pseudo: "Bijnaam",
    pseudoHint: "De sleutel bevat uw bijnaam niet: kies een nieuwe.",
    pseudoPlaceholder: "bv. nieuwe-raaf",
    privateKey: "Privésleutel",
    privateKeyHint:
      "De {keyLength} hexadecimale tekens die worden getoond via “De privésleutel ophalen”.",
    privateKeyPlaceholder: "Plak uw privésleutel",
    passphrase: "Nieuwe wachtwoordzin",
    passphraseHint:
      "Minstens {passphraseMin} tekens. Ze versleutelt de herstelde sleutel op dit toestel.",
    confirm: "Wachtwoordzin bevestigen",
    notice:
      "Het herstel gebeurt volledig op het toestel. Uw sleutel wordt nergens naartoe gestuurd; ze wordt meteen versleuteld met uw nieuwe wachtwoordzin.",
    submit: "Mijn identiteit herstellen",
    failed: "Kan niet herstellen met deze sleutel.",
    rememberPassphrase: "Herinnert u zich uw wachtwoordzin?",
    unlock: "Ontgrendelen",
  },
  home: {
    greetingDay: "Hallo {name}",
    greetingEvening: "Goedenavond {name}",
    conversations: "Gesprekken",
    empty: "Nog geen gesprekken.",
    conversationWith: "Gesprek met {name}",
    blockedByThem: "Heeft u geblokkeerd op {date}",
    blockedByMe: "U hebt dit contact geblokkeerd",
    noMessage: "Geen berichten",
    seen: "Gezien",
  },
  calls: {
    title: "Oproepen",
    empty: "Geen recente oproepen. Tik op de knop om er een te starten.",
    newCall: "Een nieuwe oproep starten",
    recall: "{name} terugbellen",
    recallVideo: "{name} terugbellen via video",
    unavailableTitle: "Oproepen niet beschikbaar",
    unavailableMessage:
      "Audio- en videogesprekken vereisen een development build (ze werken niet in Expo Go).",
  },
  contacts: {
    title: "Contacten",
    search: "Een contact zoeken",
    showQr: "Mijn publieke sleutel als QR-code tonen",
    add: "Een contact toevoegen",
    blockedByThem: "Heeft u geblokkeerd",
    blockedByMe: "Contact geblokkeerd",
    open: "Fiche van {name} bekijken",
    emptySearch: "Geen contact komt overeen met “{query}”.",
    empty: "Geen contacten. Tik op + om er een toe te voegen.",
  },
  contactDetail: {
    fallbackTitle: "Contact",
    title: "Contactfiche",
    missing: "Dit contact bestaat niet meer.",
    blockedBanner: "Dit contact heeft u geblokkeerd op {date}.",
    messagesSent: "Verzonden berichten",
    messagesReceived: "Ontvangen berichten",
    call: "Oproep",
    callsPlural: "Oproepen",
    callTime: "Gesprekstijd",
    sendMessage: "Een bericht sturen",
    block: "Dit contact blokkeren",
    unblock: "Dit contact deblokkeren",
    delete: "Dit contact verwijderen",
    blockedHint:
      "U hebt dit contact geblokkeerd. Het kan u niet bereiken zolang u het niet deblokkeert.",
    deleteTitle: "Dit contact verwijderen?",
    deleteMessage:
      "{name}, uw berichten en uw oproepgeschiedenis worden van dit toestel gewist. Deze actie kan niet ongedaan worden gemaakt.",
  },
  contactNew: {
    title: "Nieuw contact",
    notice:
      "De naam is enkel een lokaal label, alleen voor u zichtbaar. Het is de publieke sleutel, rechtstreeks door uw contact doorgegeven, die het echt identificeert. Vergelijk de vingerafdruk mondeling.",
    firstName: "Weergavenaam",
    firstNamePlaceholder: "bv. Livia",
    lastName: "Achternaam (optioneel)",
    lastNamePlaceholder: "bv. Levin",
    key: "Sleutel van het contact",
    keyHint: "Gekopieerd uit zijn profiel, of hieronder gescand.",
    scan: "De QR-code van het contact scannen",
    submit: "Het contact toevoegen",
    nameRequired: "Geef dit contact een naam.",
    keyRequired: "Plak of scan de sleutel van het contact.",
    keyInvalid: "Deze contactsleutel is ongeldig of onvolledig.",
    keyDuplicate: "Dit contact staat al in uw lijst.",
  },
  chat: {
    notFound: "Gesprek niet gevonden.",
    backToConversations: "Terug naar de gesprekken",
    secure: "Beveiligd",
    connected: "Verbonden",
    connecting: "Verbinden…",
    disconnected: "Offline",
    blockedByMe:
      "U hebt dit contact geblokkeerd. Deblokkeer het om het te schrijven.",
    blockedByThem:
      "Dit contact heeft u geblokkeerd. Uw berichten komen niet aan.",
    empty:
      "Start het gesprek, er wordt niets bewaard buiten uw eigen toestellen.",
    readMark: "heeft tot hier gelezen",
    composerPlaceholder: "Schrijf uw bericht...",
    composerLabel: "Berichtveld",
    send: "Het bericht verzenden",
    openLink: "De link {url} openen",
    attach: "Een foto of video bijvoegen",
    attachTitle: "Media versturen",
    attachLibrary: "Kiezen uit de galerij",
    attachCamera: "Een foto of video maken",
    mediaImage: "Foto",
    mediaVideo: "Video",
    mediaOpen: "Openen: {kind}",
    mediaSending: "Verzenden… {percent} %",
    mediaReceiving: "Ontvangen… {percent} %",
    mediaFailed: "Overdracht onderbroken",
    mediaRetry: "Opnieuw proberen",
    mediaUnavailable: "Media niet beschikbaar op dit toestel.",
    mediaPlayerUnavailable:
      "De videospeler steunt op een native module die in deze versie van de app ontbreekt: bouw de app opnieuw om hem in te schakelen.",
    mediaTooLargeTitle: "Bestand te zwaar",
    mediaTooLargeMessage:
      "Dit bestand weegt {size} MB. De limiet is {limit} MB: elk bestand gaat volledig en versleuteld via de relay.",
    mediaDeniedTitle: "Camera geweigerd",
    mediaDeniedMessage:
      "BeHide heeft de camera nodig om een foto of video te maken. Sta dit toe in de instellingen van het toestel.",
    mediaUnreadableTitle: "Onleesbaar bestand",
    mediaUnreadableMessage:
      "Dit bestand kon niet op dit toestel worden gelezen. Probeer het met een ander bestand.",
    mediaUnsupportedTitle: "Media versturen niet beschikbaar",
    mediaUnsupportedMessage:
      "De mediakiezer steunt op native modules die in deze versie van de app ontbreken: bouw de app opnieuw om ze in te schakelen (het werkt niet in Expo Go).",
  },
  call: {
    ended: "Oproep beëindigd",
    video: "Videogesprek",
    ongoing: "Oproep bezig",
    incoming: "Inkomende oproep",
    ringing: "Rinkelen…",
    remoteCameraOff: "Camera uitgeschakeld",
    muted: "Microfoon gedempt",
    mic: "Micro",
    camera: "Camera",
    unmute: "De microfoon inschakelen",
    mute: "De microfoon dempen",
    cameraOff: "De camera uitschakelen",
    cameraOn: "De camera inschakelen",
    decline: "De oproep weigeren",
    accept: "De oproep aannemen",
    hangup: "Ophangen",
    newTitle: "Nieuwe oproep",
    search: "Een contact zoeken",
    searchLabel: "Een contact zoeken om te bellen",
    startCall: "{name} bellen",
    startVideoCall: "Videogesprek met {name}",
    emptySearch: "Geen contact komt overeen met “{query}”.",
    empty: "Geen contact om te bellen. Voeg er een toe via het tabblad Contacten.",
  },
  profile: {
    publicKeyTitle: "Uw publieke sleutel",
    publicKeyBody:
      "Dit is uw publieke identiteit: deel ze zodat een contact u kan toevoegen, ze onthult niets privé. De vingerafdruk hieronder is een korte samenvatting ervan, mondeling te vergelijken om zeker te zijn dat niemand tussen het gesprek gaat zitten.",
    fingerprint: "Vingerafdruk",
    shareQr: "Mijn sleutel delen (QR-code)",
    shareQrLabel: "Mijn publieke sleutel als QR-code delen",
    biometric: "Ontgrendelen met biometrie",
    biometricHint:
      "Open BeHide zonder uw wachtwoordzin in te voeren. Ze wordt nog steeds gevraagd na meerdere mislukte pogingen.",
    biometricUnavailable:
      "Stel een vingerafdruk of gezicht in bij de instellingen van uw toestel om dit in te schakelen.",
    biometricCancelledTitle: "Activering geannuleerd",
    biometricCancelledMessage:
      "De biometrie werd niet bevestigd. Snel ontgrendelen blijft uitgeschakeld.",
    backups: "Lokale back-ups",
    backupsHint:
      "Exporteer uw gegevens naar een bestand dat met uw privésleutel is versleuteld. Er wordt niets automatisch geback-upt.",
    export: "Exporteren",
    exportLabel: "Een back-up exporteren",
    import: "Importeren",
    importLabel: "Een back-up importeren",
    backupNote:
      "Het bestand is leesbaar op elke telefoon waarop u deze identiteit herstelt: uw privésleutel opent het, niet dit toestel.",
    exportedTitle: "Back-up geëxporteerd",
    exportedMessage:
      "Het bestand is versleuteld met uw privésleutel: op zichzelf volstaat het niet om uw gegevens te lezen. Bewaar het waar u wilt.",
    importedTitle: "Back-up geïmporteerd",
    importedNothing: "Niets toe te voegen: u had alles uit dit bestand al.",
    importedMessage: "{count} item(s) hersteld.",
    exportFailedTitle: "Exporteren mislukt",
    importFailedTitle: "Importeren mislukt",
    backupLocked: "Sessie vergrendeld. Ontgrendel BeHide en probeer opnieuw.",
    backupUnavailable:
      "Back-ups steunen op native modules die in deze versie van de app ontbreken: bouw ze opnieuw om die in te schakelen (ze werken niet in Expo Go).",
    backupWrongIdentity:
      "Deze back-up hoort bij een andere identiteit: ze is met een andere privésleutel versleuteld en blijft hier onleesbaar.",
    backupWrongVersion:
      "Deze back-up komt van een nieuwere versie van BeHide. Werk de app bij.",
    backupUnreadable:
      "Onleesbaar bestand: dit is geen BeHide-back-up, of het is beschadigd.",
    backupErrorTitle: "Bewerking mislukt",
    backupErrorMessage: "Er is een onverwachte fout opgetreden. Probeer opnieuw.",
    importConfirmTitle: "Een back-up importeren?",
    importConfirmMessage:
      "De gegevens uit het bestand worden aan de uwe toegevoegd. Er wordt niets overschreven: wat al op dit toestel staat, blijft behouden.",
    importConfirmAction: "Een bestand kiezen",
    readReceipts: "Leesbevestigingen",
    readReceiptsHint:
      "Laat uw contacten weten dat u hun berichten hebt gelezen. Uitgeschakeld ziet u ook niet of zij de uwe hebben gelezen.",
    lockSession: "De sessie vergrendelen",
    dangerZone: "Gevarenzone",
    recoverKey: "De privésleutel ophalen",
    recoverKeyHint:
      "Toont uw privésleutel in leesbare tekst. Doe dit uit het zicht van anderen en deel ze nooit.",
    recoverKeyTitle: "Uw privésleutel tonen?",
    recoverKeyMessage:
      "Deze sleutel geeft volledige controle over uw identiteit: wie ze ziet, kan zich als u voordoen en uw uitwisselingen lezen. Toon ze alleen uit het zicht van anderen en deel ze nooit.",
    forget: "Mijn identiteit wissen",
    forgetHint:
      "Verwijdert de identiteit en de gesprekken definitief van dit toestel. Onomkeerbaar zonder uw sleutel.",
    forgetTitle: "Deze identiteit wissen?",
    forgetMessage:
      "Geen enkele server bewaart ze: zonder uw privésleutel gaat ze definitief verloren, samen met uw gesprekken."
  },
  privateKey: {
    title: "Privésleutel",
    banner:
      "Deze sleutel geeft volledige controle over uw identiteit: wie ze ziet, kan zich als u voordoen en uw uitwisselingen lezen. Toon ze aan niemand en plak ze in geen enkele onlinedienst.",
    label: "Uw privésleutel",
    hint: "Lang indrukken om ze te kopiëren. Bewaar ze offline: ze is de enige manier om dit account te herstellen.",
    locked: "Sessie vergrendeld: heropen ze om de sleutel te tonen.",
    done: "Mijn sleutel is veilig opgeborgen",
  },
  qr: {
    title: "Uw publieke sleutel",
    subtitle: "Laat ze door uw contact scannen, of kopieer ze zoals ze is.",
    scannerTitle: "Een QR-code scannen",
    scannerClose: "De scanner sluiten",
    scannerHint: "Richt op de QR-code op het profiel van uw contact.",
    scannerInvalid: "Deze QR-code is geen BeHide-identiteit.",
    cameraBlocked:
      "Toegang tot de camera is geblokkeerd. Sta ze toe in de instellingen om een QR-code te scannen.",
    cameraNeeded:
      "BeHide heeft de camera nodig om de QR-code van het contact te scannen.",
    openSettings: "Instellingen openen",
    allowCamera: "De camera toestaan",
  },
  notFound: {
    title: "Deze pagina bestaat niet.",
    link: "Terug naar de gesprekken",
  },
  notifications: {
    newMessage: "heeft u een bericht gestuurd",
    newPhoto: "heeft u een foto gestuurd",
    newVideo: "heeft u een video gestuurd",
    incomingCall: "belt u",
    incomingVideoCall: "Inkomend videogesprek",
  },
  biometrics: {
    unlockPrompt: "BeHide ontgrendelen",
    enablePrompt: "Bevestig om ontgrendelen met biometrie in te schakelen",
    usePassphrase: "De wachtwoordzin gebruiken",
  },
  datetime: {
    todayAt: "Vandaag om {time}",
    yesterdayAt: "Gisteren om {time}",
    dateAt: "{date} om {time}",
    seconds: "{count} s",
    minutes: "{count} min",
    minutesSeconds: "{minutes} min {seconds} s",
  },
};
