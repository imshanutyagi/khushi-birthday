# 🗄️ MongoDB Setup Guide

This guide will help you set up MongoDB Atlas (cloud database) and Cloudinary (for file storage) for your birthday website.

## Why MongoDB?

✅ **Full control** over your data
✅ **Flexible schema** - easy to modify structure
✅ **Better querying** with powerful aggregations
✅ **No vendor lock-in** - can migrate easily
✅ **Free tier** - 512MB storage, perfect for this project
✅ **Fast & scalable** - handles millions of documents

## Prerequisites

- Email address
- No credit card needed for free tier!

---

## Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Click **"Sign Up"**
3. Choose one of:
   - Google account
   - GitHub account
   - Email & password

### 1.2 Create Organization (Auto-Created)
- Skip this step - auto-created with your account

### 1.3 Create Project
1. Click **"New Project"**
2. Name it: `birthday-website`
3. Click **"Next"** → **"Create Project"**

---

## Step 2: Create MongoDB Cluster

### 2.1 Build a Database
1. Click **"Build a Database"**
2. Choose **FREE** tier (M0 Sandbox)
3. Provider: **AWS** (recommended)
4. Region: Choose closest to you:
   - US: `us-east-1` (N. Virginia)
   - Europe: `eu-west-1` (Ireland)
   - Asia: `ap-south-1` (Mumbai)
5. Cluster Name: `birthday-cluster`
6. Click **"Create"**

### 2.2 Create Database User
1. Username: `birthdayapp` (or any name)
2. Password: Generate or create strong password
3. **SAVE THIS PASSWORD!** You'll need it for `.env`
4. Click **"Create User"**

### 2.3 Set Network Access
1. Choose **"My Local Environment"**
2. Click **"Add My Current IP Address"**
3. OR click **"Allow Access from Anywhere"** (easier for deployment)
   - IP: `0.0.0.0/0`
4. Click **"Finish and Close"**

---

## Step 3: Get Connection String

### 3.1 Connect to Cluster
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Version: **5.5 or later**

### 3.2 Copy Connection String
You'll see something like:
```
mongodb+srv://birthdayapp:<password>@birthday-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 3.3 Replace Password
Replace `<password>` with your actual password:
```
mongodb+srv://birthdayapp:YourActualPassword@birthday-cluster.xxxxx.mongodb.net/birthday-website?retryWrites=true&w=majority
```

**Important:** Add `/birthday-website` before the `?` to specify database name!

---

## Step 4: Set Up Cloudinary

### 4.1 Create Account
1. Go to https://cloudinary.com/users/register_free
2. Sign up with email
3. Verify your email

### 4.2 Get Credentials
1. Go to https://cloudinary.com/console
2. You'll see your **Dashboard**
3. Find these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 4.3 Copy Credentials
Click **"Copy to clipboard"** for each value

---

## Step 5: Configure Environment Variables

### 5.1 Create .env File
In your project root, create `.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://birthdayapp:YourPassword@birthday-cluster.xxxxx.mongodb.net/birthday-website?retryWrites=true&w=majority

# Cloudinary (for image/audio uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Admin Password
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 5.2 Replace Values
- `YourPassword` - Your MongoDB user password
- `birthday-cluster.xxxxx` - Your cluster URL
- `your_cloud_name_here` - From Cloudinary dashboard
- `your_api_key_here` - From Cloudinary dashboard
- `your_api_secret_here` - From Cloudinary dashboard
- `admin123` - Choose a strong admin password

---

## Step 6: Test Connection

### 6.1 Install Dependencies
```bash
npm install
```

### 6.2 Run Development Server
```bash
npm run dev
```

### 6.3 Check Console
You should see:
```
✅ MongoDB connected successfully
```

### 6.4 Visit Website
Open http://localhost:3000
- If you see the intro page → **SUCCESS!** ✅
- If you see errors → Check steps below

---

## Troubleshooting

### Error: "MONGODB_URI environment variable not defined"
**Fix:** Check your `.env` file exists in project root
```bash
ls -la .env  # Should show the file
```

### Error: "MongoServerError: bad auth"
**Fix:** Wrong username or password
1. Go to MongoDB Atlas → Database Access
2. Click "Edit" on your user
3. Reset password
4. Update `.env` with new password
5. Restart server: `npm run dev`

### Error: "Could not connect to any servers"
**Fix:** Network access issue
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (allows all)
3. Wait 2-3 minutes for update
4. Restart server

### Error: "Cloudinary configuration missing"
**Fix:** Check Cloudinary credentials
1. Verify all three values in `.env`
2. No quotes needed around values
3. No spaces in values

### Server starts but pages are blank
**Fix:**
1. Check browser console (F12)
2. Look for API errors
3. Make sure MongoDB is connected (check terminal)

---

## MongoDB Compass (Optional)

### View Your Database Visually
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Open Compass
3. Paste your connection string
4. Click "Connect"
5. Browse your `birthday-website` database

### Collections You'll See:
- `pagecontents` - Website content
- `gifts` - Gift data
- `selections` - User analytics

---

## Database Structure

### PageContent Collection
```javascript
{
  _id: ObjectId,
  introText1: String,
  introText2: String,
  // ... all page texts
  cakeImageUrl: String,
  birthdaySongUrl: String,
  updatedAt: Date
}
```

### Gifts Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  images: [String], // Cloudinary URLs
  enabled: Boolean,
  order: Number,
  isCustomText: Boolean,
  customText: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Selections Collection
```javascript
{
  _id: ObjectId,
  selectedGiftId: String,
  openedGiftIds: [String],
  timestamp: Number,
  userAgent: String,
  createdAt: Date
}
```

---

## Cost & Limits

### MongoDB Atlas (Free Tier)
- **Storage:** 512MB
- **RAM:** Shared
- **Bandwidth:** Unlimited
- **Perfect for:** Personal projects, 1000s of users

### Cloudinary (Free Tier)
- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month
- **Perfect for:** 100s of images/audio files

---

## Production Tips

### Security Best Practices
1. **Never commit `.env` file** - already in `.gitignore`
2. **Use strong admin password**
3. **Rotate passwords** every 3 months
4. **Limit network access** to specific IPs in production

### Performance Optimization
1. **Add indexes** for frequently queried fields:
```javascript
// In MongoDB Compass or Atlas UI
db.gifts.createIndex({ order: 1 })
db.selections.createIndex({ timestamp: -1 })
```

2. **Enable caching** (MongoDB Atlas auto-caches)
3. **Use CDN** for Cloudinary URLs (automatic)

---

## Migration from Firebase

Already have Firebase data? Here's how to migrate:

### Export Firebase Data
```javascript
// In Firebase Console
Firestore → Export → Select collections → Export
Storage → Download all files
```

### Import to MongoDB
```javascript
// Use MongoDB Compass
// Connect → Select database → Import data → Choose JSON
```

---

## Support & Resources

- **MongoDB Docs:** https://docs.mongodb.com
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Community Forum:** https://www.mongodb.com/community/forums

---

## Quick Reference

| Service | Free Tier | Limit |
|---------|-----------|-------|
| MongoDB Atlas | ✅ Yes | 512MB storage |
| Cloudinary | ✅ Yes | 25GB storage |
| Total Cost | **$0** | Forever free! |

---

## Next Steps

1. ✅ MongoDB connected
2. ✅ Cloudinary configured
3. → Go to `/admin` panel
4. → Add 6 gifts
5. → Upload images & audio
6. → Test all pages
7. → Deploy to Vercel!

Happy Birthday! 🎉

