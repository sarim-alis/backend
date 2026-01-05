# Postman API Testing Guide

## Base URL
```
/api/users/register
```

---

## 1. Register User

**Endpoint:** `POST /api/users/register`

**Headers:**
- No special headers needed (form-data is automatically handled)

**Body Type:** `form-data`

**Body Fields:**
| Key | Type | Value | Required |
|-----|------|-------|----------|
| `username` | Text | `john_doe` | Yes |
| `email` | Text | `john@example.com` | Yes |
| `password` | Text | `password123` | Yes |
| `image` | File | Select image file | No (optional) |

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "john_doe",
      "email": "john@example.com",
      "imageUrl": "https://res.cloudinary.com/...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

**Steps in Postman:**
1. Select `POST` method
2. Enter URL: `http://localhost:5000/api/users/register`
3. Go to `Body` tab
4. Select `form-data`
5. Add fields: `username`, `email`, `password`
6. (Optional) Add `image` field, change type to `File`, select an image
7. Click `Send`

---

## 2. Login User

**Endpoint:** `POST /api/users/login`

**Headers:**
- `Content-Type: application/json`

**Body Type:** `raw` (JSON)

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "john_doe",
      "email": "john@example.com",
      "imageUrl": "https://res.cloudinary.com/..."
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Steps in Postman:**
1. Select `POST` method
2. Enter URL: `http://localhost:5000/api/users/login`
3. Go to `Body` tab
4. Select `raw` and choose `JSON` from dropdown
5. Paste the JSON body
6. Click `Send`
7. **Copy the `token` from response** - you'll need it for protected routes!

---

## 3. Get User Profile (Protected)

**Endpoint:** `GET /api/users/profile`

**Headers:**
- `Authorization: Bearer YOUR_TOKEN_HERE`
  - Replace `YOUR_TOKEN_HERE` with the token from login/register response

**Body:** None

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "imageUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Steps in Postman:**
1. Select `GET` method
2. Enter URL: `http://localhost:5000/api/users/profile`
3. Go to `Headers` tab
4. Add header:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual token)
5. Click `Send`

**Alternative: Using Authorization Tab:**
1. Go to `Authorization` tab
2. Select type: `Bearer Token`
3. Paste your token in the `Token` field
4. Click `Send`

---

## 4. Update User Profile (Protected)

**Endpoint:** `PUT /api/users/profile`

**Headers:**
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Body Type:** `form-data`

**Body Fields:**
| Key | Type | Value | Required |
|-----|------|-------|----------|
| `username` | Text | `john_updated` | No (optional) |
| `email` | Text | `john_new@example.com` | No (optional) |
| `image` | File | Select new image file | No (optional) |

**Note:** You can update any combination of fields. Only send the fields you want to update.

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_updated",
    "email": "john_new@example.com",
    "imageUrl": "https://res.cloudinary.com/...",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Steps in Postman:**
1. Select `PUT` method
2. Enter URL: `http://localhost:5000/api/users/profile`
3. Go to `Authorization` tab (or `Headers`)
4. Select `Bearer Token` and paste your token
5. Go to `Body` tab
6. Select `form-data`
7. Add fields you want to update (username, email, and/or image)
8. Click `Send`

---

## Quick Test Flow

### Test Sequence:
1. **Register** a new user → Save the `token` from response
2. **Login** with the same credentials → Verify you get a token
3. **Get Profile** using the token → Verify user data
4. **Update Profile** using the token → Verify changes

### Using Postman Environment Variables (Recommended)

Create an environment to store variables:

1. Click the gear icon (⚙️) top right in Postman
2. Click `Add` to create new environment
3. Add variable: `base_url` = `http://localhost:5000`
4. Add variable: `token` = (leave empty, will be set automatically)
5. Save and select the environment

**Then use in requests:**
- URL: `{{base_url}}/api/users/login`
- Authorization: `Bearer {{token}}`

**Set token automatically after login:**
In the login request, go to `Tests` tab and add:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

---

## Troubleshooting

**Error: "Cannot POST /api/users/register"**
- Make sure your server is running (`npm run dev`)
- Check if port 5000 is correct

**Error: "User with this email or username already exists"**
- Try different email/username
- Or test with login endpoint first

**Error: "Invalid or expired token"**
- Token expired (check expiration time)
- Wrong token format (should start with "Bearer ")
- Copy the full token from login/register response

**Error: "ECONNREFUSED"**
- Server is not running
- Check MongoDB connection
- Verify `.env` file has correct `DATABASE_URL`

**Image upload not working:**
- Make sure `image` field type is `File` (not Text)
- Image must be valid format (jpg, jpeg, png, gif, webp)
- Check Cloudinary credentials in `.env`

---

## Example cURL Commands

**Register:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -F "username=john_doe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "image=@/path/to/image.jpg"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Update Profile:**
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "username=john_updated" \
  -F "email=john_new@example.com"
```

