# Rayudu Gari Hotel — Table Booking Demo

Two web apps backed by Firebase + Razorpay (test mode):
- **`customer_web/`** — Mobile-responsive React web app for customers
- **`admin_dashboard/`** — React admin dashboard for staff
- **`firebase/`** — Firestore rules & indexes

---

## STEP 1 — Firebase Setup

### 1.1 Create Firebase Project
1. https://console.firebase.google.com → Create project → e.g. `rayudu-gari-hotel`

### 1.2 Enable Authentication
- Firebase Console → Authentication → Sign-in method
- Enable **Phone** (for customer OTP login)
- Enable **Email/Password** (for admin login)

### 1.3 Add Test Phone Numbers (Required for demo)
- Authentication → Sign-in method → Phone → "Phone numbers for testing" (scroll down)
- Add: `+91 9999999999` → OTP: `123456`
- Add: `+91 8888888888` → OTP: `654321`
- (Add more as needed)

### 1.4 Enable Firestore
- Firestore Database → Create database → **Start in production mode**
- Choose a region (e.g., `asia-south1` for India)

### 1.5 Deploy Firestore Rules
```bash
npm install -g firebase-tools
firebase login
cd firebase
firebase use --add        # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

### 1.6 Create Admin Account
- Firebase Console → Authentication → Users → Add user
- Email: `admin@rayudugarihotel.com`  Password: `Admin@2024!`

### 1.7 Register Web Apps
- Project Settings → Add app → Web app
- Register **two** web apps (one for customer, one for admin — or share one)
- Copy the `firebaseConfig` object from SDK snippet

---

## STEP 2 — Add Firebase Config

### Customer app
Open `customer_web/src/firebase/config.js` and replace `YOUR_*` placeholders with your Firebase config values.

### Admin dashboard
Open `admin_dashboard/src/firebase/config.js` — paste the **same** config values.

---

## STEP 3 — Razorpay Setup

1. Sign up at https://dashboard.razorpay.com (free)
2. Toggle to **Test Mode** in the top bar
3. Settings → API Keys → Generate Test Key
4. Copy the **Key ID** (starts with `rzp_test_`)
5. Open `customer_web/src/pages/PaymentPage.jsx` line 5:
   ```js
   const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_HERE';
   ```
   Replace with your test key.

**Test payment details:**
| Method | Details |
|--------|---------|
| Card | `5267 3181 8797 5449` • Expiry: `12/26` • CVV: `123` |
| Card OTP | `1234` |
| UPI | `success@razorpay` |

---

## STEP 4 — Run the Apps

### Customer Web App (port 5173)
```bash
cd customer_web
npm install
npm run dev
```
Open http://localhost:5173

### Admin Dashboard (port 5174)
```bash
cd admin_dashboard
npm install
npm run dev
```
Open http://localhost:5174

---

## App Flow

### Customer App Screens
```
/ (Splash) → /register (Phone + Name + State/City form)
           → /otp (6-digit OTP + 30s resend timer)
           → /home (Restaurant banner + Book a Table CTA)
           → /book (Persons stepper + Date + Time slot)
           → /payment (Razorpay checkout)
           → /confirmation (Booking ID shown)
           → /bookings (List all past bookings)
           → /profile (View/edit profile + Sign out)
```

### Admin Dashboard Pages
```
/login     → Email/password sign-in
/dashboard → Stats: users, bookings, revenue + recent 5 bookings
/users     → Full users table with search + state filter
/bookings  → Full bookings table with search + status/payment filters
             → Confirm / Cancel / Complete actions per booking
             → Export all filtered bookings to CSV
```

---

## Firestore Collections

### `users`
| Field | Type | Notes |
|-------|------|-------|
| uid | string | Firebase UID |
| name | string | Full name |
| mobileNumber | string | 10-digit |
| state | string | Indian state |
| city | string | City |
| createdAt | timestamp | |

### `bookings`
| Field | Type | Notes |
|-------|------|-------|
| bookingId | string | `BK-XXXXXX` |
| uid | string | Customer Firebase UID |
| userName | string | |
| mobileNumber | string | |
| numberOfPersons | number | 1–20 |
| date | string | YYYY-MM-DD |
| timeSlot | string | e.g. `7:00 PM – 8:00 PM` |
| notes | string | Optional |
| paymentStatus | string | `success` / `failed` |
| paymentId | string | Razorpay payment ID |
| paymentAmount | number | 100 |
| bookingStatus | string | `pending` / `confirmed` / `cancelled` / `completed` |
| createdAt | timestamp | |

---

## Notes & Caveats
- **Firebase Phone Auth** requires Blaze (pay-as-you-go) plan for SMS in production. For demo, always use Firebase test phone numbers.
- **reCAPTCHA** is set to invisible mode — no UI is shown but it's required by Firebase for OTP.
- Razorpay is in **TEST MODE** — no real money is charged.
- Firestore rules use email vs. phone auth to distinguish admins from customers.
- For production, tighten the rules and add custom claims for admin role.
