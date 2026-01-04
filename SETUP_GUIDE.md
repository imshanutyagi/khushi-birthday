# 🚀 Quick Setup Guide

Follow these steps to get your birthday website running in minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "khushi-birthday" (or any name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Firestore Database
1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose your location (closest to you)
5. Click "Enable"

### Enable Storage
1. In Firebase Console, click "Storage"
2. Click "Get started"
3. Click "Next" → "Done"

### Get Firebase Config
1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Name your app "Birthday Website"
5. Copy the config values

## Step 3: Create .env File

Create a file named `.env` in the root folder with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

Replace all `your_*` values with your actual Firebase config!

## Step 4: Set Firebase Rules

### Firestore Rules
1. Go to Firestore Database → Rules tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: true;
      allow write: true;
    }
  }
}
```
3. Click "Publish"

### Storage Rules
1. Go to Storage → Rules tab
2. Replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: true;
      allow write: true;
    }
  }
}
```
3. Click "Publish"

## Step 5: Run the Website

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 6: Set Up Admin Panel

1. Go to http://localhost:3000/admin
2. Enter your admin password (from `.env`)
3. Add 6 gifts in the "Gifts" tab
4. Customize content in the "Content" tab
5. Upload birthday song, clap sound, and cake image

## Step 7: Test Everything

1. Visit http://localhost:3000
2. Go through all 6 pages
3. Test cake cutting swipe
4. Test gift selection
5. Test shuffle game
6. Check admin panel analytics

## Step 8: Deploy (Optional)

### Deploy to Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Add environment variables from `.env`
6. Click "Deploy"

Done! Your website is live! 🎉

## Common Issues

**"Firebase not initialized"**
- Check `.env` file exists
- Verify all values are correct
- Restart dev server

**"Permission denied"**
- Check Firestore rules are published
- Check Storage rules are published

**Audio not playing**
- Upload audio files in admin panel
- Click somewhere on page first (browsers need user interaction)

**Images not showing**
- Check files uploaded successfully
- Check Firebase Storage rules
- Check file size (max 5MB recommended)

## Need Help?

Check the full README.md for detailed documentation!

---

Happy Birthday Khushi! 🎂💕
