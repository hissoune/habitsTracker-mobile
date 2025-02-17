# MyHabit - Collaborative Habit-Tracking and Challenge Platform

MyHabit is a platform designed to help individuals form better habits through accountability and friendly competition. Users can create habit goals, join challenges, and track their progress, either solo or with a team.

## 📱 MyHabit (Mobile Version - React Native with Expo)

### 📝 Features

1. **Habit Creation and Tracking**
   - Set personal habits (e.g., "Drink 2L of water daily" or "Code for 2 hours").
   - Receive daily reminders via push notifications.

2. **Team Challenges**
   - Create or join group challenges (e.g., "30-day fitness challenge").
   - Real-time leaderboards to rank participants based on consistency.

3. **Accountability Partners**
   - Pair up with another user for mutual accountability.
   - In-app chat for sharing progress updates.

4. **Gamification**
   - Earn points, badges, and streaks for completing habits or winning challenges.
   - Unlock rewards like custom habit themes or exclusive challenges.

5. **Analytics and Insights**
   - Weekly and monthly reports showing habit progress and consistency.

6. **Public and Private Goals**
   - Set habits as public to inspire others or private for personal tracking.
   - Share progress with social media integration.

7. **Multi-Device Syncing**
   - Sync habit progress across web and mobile.

8. **Admin Tools**
   - Moderate public challenges, manage users, and review flagged content.

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React Native**: For building cross-platform mobile applications.
- **Expo**: For faster development and deployment.
- **Socket.IO**: For real-time updates on challenge leaderboards.
- **React Navigation**: For seamless navigation between screens.
- **Redux Toolkit**: For state management.

### Backend
- **NestJS**: For building RESTful APIs, WebSockets (real-time updates), and scheduling reminders.
- **MongoDB**: For storing user data, habits, and challenge progress.

---

## 📦 Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI (v6 or higher)
- MongoDB (local or remote)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/myhabit-mobile.git
cd myhabit-mobile
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory and add the following:

```
API_URL=https://your-api-endpoint.com
SOCKET_URL=https://your-socket-endpoint.com
EXPO_PUSH_API=https://exp.host/--/api/v2/push/send
```

### Step 4: Start the Expo Development Server
```bash
npx expo start
```

---

## 📲 Running the App

1. **In Emulator**: Select an emulator from the Expo CLI dashboard.
2. **On Physical Device**: Scan the QR code using the Expo Go app.

---

## 📚 Project Structure

```
myhabit-mobile/
├── assets/                # Static assets (icons, images)
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Application screens
│   ├── navigation/       # App navigation (React Navigation setup)
│   ├── store/            # Redux state management
│   ├── services/         # API and socket integration
│   └── utils/            # Utility functions
├── App.js                # Root component
├── .env                  # Environment variables
└── package.json          # Dependencies and scripts
```

---

## ✅ Key Commands

- **Start Development Server**: `npx expo start`
- **Run Tests**: `npm test`
- **Build APK (Android)**: `eas build --platform android`
- **Build IPA (iOS)**: `eas build --platform ios`

---

## 🔍 API Integration
Ensure your backend is running and properly connected:

1. User Authentication (JWT-based)
2. Habit Management (Create, Update, Delete)
3. Challenge Participation and Leaderboard
4. Real-time Notifications (via Socket.IO)

---

## 📤 Deployment

1. **Expo Publish**: `npx expo publish`
2. **EAS Build**: `eas build --profile production`

---

## 📧 Support
For issues or feature requests, please open an [issue](https://github.com/your-username/myhabit-mobile/issues) or contact `support@myhabit.com`.

---

## 📃 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

