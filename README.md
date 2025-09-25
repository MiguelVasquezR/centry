# 📚 Letras Documental - Book Library Management System

A modern book library web application built with Next.js, TypeScript, Bulma CSS, Firebase, and RTK Query for state management.

## ✨ Features

- **📖 Book Management**: Add, view, edit, and delete books
- **🔍 Search & Filter**: Real-time search and filter by book type and location
- **📱 Responsive Design**: Mobile-first design with Bulma CSS framework
- **🖼️ Image Upload**: Cloudinary integration for book cover images
- **🔥 Firebase Integration**: Real-time database with Firestore
- **⚡ RTK Query**: Efficient state management and data fetching
- **📄 Pagination**: Browse large collections with ease
- **🎨 Modern UI**: Clean, modern interface with hover effects and animations

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (16+) installed on your machine.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_API_KEY=your_firebase_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_APP_ID=your_firebase_app_id
NEXT_PUBLIC_DATABASE_URL=your_firebase_database_url
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the application.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Bulma CSS Framework
- **State Management**: Redux Toolkit with RTK Query
- **Database**: Firebase Firestore
- **Image Storage**: Cloudinary
- **Form Validation**: React Hook Form with Zod
- **Icons**: Lucide React

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
