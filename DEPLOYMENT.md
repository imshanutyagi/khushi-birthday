# 🌐 Deployment Guide

This guide will help you deploy your birthday website to the internet!

## Option 1: Vercel (Recommended - Easiest!)

Vercel is the creators of Next.js and offers the best deployment experience.

### Prerequisites
- GitHub account
- Code pushed to GitHub repository

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Birthday website for Khushi"
   git branch -M main
   git remote add origin https://github.com/yourusername/khushi-birthday.git
   git push -u origin main
   ```

2. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

4. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)

5. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
   NEXT_PUBLIC_ADMIN_PASSWORD = your_admin_password
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

7. **Get Your URL**
   - Vercel will give you a URL like: `khushi-birthday.vercel.app`
   - You can add a custom domain later

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Option 2: Netlify

### Steps

1. **Push to GitHub** (same as above)

2. **Sign up/Login to Netlify**
   - Go to https://www.netlify.com
   - Sign up with GitHub

3. **New Site from Git**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository

4. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Show advanced" → "New variable"

5. **Add Environment Variables**
   Same as Vercel (all NEXT_PUBLIC_* variables)

6. **Deploy**
   - Click "Deploy site"
   - Your site is live!

## Option 3: Railway

Railway offers generous free tier!

### Steps

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add Environment Variables**
   - Click "Variables" tab
   - Add all NEXT_PUBLIC_* variables

4. **Deploy**
   - Railway auto-deploys
   - Get your URL from settings

## Option 4: Self Hosting (VPS/Cloud)

For more control, deploy to your own server.

### Requirements
- VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Node.js 18+ installed
- Domain name (optional)

### Steps

1. **SSH into Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/khushi-birthday.git
   cd khushi-birthday
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Create .env File**
   ```bash
   nano .env
   ```
   Add all your environment variables

6. **Build**
   ```bash
   npm run build
   ```

7. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

8. **Start Application**
   ```bash
   pm2 start npm --name "birthday-website" -- start
   pm2 save
   pm2 startup
   ```

9. **Set up Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/birthday
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/birthday /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **SSL Certificate (Optional)**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

## Post-Deployment Checklist

✅ Website loads correctly
✅ All pages work (1-6 + admin)
✅ Images load properly
✅ Audio plays
✅ Swipe gesture works on mobile
✅ Admin panel accessible
✅ Can edit content in admin
✅ Can add/edit gifts
✅ Analytics tracking works
✅ Mobile responsive
✅ Fast loading speed

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Run `npm install` again
- Check environment variables are set

### 404 on Page Refresh
- Check your hosting supports Next.js App Router
- Vercel/Netlify handle this automatically
- For Nginx, ensure proxy configuration is correct

### Images Not Loading
- Check Firebase Storage rules
- Verify environment variables
- Check browser console for errors

### Audio Not Playing
- Some hosts block autoplay
- Ensure files are uploaded to Firebase Storage
- Check browser console for errors

## Performance Optimization

### After Deployment

1. **Enable Compression**
   - Most hosts enable this by default
   - Check response headers for `content-encoding: gzip`

2. **CDN**
   - Vercel includes CDN automatically
   - For self-hosted, use Cloudflare

3. **Image Optimization**
   - Next.js optimizes images automatically
   - Ensure images in Firebase are reasonable size

4. **Caching**
   - Static assets cached automatically
   - Firebase caching enabled by default

## Updating the Website

### For Vercel/Netlify/Railway
Just push to GitHub:
```bash
git add .
git commit -m "Update content"
git push
```
Auto-deploys in 2-3 minutes!

### For Self-Hosted
```bash
ssh user@your-server-ip
cd khushi-birthday
git pull
npm install
npm run build
pm2 restart birthday-website
```

## Monitoring

### Vercel
- Built-in analytics
- View deployments, errors, performance

### Self-Hosted
- Use PM2 monitoring:
  ```bash
  pm2 monit
  pm2 logs birthday-website
  ```

## Cost Estimates

| Platform | Free Tier | Paid |
|----------|-----------|------|
| Vercel | 100GB bandwidth/mo | $20/mo |
| Netlify | 100GB bandwidth/mo | $19/mo |
| Railway | $5 free credit/mo | Usage-based |
| VPS | N/A | $5-20/mo |

**Recommendation:** Use Vercel free tier - perfect for personal projects!

## Security Notes

1. **Never commit `.env` file**
2. **Use strong admin password**
3. **Update Firebase rules for production:**
   ```javascript
   // More restrictive rules for production
   match /settings/{document} {
     allow read: true;
     allow write: if request.auth != null; // Only authenticated users
   }
   ```
4. **Enable Firebase App Check** (optional, advanced)

## Need Help?

- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Railway: https://docs.railway.app
- Firebase: https://firebase.google.com/docs

---

🎉 Enjoy your deployed birthday website!
