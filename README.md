# 🚔 SafeCity: Community Crime Reporting Web App 🌍

SafeCity is a web application designed to empower communities by providing a centralized platform for reporting, tracking, and analyzing crime incidents. It allows users to submit crime reports, track their status, and view crime trends through interactive charts. By addressing the challenges of traditional crime reporting methods, such as misinformation and delays, SafeCity helps citizens stay informed about ongoing investigations while enabling law enforcement to efficiently manage and analyze crime data. With real-time updates and an intuitive dashboard, SafeCity enhances community safety and fosters better-informed decision-making for both citizens and authorities.

## Authors

- zhoda-lii
- AronLimos
- kianaaxd

## Installation & Setup

Follow these steps to set up and run the SafeCity application:

### 1. Prepare MongoDB Database

Prepare the MongoDB database by inserting initial values for backend operations.

#### 1.1 Open **mongosh** and select the database:

```bash
mongosh
use safecity
```

#### 1.2 Insert values for locations, categories and statuses:

```
db.locations.insertMany([{ name: "North" }, { name: "South" }, { name: "East" }, { name: "West" }, { name: "NorthEast" }, { name: "NorthWest" }, { name: "SouthEast" }, { name: "SouthWest" }]); db.categories.insertMany([{ name: "Dangerous" }, { name: "Neutral" }, { name: "Safe" }]); db.status.insertMany([{ name: "Under Investigation" }, { name: "Resolved" }, { name: "Dismissed" }]);
```

#### 1.3 Import `safecity.users.json` from the miscellaneous folder using MongoDBCompass  

#### 1.4 Credentials of safecity.users.json

- Citizen User (Email and Password)

```
citizen@example.com
```
```
password123
```

- Officer User (Email and Password)

```
officer@safecity.ca
```
```
rcmp123
```

- Admin User (Email and Password)

```
admin@safecity.ca
```
```
admin6467
```


### 2. Install Backend and Frontend Dependencies

#### 2.1 Backend
Navigate to the backend folder and directly install the backend dependencies (given that package.json is present).

```bash
cd backend/
npm install
```

If no package.json, install one by one:

```
npm init -y
```
```
npm install bcryptjs body-parser cors dotenv express jsonwebtoken mongoose nodemon
```

#### 2.2 Frontend
Navigate to the frontend folder and directly install the backend dependencies (given that package.json is present).

```bash
cd frontend/
npm install
```

If no package.json, install one by one:

```
npm init -y
```
```
npm install react-router-dom axios jwt-decode chart.js react-chartjs-2
```
or
```
npm init -y
```
```
npm install @coreui/coreui @coreui/react @testing-library/dom @testing-library/jest-dom @testing-library/react @testing-library/user-event axios chart.js jwt-decode
```

### 3. Run the application

#### 3.1 Backend
Start the backend server.

```bash
cd backend/
nodemon server.js
```

#### 3.2 Frontend
Start the frontend application.

```bash
cd frontend/
npm start
```