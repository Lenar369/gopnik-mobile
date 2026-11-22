# Google Play release preparation

Source baseline: ea2285d. Android application ID: ru.calcul369.gopnik. Version 1.0.1 (2), minSdk 26, targetSdk 36.

The Android application packages preview-v6 and approved art/audio locally. It requests no Android permissions and includes no advertising, billing or analytics SDK. Web storage saves progress on the device. Android backup is disabled. Uninstalling or clearing application data deletes local saves.

Signing secrets are outside the repository in /Users/lenar/Documents/Codex/secure/gopnik-mobile. Never commit that directory. Release signing uses GOPNIK_KEYSTORE, GOPNIK_STORE_PASSWORD, GOPNIK_KEY_ALIAS and GOPNIK_KEY_PASSWORD environment variables.

Build using JDK 17, Gradle 8.13 and Android SDK 36: gradle -p android bundleRelease assembleRelease. Run tests before pushing: cd tests && npm ci && node run.js.

Windows QA: all 32 existing scenarios passed after correcting tests/bundle.js to accept CRLF script tags. This is game-logic testing in jsdom, not an Android device test.

Owner stated on 2026-11-21 that all artwork and both music tracks were made through ChatGPT. Reference candidates and drafts are excluded from Android packaging. This statement records provenance; it does not constitute independent clearance of every visual or audio element.

Release preparation completed on 2026-11-22:
- Signed AAB and APK built with JDK17/Gradle8.13; bundletool validation and JAR signature verification passed.
- All 32 jsdom scenarios passed again. Browser smoke check covered new game, inventory, quests and saved progress after reload. Android API36 emulator installation and launch succeeded; full device gameplay/audio/performance QA remains incomplete.
- Store listing: Russian, free role-playing game, no ads or purchases, Russia distribution, audience 18+, IARC Russia rating 16+.
- Store icon, banner and three actual browser gameplay screenshots are in this directory. Screenshots are not represented as Android device captures.
- Privacy policy: https://gist.github.com/Lenar369/c79b2e4e1af039222c70631551a63d4f
- Play app ID: 4975682909770566607; package ru.calcul369.gopnik.
- Internal release 1.0.0 (1) uploaded. Production release 1.0.1 (2) replaces it; landscape hardware feature is optional and launcher icons are included.
- All mandatory declarations completed from source inspection. No data collected/shared, no advertising ID, no financial/health/government functions, all game functions accessible without an account.
- Owner explicitly authorized IARC terms, public policy hosting and production publication. Actual review status is recorded in SESSION_NOTES.md.

Future updates: preserve applicationId and upload key, increment versionCode, run tests, build signed AAB, validate, upload to the same Play app. Never commit signing credentials or build artifacts. Keep a separate secure backup of the upload key and passwords.
