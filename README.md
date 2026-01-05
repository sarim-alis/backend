# PartyMeet Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="mongodb://localhost:27017/partymeet"
# OR for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/partymeet"
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Database Setup
Make sure MongoDB is running locally or use MongoDB Atlas connection string in `.env`

### 4. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Routes (`/api/users`)

#### Register User
- **POST** `/api/users/register`
- **Body** (form-data):
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required, min 6 characters)
  - `image` (file, optional) - Profile image

#### Login
- **POST** `/api/users/login`
- **Body** (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns JWT token and user data

#### Get Profile (Protected)
- **GET** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`

#### Update Profile (Protected)
- **PUT** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (form-data):
  - `username` (string, optional)
  - `email` (string, optional)
  - `image` (file, optional) - New profile image

## Project Structure

```
backend/
├── src/
│   ├── controller/    # Request handlers
│   ├── service/       # Business logic
│   ├── routes/        # API routes
│   └── middleware/    # Auth middleware
├── utils/             # Utilities (Prisma, Cloudinary)
├── prisma/            # Database schema
└── index.js           # Server entry point
```

## User Model Schema

```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

