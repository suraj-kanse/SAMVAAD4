<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HnyqaIoXG1ScCCOs3TwKWZYhE7_eRPTC

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   `npm run dev`

## ☁️ Cloud Database Setup (MongoDB Atlas)

To ensure data persists across updates and deployments, use a Cloud Database:

1.  **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up (Free Tier is sufficient).
2.  **Create a Cluster**: Build a new cluster (Shared / Free).
3.  **Database Access**: Create a Database User (username/password). **Note these configuration details.**
4.  **Network Access**: Allow access from anywhere (`0.0.0.0/0`) for easiest connectivity, or whitelist your specific IP.
5.  **Get Connection String**:
    -   Click "Connect" -> "Connect your application".
    -   Copy the connection string (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`).
6.  **Configure Project**:
    -   Create a `.env` file in the project root (copy `.env.example`).
    -   Set `MONGO_URI` to your connection string.

## 🚀 Production Deployment

To deploy this project (e.g., to Render, Vercel, or Heroku):

1.  **Build Command**: `npm install && npm run build`
2.  **Start Command**: `node server/server.cjs`
3.  **Environment Variables**: Add `MONGO_URI` in your host's dashboard.
