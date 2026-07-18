<div align="center">

# BeHide

**An anonymous, end-to-end encrypted messenger that keeps no account, no server-side history, and no idea who you are.**

*Who has never dreamed of talking with the certainty that nothing will ever be disclosed?*

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg)]()
[![Built with](https://img.shields.io/badge/built%20with-React%20Native%20%2F%20Expo-000020.svg)]()
[![Status](https://img.shields.io/badge/status-experimental-orange.svg)]()

</div>

---

## A project from 2021, finished much later

BeHide was supposed to exist in 2021. It didn't. Not for lack of wanting it, but
because the idea was far ahead of what I knew how to build back then. The first
attempt was a Cordova app that never made it past the shell: the promise was
written on the box, and the cryptography behind it simply wasn't there.

I came back to it years later and rebuilt it from scratch. This repository is
that second attempt: the same idea, carried this time by the knowledge the first
version was missing. The 2021 code still lives in the history, on the `main` and
`react-native` branches. I left it there on purpose. It's a fair picture of the
distance travelled.

## The idea

Most "private" messengers still start by asking who you are: a phone number, an
email, an account. That single question is the leak. Everything that follows,
however well encrypted, is attached to a real person.

BeHide removes the question. There is no account, because there is no server to
hold one. Your identity is a private key that never leaves your phone, and the
only thing you ever hand out is a public key.

## How it works

Three ideas carry the whole design.

### 1. Your identity is a key, not an account

Signing up generates a master Ed25519 private key on the device. Everything else
derives from it: the exchange key, the storage key, the backup key. Which means
that one key restores your entire identity, on any phone, with no server
involved.

It's stored encrypted under your passphrase (scrypt + XChaCha20-Poly1305). No
password hash is kept anywhere: a wrong passphrase simply fails to decrypt.

There is no "forgot my password". There cannot be. Nobody, including me, can
restore your account for you.

### 2. The encryption knows nothing about the pipe

Two phones that have never met derive the same secret without exchanging it,
using X25519 ECDH. Each side needs only its own private key and the other's
public key, so nothing secret ever travels. Messages are sealed with
XChaCha20-Poly1305, and the sender's public key is bound as associated data, so a
forged sender simply won't open.

What travels is an opaque envelope. Whether it goes over a WebSocket relay, a
direct WebRTC connection, or a carrier pigeon changes nothing about its security.

### 3. The relay is blind

A message still has to physically reach the other phone, so there is a small
WebSocket relay. It is deliberately as ignorant as possible.

It knows: which public keys are connected, that an envelope went from key A to
key B, and where to send a push notification.

It does **not** know: the content of anything, or **the name you gave a
contact**. That label only exists on the recipient's device, inside an encrypted
database. Which is why offline push notifications are generic. Even if the relay
wanted to say *"Livia is messaging you"*, it has no idea who Livia is.

Calls go further: audio and video are peer-to-peer and never touch a server. Only
the handshake passes through the relay, and it's encrypted too, because ICE
candidates contain IP addresses.

## What's in the box

|  | |
|---|---|
| **Messaging** | End-to-end encrypted, offline delivery with at-least-once guarantee |
| **Calls** | Peer-to-peer audio & video (WebRTC), encrypted signalling |
| **Contacts** | Added by QR code or token, never by phone number |
| **Identity** | A single private master key. It alone restores your whole identity, on any phone. |
| **At rest** | Local database encrypted with a device-specific derived key |
| **Backups** | Manual, encrypted, identity-bound. Restore on any phone that has your key |
| **Read receipts** | Reciprocal: turn them off and you neither send nor see them |
| **Blocking** | Enforced silently on arrival. The sender is never told |
| **Profile** | A nickname. That's the only public thing you choose. |

Built with Expo SDK 57, React Native 0.86, TypeScript (strict). The relay is a
dependency-light Node service.

## Honest limitations

This is an independent project, **not audited by anyone**. If your safety depends
on it, use Signal instead. That isn't modesty, it's the correct advice.

The known gaps, stated plainly:

- **No forward secrecy.** Keys are static. If a private key ever leaks, past
  captured messages become readable. A Double-Ratchet-style scheme is the natural
  next step and is not implemented.
- **No auto-lock.** An unlocked session stays unlocked until you lock it or kill
  the app. A phone taken from your hands while open is an open phone.
- **Biometric unlock is convenience, not hardening.** It guards a copy of the key
  in the OS keystore; it does not decrypt the vault. Whoever defeats the prompt
  and extracts the keystore gets the key without the passphrase.
- **Metadata is visible to the relay.** It cannot read your messages, but it sees
  which keys talk to which, and when.
- **Calls reveal your IP to the person you call.** That's inherent to real P2P:
  no TURN server relays the stream, by design.
- **Trust is on first contact.** Compare fingerprints out loud if it matters.

## Security

Publishing this code does not weaken it. Security rests entirely on keys that
never leave the device, never on the secrecy of the algorithm. A design that
broke the moment you read it would already be broken.

Found something? Open an issue for anything non-sensitive. For an actual
vulnerability, please report it privately first.

## License

[AGPL-3.0](LICENSE).
