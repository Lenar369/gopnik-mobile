# Google Play release preparation

Source baseline: ea2285d. Android application ID: ru.calcul369.gopnik. Version 1.0.0 (1), minSdk 26, targetSdk 36.

The Android application packages preview-v6 and approved art/audio locally. It requests no Android permissions and includes no advertising, billing or analytics SDK. Web storage saves progress on the device. Android backup is disabled. Uninstalling or clearing application data deletes local saves.

Signing secrets are outside the repository in /Users/lenar/Documents/Codex/secure/gopnik-mobile. Never commit that directory. Release signing uses GOPNIK_KEYSTORE, GOPNIK_STORE_PASSWORD, GOPNIK_KEY_ALIAS and GOPNIK_KEY_PASSWORD environment variables.

Build using JDK 17, Gradle 8.13 and Android SDK 36: gradle -p android bundleRelease assembleRelease. Run tests before pushing: cd tests && npm ci && node run.js.

Windows QA: all 32 existing scenarios passed after correcting tests/bundle.js to accept CRLF script tags. This is game-logic testing in jsdom, not an Android device test.

Owner stated on 2026-11-21 that all artwork and both music tracks were made through ChatGPT. Reference candidates and drafts are excluded from Android packaging. This statement records provenance; it does not constitute independent clearance of every visual or audio element.

Pending: Android runtime testing, store graphics and screenshots, hosted privacy policy, Play declarations and rating, signed bundle validation and upload, pre-launch checks. Public production rollout requires explicit owner approval.
