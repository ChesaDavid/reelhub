# ReelHub

A React-based movie and TV series streaming platform created after successfully passing the Romanian Baccalaureate exam (BAC 2024).

## Features

- Movie and TV series browsing
- Episode tracking for TV series
- YouTube video integration
- User authentication and favorites system
- Search functionality with easter eggs
- Ad system implementation
- Mobile responsive design
- Genre filtering and recommendations
- IMDb ratings and sorting

## Tech Stack

- React 19.0.0
- Firebase (Authentication & Firestore)
- Tailwind CSS
- YouTube iframe API
- React Router DOM

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/ChesaDavid/reelhub.git
cd reelhub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Firebase credentials:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:
```bash
npm start
```