# FocusPUP — Turnkey Android APK Build & Sideload Guide

This document outlines how to build, compile, and download the standalone **FocusPUP** Android APK (`.apk`) using **GitHub Actions (100% Free)** or **Expo EAS Build**, and how to install it directly onto any Android device without Android Studio or a computer.

---

## 1. Push This Repository to GitHub

If you have not already created a GitHub repository for your app:

1. Go to [GitHub.com](https://github.com/new) and create a new repository named `focuspup` (Public or Private).
2. On your machine, initialize Git, commit, and push:
   ```bash
   git init
   git add .
   git commit -m "feat: complete FocusPUP mobile app and Android CI/CD workflow"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/focuspup.git
   git push -u origin main
   ```

---

## 2. Trigger the Build in GitHub Actions

The automated workflow `.github/workflows/build-apk.yml` is already configured and ready to go.

### Option A: Automatic Build on Push
Every time you push a commit or tag to the `main` branch, the build pipeline triggers automatically.

### Option B: Manual One-Click Trigger (Fastest)
1. Go to your repository on GitHub.
2. Click the **"Actions"** tab at the top.
3. In the left sidebar, click **"Build Standalone Android APK"**.
4. Click the **"Run workflow"** dropdown button on the right.
5. Select:
   - **Branch**: `main`
   - **Build Type**: `release`
   - **Publish as a GitHub Release**: checked (`true`)
6. Click the green **"Run workflow"** button.

The runner will:
- Check out your React Native code
- Set up Node.js 20, Java 17, and the Android SDK
- Prebuild the native Android project via `npx expo prebuild`
- Generate a release keystore and sign the APK with v1/v2/v3 signatures
- Compile `FocusPUP-v1.0.0.apk` via Gradle (`./gradlew assembleRelease`)
- Upload the `.apk` as both a **Workflow Artifact** and a **GitHub Release Asset**.

---

## 3. Download & Install the APK on Your Android Device

### Step 1: Download the APK
On your Android phone:
1. Open **Google Chrome** (or your preferred mobile browser).
2. Navigate to your GitHub repository:
   - **From Releases**: Tap **"Releases"** on the repo homepage → tap `FocusPUP-v1.0.0.apk` under **Assets**.
   - **From Actions**: Tap the **"Actions"** tab → tap the latest successful run → scroll down to **Artifacts** → tap **FocusPUP-Android-APK**.
3. Chrome may show a prompt: *"File might be harmful. Do you want to download FocusPUP-v1.0.0.apk anyway?"* → Tap **"Download anyway"**.

### Step 2: Enable "Install Unknown Apps" (Standard Android Sideloading)
1. Once the download finishes, tap **Open** from the notification bar (or find it in your **Files / Downloads** folder).
2. If Android prompts *"For your security, your phone is not allowed to install unknown apps from this source"*:
   - Tap **Settings** in the popup.
   - Toggle on **"Allow from this source"** for Chrome (or Files).
   - Press the **Back** button.

### Step 3: Complete Installation
1. Tap **"Install"** on the installation dialog.
2. Once installed, tap **"Open"**.
3. FocusPUP will launch as a full native application with cozy pixel art animations, timer haptics, and ambient study sounds!

---

## 4. Alternative: EAS Cloud Build (`eas.json`)

If you prefer building through Expo's official EAS Cloud servers:
1. Install EAS CLI: `npm install -g eas-cli`
2. Log in with your Expo account: `eas login`
3. Run the standalone APK build:
   ```bash
   eas build --platform android --profile preview
   ```
4. EAS will provide a direct download link and QR code in your terminal. Scan the QR code with your Android phone camera to download the APK immediately!
