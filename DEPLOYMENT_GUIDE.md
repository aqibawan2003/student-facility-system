# Student Facility System - Complete Deployment Guide

## Project Owner: AQIB AWAN
- **Email:** aqibawan0102@gmail.com
- **Phone:** +92-310-4693600
- **Location:** Shalimar College, Lahore, Pakistan

---

## 🎉 ADMIN PANEL ADDED SUCCESSFULLY!

### Admin Panel Features:
✅ **Admin Authentication** - Login system for admin
✅ **Approve/Reject Hostel Owners** - Manage hostel owner registrations
✅ **Approve/Reject Kitchen Owners** - Manage kitchen owner registrations
✅ **Ban Students** - Temporarily ban student accounts
✅ **Delete Students** - Permanently remove student accounts
✅ **Ban/Delete Hostel Owners** - Manage hostel owner accounts
✅ **Ban/Delete Kitchen Owners** - Manage kitchen owner accounts
✅ **Remove Hostels** - Delete specific hostel properties
✅ **Remove Kitchens** - Delete specific kitchen/dishes
✅ **Dashboard Statistics** - View all system metrics
✅ **Pending Registrations** - Track approval queue

---

## 📊 Message Count
You've sent approximately **200+ messages/prompts** in this entire session.

---

## 💰 Currency Conversion Status
✅ **100% Complete** - All USD payments converted to PKR (Pakistani Rupees) throughout:
- Hostel room prices
- Food item prices
- Checkout pages
- Payment summaries
- All displays and calculations

---

## 🚀 GitHub Repository
**Repository:** https://github.com/aqibawan2003/student-facility-system
**Branch:** main
**Status:** ✅ All code pushed successfully

### Latest Commits:
1. Complete Student Facility System with all features
2. Admin Panel with full functionality
3. Vercel deployment configuration

---

## 🌐 Admin Panel Access

### Admin Routes:
- **Login:** `/admin/login`
- **Dashboard:** `/admin/dashboard`

### Admin Backend API Endpoints:
```
POST   /api/admin/register              # Register new admin
POST   /api/admin/login                 # Admin login
GET    /api/admin/stats                 # Dashboard statistics

# Student Management
GET    /api/admin/students              # Get all students
DELETE /api/admin/students/:id          # Delete student
PATCH  /api/admin/students/:id/ban      # Ban student

# Hostel Owner Management
GET    /api/admin/hostel-owners         # Get all hostel owners
PATCH  /api/admin/hostel-owners/:id/approve   # Approve registration
DELETE /api/admin/hostel-owners/:id/reject    # Reject registration
PATCH  /api/admin/hostel-owners/:id/ban       # Ban hostel owner
DELETE /api/admin/hostel-owners/:id           # Delete hostel owner

# Kitchen Owner Management
GET    /api/admin/kitchen-owners        # Get all kitchen owners
PATCH  /api/admin/kitchen-owners/:id/approve  # Approve registration
DELETE /api/admin/kitchen-owners/:id/reject   # Reject registration
PATCH  /api/admin/kitchen-owners/:id/ban      # Ban kitchen owner
DELETE /api/admin/kitchen-owners/:id          # Delete kitchen owner

# Property Management
GET    /api/admin/hostels               # Get all hostels
DELETE /api/admin/hostels/:id           # Remove hostel

GET    /api/admin/kitchens              # Get all kitchens
DELETE /api/admin/kitchens/:id          # Remove kitchen
```

---

## 📦 Code Download
**Google Drive:** https://drive.google.com/uc?export=download&id=1h_ejPY3DFW7L99VRfDz9Pj60VInKQhaR
**File:** student-facility-system-with-admin.tar.gz
**Size:** 21 MB

---

## 🔧 Environment Variables

### Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb+srv://sfs-01:welcome1@cluster0.xzdlyxo.mongodb.net/sfs
EMAIL=aqibawan0102@gmail.com
APP_PASSWORD=arpt jbzg fvcj pzkg
STRIPE_SECRET_KEY2=sk_test_51T48io39BdlX6Ndf4XuDOSZRlmCrDTklV4MOg9VVFV8AIRttuLqJTOoK2jGb5HnYwkH9Sshjbiu6LkCp8J4HLwZS002A79YNEg
STRIPE_SECRET_KEY_ORDER=sk_test_51T48io39BdlX6Ndf4XuDOSZRlmCrDTklV4MOg9VVFV8AIRttuLqJTOoK2jGb5HnYwkH9Sshjbiu6LkCp8J4HLwZS002A79YNEg
JWT_SECRET=student_facility_system
```

### Frontend (.env):
```env
REACT_APP_API_URL=https://student-facility-system-backend.vercel.app
```

---

## 🌐 Deployment to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

#### Backend Deployment:
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `aqibawan2003/student-facility-system`
4. Set **Root Directory** to `backend`
5. Add Environment Variables (from above)
6. Click "Deploy"
7. Note the deployment URL (e.g., https://student-facility-system-backend.vercel.app)

#### Frontend Deployment:
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import the same GitHub repository
4. Set **Root Directory** to `frontend`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = (your backend URL from step 7)
6. Click "Deploy"

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy Backend
cd backend
vercel --prod

# Deploy Frontend
cd ../frontend
vercel --prod
```

---

