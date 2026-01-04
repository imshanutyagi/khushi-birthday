# 🎉 Happy Birthday Khushi - Interactive Birthday Website

A romantic, interactive birthday celebration website built with Next.js, TypeScript, Firebase, and beautiful animations.

## ✨ Features

### 6 Interactive Pages
1. **Intro Page** - Beautiful birthday greeting with confetti and animations
2. **Cake Cutting** - Interactive swipe gesture to cut the cake with music
3. **Best Wishes** - Heartfelt birthday message with floating hearts
4. **Promises** - Reveal promises one by one with animations
5. **Gift Selection** - Choose ONE gift from 6 beautiful options
6. **Luck & Shuffle Game** - Shuffle boxes and open 2 to reveal gifts

### Admin Panel
- Edit ALL page texts and content
- Upload birthday song, clap sound, and cake image
- Manage gifts (add, edit, delete, enable/disable)
- Upload multiple images per gift
- Create custom text gift (6th gift option)
- View user analytics and selections
- Track which gifts were selected and opened
- Reset/delete analytics data

### Design Features
- 🎨 Romantic pink/purple gradient theme
- 🎈 Animated balloons and floating hearts
- 🎊 Confetti effects
- ✨ Sparkle and glow animations
- 📱 Fully responsive (mobile, tablet, desktop)
- 👆 Touch & swipe optimized
- 🎵 Background music support
- 🔊 Sound effects

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Backend:** Firebase (Firestore + Storage)
- **Gestures:** React Swipeable
- **Effects:** Canvas Confetti

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Firebase account

### Steps

1. **Clone or navigate to the project**
```bash
cd "c:\Users\shanu\Downloads\birthday website"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use existing)
   - Enable **Firestore Database**
   - Enable **Storage**
   - Get your Firebase config from Project Settings

4. **Create environment file**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

5. **Set up Firestore Database**
   - In Firebase Console, go to Firestore Database
   - Create database in production mode
   - Set up security rules:
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

6. **Set up Storage**
   - In Firebase Console, go to Storage
   - Set up security rules:
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

7. **Run development server**
```bash
npm run dev
```

8. **Open browser**
   - Visit http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## 🎛️ Admin Panel Usage

### First Time Setup

1. Navigate to `/admin`
2. Enter admin password (from `.env`)
3. Go to **Gifts** tab and add at least 6 gifts
4. Go to **Content** tab to customize all texts
5. Upload birthday song, clap sound, and cake image

### Managing Content

**Content Tab:**
- Edit all page texts
- Upload media files (images, audio)
- Customize messages, promises, and titles

**Gifts Tab:**
- Add new gifts (click "Add Gift")
- Edit existing gifts (title, description, images)
- Enable/disable gifts
- Set display order
- Mark one gift as "Custom Text Gift" for 6th option

**Analytics Tab:**
- View user selections
- See which gift was chosen on Page 5
- See which 2 gifts were opened on Page 6
- Delete individual records
- Track timestamps

## 🎁 Gift Management

Each gift has:
- **Title**: Short name
- **Description**: Brief description
- **Images**: Multiple images (upload via admin)
- **Order**: Display position (0-5)
- **Enabled**: Show/hide gift
- **Custom Text**: For special text-based gift (6th option)

## 📱 Mobile Optimization

- Touch-friendly buttons and interactions
- Swipe gesture for cake cutting
- Responsive layouts for all screen sizes
- Optimized images and animations
- No horizontal scroll
- Large tap targets

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Other Platforms

Works on:
- Netlify
- Railway
- Render
- Any Node.js hosting

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the romantic color scheme:
```typescript
colors: {
  romantic: {
    // Your custom colors
  }
}
```

### Fonts
Edit `src/app/layout.tsx` to change fonts:
```typescript
import { YourFont } from "next/font/google";
```

### Animations
Adjust animation durations in individual page files or `globals.css`

## 📁 Project Structure

```
birthday-website/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Page 1 - Intro
│   │   ├── cake/page.tsx      # Page 2 - Cake Cutting
│   │   ├── wishes/page.tsx    # Page 3 - Wishes
│   │   ├── promises/page.tsx  # Page 4 - Promises
│   │   ├── gifts/page.tsx     # Page 5 - Gift Selection
│   │   ├── luck/page.tsx      # Page 6 - Luck Game
│   │   ├── admin/page.tsx     # Admin Panel
│   │   ├── layout.tsx         # Root Layout
│   │   └── globals.css        # Global Styles
│   ├── components/
│   │   ├── Balloons.tsx       # Balloon animation
│   │   ├── ConfettiEffect.tsx # Confetti effect
│   │   └── FloatingHearts.tsx # Floating hearts
│   └── lib/
│       ├── firebase.ts        # Firebase config
│       ├── db.ts             # Database functions
│       └── types.ts          # TypeScript types
├── public/                   # Static files
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🎵 Adding Media

### Birthday Song
1. Go to `/admin`
2. Content tab → Page 2 section
3. Upload MP3 file under "Birthday Song"

### Clap Sound
1. Go to `/admin`
2. Content tab → Page 2 section
3. Upload MP3 file under "Clap Sound"

### Cake Image
1. Go to `/admin`
2. Content tab → Page 2 section
3. Upload image under "Cake Image"

### Gift Images
1. Go to `/admin`
2. Gifts tab → Edit gift
3. Upload images (feature to be added)

## 🐛 Troubleshooting

**Firebase errors:**
- Check environment variables in `.env`
- Verify Firebase project is created
- Check Firestore and Storage are enabled

**Audio not playing:**
- Some browsers block autoplay
- User must interact first (click button)
- Check file format (MP3 recommended)

**Images not loading:**
- Check Firebase Storage rules
- Verify upload was successful
- Check file size (keep under 5MB)

**Admin panel not accessible:**
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env`
- Clear browser cache
- Try incognito mode

## 📝 Default Admin Password

Default: `admin123` (change in `.env`)

## 💝 For Khushi

This website was built with love for your special day. Every animation, every color, every interaction was designed to make you smile. Happy Birthday! 🎂

## 🤝 Support

For issues or questions:
1. Check Firebase console for errors
2. Check browser console (F12)
3. Verify all environment variables
4. Ensure Firebase rules are set correctly

## 📄 License

This is a personal project. Feel free to customize for your own use!

---

Made with ❤️ for Khushi's Birthday
