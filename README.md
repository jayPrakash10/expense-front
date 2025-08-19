# Expense Tracker

A modern, responsive expense tracking application built with Next.js, React, and Firebase. This application helps users track their expenses, view analytics, and manage their finances effectively.

## ✨ Features

- 📱 Responsive design that works on all devices
- 📊 Visual analytics for monthly and yearly expenses
- 🔐 Secure authentication with Firebase
- 🌓 Light and dark mode support
- 📱 PWA support for mobile devices
- 📈 Expense categorization and filtering
- 📅 Date-based expense tracking

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 13+ with TypeScript
- **UI Components**: Radix UI Primitives
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React
- **Theming**: next-themes
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Firebase project (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/expense-front.git
   cd expense-front
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── components/           # Reusable UI components
├── constants/           # Application constants
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Application pages
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard page
│   ├── expenses/        # Expense management
│   └── settings/        # User settings
├── public/              # Static files
├── services/            # API services
├── store/               # Redux store and slices
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🌐 Deployment

This project is configured to deploy to GitHub Pages. To deploy:

1. Ensure all changes are committed
2. Run the build script:
   ```bash
   npm run build
   ```
3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

The application will be available at: [https://your-username.github.io/expense-front](https://your-username.github.io/expense-front)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