## 🗄️ MongoDB Database

**Connection String:** mongodb+srv://sfs-01:welcome1@cluster0.xzdlyxo.mongodb.net/sfs

### Collections:
- **Admin** - Admin users
- **Student** - Student accounts (with isBanned, status fields)
- **HostelOwner** - Hostel owners (with isApproved, isBanned, status fields)
- **KitchenOwner** - Kitchen owners (with isApproved, isBanned, status fields)
- **Hostelroom** - Hostel properties
- **Dish** - Food items
- **Booking** - Room bookings
- **Order** - Food orders

**Important:** Make sure to whitelist your IP address in MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Navigate to Network Access
3. Click "Add IP Address"
4. Add `0.0.0.0/0` (allow from anywhere) or specific IPs

---

## 📱 Testing the Application

### Test Accounts (Create these first):

#### Admin Account:
```
POST /api/admin/register
{
  "first_name": "Admin",
  "last_name": "AQIB",
  "email": "admin@sfs.com",
  "password": "admin123",
  "confirmPassword": "admin123"
}
```

#### Test Student:
- Register via `/register` page
- Verify email with OTP
- Login and test booking/ordering

#### Test Hostel Owner:
- Register as hostel owner
- Wait for admin approval
- After approval, add hostels and rooms

#### Test Kitchen Owner:
- Register as kitchen owner
- Wait for admin approval
- After approval, add dishes and manage orders

---

## 🎯 Key Features Checklist

### Student Features:
- [x] Register and login
- [x] Browse hostels with map and filters
- [x] Book hostel rooms (select beds)
- [x] Browse kitchens and dishes
- [x] Add to cart and place orders
- [x] Stripe payment integration (PKR)
- [x] JazzCash & EasyPaisa (locked/pending for future)
- [x] Chatbot assistance (Pakistan-specific)
- [x] View booking/order history
- [x] Profile management

### Hostel Owner Features:
- [x] Register with hostel details
- [x] Pending approval by admin
- [x] Add/edit/delete rooms
- [x] Add beds to rooms
- [x] View bookings
- [x] Dashboard with statistics
- [x] Profile management

### Kitchen Owner Features:
- [x] Register with kitchen details
- [x] Pending approval by admin
- [x] Add/edit/delete dishes (with prices in PKR)
- [x] View orders
- [x] Update order status
- [x] Dashboard with statistics
- [x] Profile management

### Admin Features:
- [x] Admin login
- [x] Dashboard with complete statistics
- [x] View all students
- [x] Ban/delete students
- [x] Approve/reject hostel owner registrations
- [x] Approve/reject kitchen owner registrations
- [x] Ban/delete hostel owners
- [x] Ban/delete kitchen owners
- [x] Remove specific hostels
- [x] Remove specific kitchens
- [x] View pending registrations

---

## 🔐 Security Notes

1. **.env files** are in .gitignore (not pushed to GitHub)
2. **JWT tokens** for authentication
3. **bcrypt** for password hashing
4. **Email verification** required for registration
5. **Admin approval** required for hostel/kitchen owners
6. **Stripe test mode** - Use test cards only

### Stripe Test Card:
```
Card Number: 4242 4242 4242 4242
Expiration: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

---

## 🐛 Known Issues & Fixes

### Issue: "Network Error" on frontend
**Fix:** Make sure `REACT_APP_API_URL` environment variable is set correctly in Vercel

### Issue: "CORS Error"
**Fix:** Backend server.js already has CORS configured for all origins

### Issue: "MongoDB connection failed"
**Fix:** Whitelist IP address in MongoDB Atlas Network Access

### Issue: Stripe "IP restricted"
**Fix:** Remove IP restrictions from Stripe dashboard for local testing

---

## 📞 Support & Contact

**Developer:** AQIB AWAN
**Email:** aqibawan0102@gmail.com
**Phone:** +92-310-4693600
**Location:** Shalimar College, Lahore, Pakistan

---

## 🎓 Final Year Project Information

**Project Title:** Student Facility System (SFS)
**Description:** A comprehensive platform for students to book hostel accommodations and order homemade food from verified kitchen owners.

**Technology Stack:**
- **Frontend:** React.js, Tailwind CSS, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Payment:** Stripe (PKR currency)
- **Deployment:** Vercel
- **Maps:** Google Maps API
- **Real-time:** Socket.io for chat

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [x] Admin Panel completed
- [x] All USD converted to PKR
- [x] Environment variables configured
- [x] Vercel configuration files added
- [x] MongoDB connection string updated
- [x] Contact information updated (AQIB AWAN)
- [x] README and documentation complete
- [ ] Deploy backend to Vercel (manual step)
- [ ] Deploy frontend to Vercel (manual step)
- [ ] Test all features on live site
- [ ] Create first admin account
- [ ] Test approval workflow

---

## 🚀 Next Steps

1. **Deploy to Vercel** using instructions above
2. **Create Admin Account** via `/api/admin/register`
3. **Test the complete workflow:**
   - Register hostel owner → Admin approves → Add rooms
   - Register kitchen owner → Admin approves → Add dishes
   - Register student → Book room → Order food
4. **Monitor** using admin dashboard
5. **Launch!** 🎉

---

**Good luck with your Final Year Project!** 💪

Built with ❤️ by AQIB AWAN
