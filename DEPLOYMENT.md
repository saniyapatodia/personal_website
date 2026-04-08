# Deployment Instructions

Your website is ready to be published! Here are the easiest ways to deploy it:

## Option 1: GitHub Pages (Recommended - Free)

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name it `personal_website` (or any name you prefer)
   - Make it public
   - Don't initialize with README

2. **Upload your files:**
   ```bash
   cd /Users/saniyapatodia/Desktop/Docs/Extra-Curriculars/personal_website
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/personal_website.git
   git push -u origin main
   ```
   (Replace YOUR_USERNAME with your GitHub username)

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be live at: `https://YOUR_USERNAME.github.io/personal_website/`

## Option 2: Netlify (Easiest - Free)

1. Go to https://www.netlify.com/
2. Sign up/login with GitHub
3. Drag and drop your `personal_website` folder onto Netlify
4. Your site will be live instantly with a random URL
5. You can customize the domain name in settings

## Option 3: Vercel (Free)

1. Go to https://vercel.com/
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository (or drag and drop)
5. Deploy - your site will be live instantly

## Option 4: Simple HTTP Server (For Testing)

If you just want to test it locally:
```bash
cd /Users/saniyapatodia/Desktop/Docs/Extra-Curriculars/personal_website
python3 -m http.server 8000
```
Then visit: http://localhost:8000

---

**Note:** All your files are ready. Just choose one of the deployment methods above!
