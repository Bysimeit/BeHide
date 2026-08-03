import type { Catalog } from "./fr";

export const en: Catalog = {
  common: {
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    show: "Show",
    delete: "Delete",
    erase: "Erase",
    unlock: "Unlock",
    continue: "Continue",
  },
  language: {
    title: "Language",
    subtitle: "Choose the language of the app.",
    system: "Automatic",
    systemHint: "Follow the device language",
    open: "Change language",
    current: "Language: {name}",
  },
  validation: {
    pseudoTooShort: "The nickname must be at least {pseudoMin} characters.",
    pseudoTooLong: "The nickname must be at most {pseudoMax} characters.",
    passphraseTooShort:
      "The passphrase must be at least {passphraseMin} characters.",
    passphraseMismatch: "The two passphrases do not match.",
    privateKeyRequired: "Paste your private key.",
    privateKeyHex: "The key must contain hexadecimal characters only.",
    privateKeyLength:
      "The key must be {keyLength} characters ({keyGiven} entered).",
  },
  tabs: {
    conversations: "Conversations",
    calls: "Calls",
    contacts: "Contacts",
    profile: "Profile",
  },
  login: {
    loadingTitle: "Unlocking…",
    loadingMessage: "Decrypting your vault on this device.",
    welcomeBack: "Welcome back, {pseudo}",
    welcome: "Welcome to BeHide",
    subtitleIdentity:
      "Your identity never leaves this device. Unlock it locally.",
    subtitleNew:
      "End-to-end encrypted messaging and audio and video calls, with no account and no server.",
    biometricAction: "Unlock with biometrics",
    biometricFailed: "Biometrics not recognised (attempt {attempt} of {max}).",
    biometricExhausted:
      "Biometrics not recognised. Enter your passphrase to continue.",
    orPassphrase: "or your passphrase",
    passphrase: "Passphrase",
    passphrasePlaceholder: "Your passphrase",
    unlock: "Unlock",
    wrongPassphrase: "Incorrect passphrase.",
    vaultError: "Unable to open the vault on this device.",
    otherIdentity: "Use another identity?",
    recoverWithKey: "Recover with a private key",
    featureE2e: "End-to-end encrypted",
    featureAnonymous: "Anonymous messaging, no phone number or email",
    featureCalls: "Secure audio and video calls",
    createIdentity: "Create an identity",
  },
  register: {
    loadingTitle: "Creating your identity…",
    loadingMessage:
      "Generating and encrypting your key on this device. This may take a few seconds.",
    title: "Create an identity",
    subtitle:
      "No email, no phone number, no name. A BeHide identity is just a key pair living on this device.",
    pseudo: "Nickname",
    pseudoHint:
      "Visible to your contacts. It is neither unique nor verified: the key fingerprint is what really identifies you.",
    pseudoPlaceholder: "e.g. new-raven",
    passphrase: "Passphrase",
    passphraseHint:
      "{passphraseMin} characters minimum. It encrypts your private key on the device and cannot be reset.",
    confirm: "Confirm passphrase",
    notice:
      "Nobody can reset this passphrase for you: no server holds your account. If you forget it, only the private key, available from your profile, can restore your identity.",
    submit: "Create my identity",
    failed: "Unable to create the identity on this device.",
    haveIdentity: "Already have an identity here?",
    unlock: "Unlock",
  },
  recovery: {
    title: "Put your key somewhere safe",
    subtitle:
      "This private key is your only backup: it alone restores your identity if you lose this phone or forget your passphrase.",
    label: "Your private key",
    hint: "Long press to copy it. Keep it offline, or in a password manager. You can find it again from your profile, as long as you can open the app.",
    unavailable:
      "Key unavailable: reopen the session from your profile to show it.",
    fingerprint: "Your key fingerprint",
    notice:
      "Anyone who gets this key can impersonate you. Do not photograph it and do not store it in an online service.",
    acknowledge: "My key is safely stored",
  },
  restore: {
    loadingTitle: "Restoring…",
    loadingMessage:
      "Rebuilding your identity and encrypting it on this device.",
    title: "Recover an account",
    subtitle:
      "Enter your private key: it restores your identity on this device, without a server.",
    pseudo: "Nickname",
    pseudoHint: "The key does not contain your nickname: pick a new one.",
    pseudoPlaceholder: "e.g. new-raven",
    privateKey: "Private key",
    privateKeyHint:
      "The {keyLength} hexadecimal characters shown under “Recover the private key”.",
    privateKeyPlaceholder: "Paste your private key",
    passphrase: "New passphrase",
    passphraseHint:
      "{passphraseMin} characters minimum. It encrypts the restored key on this device.",
    confirm: "Confirm passphrase",
    notice:
      "Restoring happens entirely on the device. Your key is not sent anywhere; it is immediately encrypted under your new passphrase.",
    submit: "Restore my identity",
    failed: "Unable to restore with this key.",
    rememberPassphrase: "Remember your passphrase?",
    unlock: "Unlock",
  },
  home: {
    greetingDay: "Hello {name}",
    greetingEvening: "Good evening {name}",
    conversations: "Conversations",
    empty: "No conversations yet.",
    conversationWith: "Conversation with {name}",
    blockedByThem: "Blocked you on {date}",
    blockedByMe: "You blocked this contact",
    noMessage: "No messages",
    seen: "Seen",
  },
  calls: {
    title: "Calls",
    empty: "No recent calls. Tap the button to make one.",
    newCall: "Make a new call",
    recall: "Call {name} back",
    recallVideo: "Call {name} back on video",
    unavailableTitle: "Calls unavailable",
    unavailableMessage:
      "Audio/video calls require a development build (they do not work in Expo Go).",
  },
  contacts: {
    title: "Contacts",
    search: "Search for a contact",
    showQr: "Show my public key as a QR code",
    add: "Add a contact",
    blockedByThem: "Blocked you",
    blockedByMe: "Contact blocked",
    open: "View {name}'s details",
    emptySearch: "No contact matches “{query}”.",
    empty: "No contacts. Tap + to add one.",
  },
  contactDetail: {
    fallbackTitle: "Contact",
    title: "Contact details",
    missing: "This contact no longer exists.",
    blockedBanner: "This contact blocked you on {date}.",
    messagesSent: "Messages sent",
    messagesReceived: "Messages received",
    call: "Call",
    callsPlural: "Calls",
    callTime: "Call time",
    sendMessage: "Send a message",
    block: "Block this contact",
    unblock: "Unblock this contact",
    delete: "Delete this contact",
    blockedHint:
      "You blocked this contact. They cannot reach you until you unblock them.",
    deleteTitle: "Delete this contact?",
    deleteMessage:
      "{name}, your messages and your call history will be erased from this device. This action cannot be undone.",
  },
  contactNew: {
    title: "New contact",
    notice:
      "The name is only a local label, visible to you alone. It is the public key, handed to you directly by your contact, that really identifies them. Compare its fingerprint out loud.",
    firstName: "Display name",
    firstNamePlaceholder: "e.g. Livia",
    lastName: "Last name (optional)",
    lastNamePlaceholder: "e.g. Levin",
    key: "Contact's key",
    keyHint: "Copied from their profile, or scanned below.",
    scan: "Scan the contact's QR code",
    submit: "Add the contact",
    nameRequired: "Give this contact a name.",
    keyRequired: "Paste or scan the contact's key.",
    keyInvalid: "This contact key is invalid or incomplete.",
    keyDuplicate: "This contact is already in your list.",
  },
  chat: {
    notFound: "Conversation not found.",
    backToConversations: "Back to conversations",
    secure: "Secure",
    connected: "Connected",
    connecting: "Connecting…",
    disconnected: "Offline",
    blockedByMe: "You blocked this contact. Unblock them to write to them.",
    blockedByThem: "This contact blocked you. Your messages will not reach them.",
    empty:
      "Start the conversation, nothing will be stored anywhere but on your devices.",
    readMark: "has read up to here",
    composerPlaceholder: "Write your message...",
    composerLabel: "Message field",
    send: "Send the message",
    openLink: "Open the link {url}",
    attach: "Attach a photo or a video",
    attachTitle: "Send a media file",
    attachLibrary: "Pick from the gallery",
    attachCamera: "Take a photo or a video",
    mediaImage: "Photo",
    mediaVideo: "Video",
    mediaOpen: "Open: {kind}",
    mediaSending: "Sending… {percent}%",
    mediaReceiving: "Receiving… {percent}%",
    mediaFailed: "Transfer interrupted",
    mediaRetry: "Try again",
    mediaUnavailable: "Media unavailable on this device.",
    mediaPlayerUnavailable:
      "The video player relies on a native module missing from this build of the app: rebuild it to enable playback.",
    mediaTooLargeTitle: "File too large",
    mediaTooLargeMessage:
      "This media file weighs {size} MB. The limit is {limit} MB: every media file travels whole through the relay, encrypted.",
    mediaDeniedTitle: "Camera denied",
    mediaDeniedMessage:
      "BeHide needs the camera to take a photo or a video. Allow it in the device settings.",
    mediaUnreadableTitle: "Unreadable media",
    mediaUnreadableMessage:
      "This file could not be read on this device. Try again with another media file.",
    mediaUnsupportedTitle: "Media sending unavailable",
    mediaUnsupportedMessage:
      "The media picker relies on native modules missing from this build of the app: rebuild it to enable them (it does not work in Expo Go).",
  },
  call: {
    ended: "Call ended",
    video: "Video call",
    ongoing: "Call in progress",
    incoming: "Incoming call",
    ringing: "Ringing…",
    remoteCameraOff: "Camera off",
    muted: "Microphone muted",
    mic: "Mic",
    camera: "Camera",
    unmute: "Unmute the microphone",
    mute: "Mute the microphone",
    cameraOff: "Turn off the camera",
    cameraOn: "Turn on the camera",
    decline: "Decline the call",
    accept: "Accept the call",
    hangup: "Hang up",
    newTitle: "New call",
    search: "Search for a contact",
    searchLabel: "Search for a contact to call",
    startCall: "Call {name}",
    startVideoCall: "Video call with {name}",
    emptySearch: "No contact matches “{query}”.",
    empty: "No contact to call. Add one from the Contacts tab.",
  },
  profile: {
    publicKeyTitle: "Your public key",
    publicKeyBody:
      "This is your public identity: share it so a contact can add you, it reveals nothing private. The fingerprint below is a short summary of it, to be compared out loud to make sure nobody is sitting in the middle of the conversation.",
    fingerprint: "Fingerprint",
    shareQr: "Share my key (QR code)",
    shareQrLabel: "Share my public key as a QR code",
    biometric: "Biometric unlock",
    biometricHint:
      "Open BeHide without typing your passphrase. It is still asked for after several failures.",
    biometricUnavailable:
      "Set up a fingerprint or a face in your device settings to enable it.",
    biometricCancelledTitle: "Activation cancelled",
    biometricCancelledMessage:
      "Biometrics were not confirmed. Quick unlock stays disabled.",
    backups: "Local backups",
    backupsHint:
      "Export your data to a file encrypted with your private key. Nothing is backed up automatically.",
    export: "Export",
    exportLabel: "Export a backup",
    import: "Import",
    importLabel: "Import a backup",
    backupNote:
      "The file can be read back on any phone where you restore this identity: your private key opens it, not this device.",
    exportedTitle: "Backup exported",
    exportedMessage:
      "The file is encrypted with your private key: on its own it is not enough to read your data. Store it wherever you like.",
    importedTitle: "Backup imported",
    importedNothing: "Nothing to add: you already had everything in this file.",
    importedMessage: "{count} item(s) restored.",
    exportFailedTitle: "Export failed",
    importFailedTitle: "Import failed",
    backupLocked: "Session locked. Unlock BeHide and try again.",
    backupUnavailable:
      "Backups rely on native modules missing from this version of the app: rebuild it to enable them (they do not work in Expo Go).",
    backupWrongIdentity:
      "This backup belongs to another identity: it is encrypted with a different private key and will stay unreadable here.",
    backupWrongVersion:
      "This backup comes from a newer version of BeHide. Update the app.",
    backupUnreadable:
      "Unreadable file: this is not a BeHide backup, or it is damaged.",
    backupErrorTitle: "Operation failed",
    backupErrorMessage: "An unexpected error occurred. Try again.",
    importConfirmTitle: "Import a backup?",
    importConfirmMessage:
      "The data in the file will be added to yours. Nothing is overwritten: what is already on this device is kept.",
    importConfirmAction: "Choose a file",
    readReceipts: "Read receipts",
    readReceiptsHint:
      "Tell your contacts you have read their messages. If disabled, you will not see whether they read yours either.",
    lockSession: "Lock the session",
    dangerZone: "Danger zone",
    recoverKey: "Recover the private key",
    recoverKeyHint:
      "Shows your private key in clear text. Do it away from prying eyes, never share it.",
    recoverKeyTitle: "Show your private key?",
    recoverKeyMessage:
      "This key gives full control over your identity: anyone who sees it can impersonate you and read your exchanges. Only show it away from prying eyes and never share it.",
    forget: "Erase my identity",
    forgetHint:
      "Permanently deletes the identity and the conversations from this device. Irreversible without your key.",
    forgetTitle: "Erase this identity?",
    forgetMessage:
      "No server holds it: without your private key, it will be permanently lost, along with your conversations."
  },
  privateKey: {
    title: "Private key",
    banner:
      "This key gives full control over your identity: anyone who sees it can impersonate you and read your exchanges. Do not show it to anyone and do not paste it into any online service.",
    label: "Your private key",
    hint: "Long press to copy it. Keep it offline: it is the only way to restore this account.",
    locked: "Session locked: reopen it to show the key.",
    done: "My key is safely stored",
  },
  qr: {
    title: "Your public key",
    subtitle: "Have your contact scan it, or copy it to them as is.",
    scannerTitle: "Scan a QR code",
    scannerClose: "Close the scanner",
    scannerHint: "Point at the QR code shown on your contact's profile.",
    scannerInvalid: "This QR code is not a BeHide identity.",
    cameraBlocked:
      "Camera access is blocked. Allow it in the settings to scan a QR code.",
    cameraNeeded: "BeHide needs the camera to scan the contact's QR code.",
    openSettings: "Open settings",
    allowCamera: "Allow the camera",
  },
  notFound: {
    title: "This page does not exist.",
    link: "Back to conversations",
  },
  notifications: {
    newMessage: "sent you a message",
    newPhoto: "sent you a photo",
    newVideo: "sent you a video",
    incomingCall: "is calling you",
    incomingVideoCall: "Incoming video call",
  },
  biometrics: {
    unlockPrompt: "Unlock BeHide",
    enablePrompt: "Confirm to enable biometric unlock",
    usePassphrase: "Use the passphrase",
  },
  datetime: {
    todayAt: "Today at {time}",
    yesterdayAt: "Yesterday at {time}",
    dateAt: "{date} at {time}",
    seconds: "{count} s",
    minutes: "{count} min",
    minutesSeconds: "{minutes} min {seconds} s",
  },
};
