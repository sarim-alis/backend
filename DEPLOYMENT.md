# Deploying PartyMeet Backend on Render

This guide will walk you through deploying your PartyMeet backend API on Render.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Render account (sign up at [render.com](https://render.com))
3. MongoDB database (MongoDB Atlas recommended for production)

## Step-by-Step Deployment Guide

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a new Blueprint on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**
   After the service is created, go to the service settings and add these environment variables:
   - `DATABASE_URL` - Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/partymeet`)
   - `JWT_SECRET` - A secure random string for JWT token signing
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `NODE_ENV` - Set to `production`
   - `PORT` - Will be automatically set by Render (you can leave this or set to 5000)

4. **Deploy**
   - Click "Apply" to deploy your service
   - Render will build and deploy your application
   - Your API will be available at `https://your-service-name.onrender.com`

### Option 2: Manual Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend code

3. **Configure the Service**
   - **Name**: `partymeet-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose the closest region to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or specify if your backend is in a subdirectory)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade for better performance)

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/partymeet
   JWT_SECRET=your-super-secret-jwt-key-here
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait for the deployment to complete (usually 2-5 minutes)

## Setting Up MongoDB Atlas (If needed)

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select a region close to your Render service region

3. **Configure Database Access**
   - Go to "Database Access"
   - Create a database user with username and password
   - Save the credentials securely

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add Render's IP ranges)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use this as your `DATABASE_URL` in Render

## Post-Deployment

1. **Test Your API**
   - Visit `https://your-service-name.onrender.com/`
   - You should see: "PartyMeet API running 🎉"
   - Test your endpoints using Postman or your frontend

2. **Monitor Logs**
   - Go to your service on Render Dashboard
   - Click "Logs" to view real-time logs
   - Check for any errors or warnings

3. **Update CORS Settings (if needed)**
   - If you have a frontend, update your CORS configuration in `index.js`
   - Add your frontend URL to the CORS allowed origins

## Important Notes

- **Free Tier Limitations**: 
  - Services on the free tier spin down after 15 minutes of inactivity
  - First request after spin-down may take 30-60 seconds
  - Consider upgrading to a paid plan for production use

- **Environment Variables**: 
  - Never commit `.env` files to GitHub
  - Always use Render's environment variables for sensitive data

- **Database**: 
  - MongoDB Atlas free tier is suitable for development
  - Consider upgrading for production workloads

- **HTTPS**: 
  - Render automatically provides HTTPS for all services
  - Your API will be accessible via `https://your-service.onrender.com`

## Troubleshooting

### Service won't start
- Check the logs in Render Dashboard
- Verify all environment variables are set correctly
- Ensure `DATABASE_URL` is valid and accessible

### Database connection errors
- Verify MongoDB Atlas network access allows Render's IPs
- Check that database credentials are correct
- Ensure the connection string format is correct

### Build failures
- Check that `package.json` has the correct start script
- Verify all dependencies are listed in `package.json`
- Check build logs for specific error messages

## Updating Your Deployment

1. Push changes to your GitHub repository
2. Render will automatically detect changes and redeploy
3. Monitor the deployment in the Render Dashboard

## Support

For more information, visit:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
