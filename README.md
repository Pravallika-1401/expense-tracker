# 💰 SpendWise — Smart Expense Tracker

Full stack project: Spring Boot + React Vite + Tailwind + MySQL + Framer Motion

---

## 🛠️ Setup Instructions

### Step 1 — MySQL Database
Open MySQL Workbench and run:
```sql
CREATE DATABASE expense_tracker_db;
```

### Step 2 — Backend Setup
1. Open `backend/` folder in VS Code or IntelliJ
2. Open `src/main/resources/application.properties`
3. Change `your_password_here` to your MySQL root password
4. Run the project:

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: http://localhost:8080

### Step 3 — Frontend Setup
Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: http://localhost:5173

---

## ✨ Features
- JWT Authentication (Register / Login)
- Add Income & Expense transactions
- Category-wise breakdown (Pie Chart)
- Monthly Income vs Expense (Bar Chart)
- Delete transactions
- Animated UI with Framer Motion
- Dark theme glassmorphism design

## 📋 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/transactions | All transactions |
| POST | /api/transactions | Add transaction |
| GET | /api/transactions/summary | Balance summary |
| GET | /api/transactions/category-breakdown | Pie chart data |
| GET | /api/transactions/monthly-summary | Bar chart data |
| DELETE | /api/transactions/{id} | Delete transaction |

## 🎯 Interview Points
- "Used Spring Security + JWT for stateless authentication"
- "Implemented role-based endpoint protection in SecurityConfig"
- "Used JPA repository custom queries for aggregated data"
- "Built responsive React dashboard with Recharts for data visualization"
- "Framer Motion for smooth page transitions and micro-interactions"
- "Axios interceptors for automatic token attachment and 401 handling"
