# Flowventory - Vercel Deployment Guide

This project has been configured for deployment on Vercel using a monorepo structure.

## Project Structure

```
flowventory/
├── api/              # Backend (Node.js/Express)
│   ├── src/
│   │   ├── server.js # Main server file (Vercel-compatible)
│   │   ├── routes/   # API routes
│   │   ├── models/   # MongoDB models
│   │   └── middleware/# Auth middleware
│   └── package.json
├── frontend/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api/
│   │   └── types/
│   └── package.json
├── package.json      # Root package.json (monorepo)
├── vercel.json       # Vercel configuration
└── .env.example      # Environment variables template
```

## Environment Variables

### Required Environment Variables for Vercel:

1. **MONGO_URI** - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

2. **JWT_SECRET** - A secure secret key for JWT authentication
   - Generate a long, random string for production
   - Example: `your-super-secure-jwt-secret-key-here`

3. **FRONTEND_URL** - Your deployed frontend URL (for CORS)
   - This will be your Vercel deployment URL
   - Example: `https://flowventory.vercel.app`

### How to Set Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Select "Environment Variables"
4. Add each variable with its value
5. Make sure to select "Production", "Preview", and "Development" environments

## Deployment Steps

### 1. Connect to GitHub Repository

1. Push your code to GitHub if you haven't already
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Import"

### 2. Configure Environment Variables

Before deploying, add the environment variables mentioned above in your Vercel project settings.

### 3. Deploy

1. Vercel will automatically detect the monorepo structure
2. It will build both the frontend and API
3. Click "Deploy" to deploy to production

### 4. Update FRONTEND_URL

After the first deployment:
1. Copy your Vercel app URL (e.g., `https://flowventory-xyz.vercel.app`)
2. Go to Environment Variables in Vercel settings
3. Update `FRONTEND_URL` with your deployment URL
4. Redeploy the application

## Local Development

To run the project locally:

```bash
# Install root dependencies
npm install

# Run both frontend and backend
npm run dev

# Or run individually:
npm run dev --workspace=frontend
npm run dev --workspace=api
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` matches your deployed frontend URL exactly
2. **Database Connection**: Verify `MONGO_URI` is correct and your MongoDB cluster is accessible
3. **Build Failures**: Check that all dependencies are properly installed
4. **Environment Variables**: Ensure all required variables are set in Vercel

### Logs and Monitoring:

- Check Vercel function logs for API errors
- Monitor MongoDB Atlas for database connectivity
- Use browser developer tools for frontend debugging

## Features

- ✅ Full-stack MERN application
- ✅ JWT-based authentication
- ✅ MongoDB Atlas database
- ✅ Vercel serverless deployment
- ✅ CORS configuration for production
- ✅ Environment variable management
- ✅ Automatic deployment from GitHub

## Support

If you encounter any issues during deployment:
1. Check Vercel deployment logs
2. Verify environment variables
3. Ensure MongoDB connection is working
4. Review this README for configuration steps
