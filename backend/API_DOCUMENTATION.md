# 📚 DUALY BACKEND - COMPLETE API DOCUMENTATION

## 🌐 BASE URL
```
Development: http://localhost:3000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## 🔐 AUTHENTICATION
Most endpoints require Bearer token authentication.

```bash
Authorization: Bearer <access_token>
```

---

## 📑 TABLE OF CONTENTS
1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Language APIs](#language-apis)
4. [Dua APIs](#dua-apis)
5. [Challenge APIs](#challenge-apis)
6. [Admin APIs](#admin-apis)

---

# 🔌 API ENDPOINTS

## Authentication
```
POST   /api/v1/auth/register          # Register new user                       
POST   /api/v1/auth/login             # Login user
GET    /api/v1/auth/verify-email      # Verify email
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
POST   /api/v1/auth/refresh           # Refresh access token
POST   /api/v1/auth/logout            # Logout user
```

## Users
```
GET    /api/v1/users/me               # Get current user profile
PATCH  /api/v1/users/me               # Update profile
GET    /api/v1/users/me/stats         # Get user statistics
GET    /api/v1/users/me/activity      # Get daily activity
```

## Duas
```
GET    /api/v1/duas/categories        # Get all categories
GET    /api/v1/duas                   # Get all duas (paginated)
GET    /api/v1/duas/:id               # Get specific dua
POST   /api/v1/duas/:id/read          # Mark dua as read
POST   /api/v1/duas/:id/favorite      # Add to favorites
DELETE /api/v1/duas/:id/favorite      # Remove from favorites
GET    /api/v1/duas/favorites/my      # Get my favorites
```

## Challenges
```
GET    /api/v1/challenges             # Get all challenges
GET    /api/v1/challenges/:id         # Get specific challenge
POST   /api/v1/challenges/:id/join    # Join challenge
POST   /api/v1/challenges/:id/progress # Submit progress
GET    /api/v1/challenges/:id/my-progress # Get my progress
GET    /api/v1/challenges/my/active   # Get my active challenges
GET    /api/v1/challenges/my/completed # Get completed challenges
GET    /api/v1/challenges/:id/collaborative-stats # Collaborative stats
```

## Admin
```
POST   /api/v1/admin/login            # Admin login                             
POST   /api/v1/admin/dua-categories   # Create category
PATCH  /api/v1/admin/dua-categories/:id # Update category
DELETE /api/v1/admin/dua-categories/:id # Delete category
POST   /api/v1/admin/duas             # Create dua
PATCH  /api/v1/admin/duas/:id         # Update dua
DELETE /api/v1/admin/duas/:id         # Delete dua
POST   /api/v1/admin/challenges       # Create challenge
PATCH  /api/v1/admin/challenges/:id   # Update challenge
DELETE /api/v1/admin/challenges/:id   # Delete challenge
```

---

# 🔑 AUTHENTICATION APIS

## 1. Register New User

**Endpoint:** `POST /auth/register`  
**Auth Required:** No  
**Description:** Register a new user account

### Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "preferred_language_code": "en",
  "timezone": "America/New_York"
}
```

### Validation Rules
- `email`: Valid email format, required
- `password`: Min 8 chars, must contain uppercase, lowercase, and number/special char
- `full_name`: Optional, max 255 chars
- `phone_number`: Optional, max 20 chars
- `preferred_language_code`: Optional, language code (en, ar, ur)
- `timezone`: Optional, valid timezone string

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "full_name": "John Doe",
    "preferred_language_code": "en",
    "timezone": "America/New_York"
  }'
```

### Success Response (201)
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "message": "Registration successful. Please verify your email."
  }
}
```

### Error Response (409)
```json
{
  "statusCode": 409,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Email already registered"
}
```

---

## 2. Login

**Endpoint:** `POST /auth/login`  
**Auth Required:** No  
**Description:** Login with email and password

### Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "device_id": "device-uuid-12345",
  "device_name": "iPhone 14 Pro",
  "device_type": "ios"
}
```

### Fields
- `email`: Required
- `password`: Required
- `device_id`: Optional (generated if not provided)
- `device_name`: Optional
- `device_type`: Optional (ios, android, web)

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "device_id": "device-12345",
    "device_name": "iPhone 14 Pro",
    "device_type": "ios"
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "full_name": "John Doe",
      "profile_picture_url": null,
      "preferred_language": {
        "id": "lang-uuid",
        "code": "en",
        "name": "English",
        "native_name": "English",
        "direction": "ltr"
      }
    }
  }
}
```

### Error Responses
**401 - Invalid Credentials**
```json
{
  "statusCode": 401,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Invalid credentials"
}
```

**401 - Email Not Verified**
```json
{
  "statusCode": 401,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Please verify your email first"
}
```

**401 - Account Inactive**
```json
{
  "statusCode": 401,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Account is inactive"
}
```

---

## 3. Verify Email

**Endpoint:** `GET /auth/verify-email?token=<token>`  
**Auth Required:** No  
**Description:** Verify email address with token

### Query Parameters
- `token`: Email verification token (required)

### cURL Example
```bash
curl -X GET "http://localhost:3000/api/v1/auth/verify-email?token=verification-token-12345"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Email verified successfully"
  }
}
```

### Error Responses
**400 - Invalid Token**
```json
{
  "statusCode": 400,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Invalid verification token"
}
```

**400 - Already Verified**
```json
{
  "statusCode": 400,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Email already verified"
}
```

**400 - Token Expired**
```json
{
  "statusCode": 400,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Verification token expired"
}
```

---

## 4. Forgot Password

**Endpoint:** `POST /auth/forgot-password`  
**Auth Required:** No  
**Description:** Request password reset link

### Request Body
```json
{
  "email": "user@example.com"
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "If email exists, password reset link has been sent"
  }
}
```

**Note:** Response is same whether email exists or not (security measure)

---

## 5. Reset Password

**Endpoint:** `POST /auth/reset-password`  
**Auth Required:** No  
**Description:** Reset password with token

### Request Body
```json
{
  "token": "reset-token-12345",
  "new_password": "NewSecurePass123!"
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-12345",
    "new_password": "NewSecurePass123!"
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Password reset successful"
  }
}
```

**Note:** All user sessions are invalidated after password reset

### Error Response (400)
```json
{
  "statusCode": 400,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Invalid or expired reset token"
}
```

---

## 6. Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Auth Required:** No  
**Description:** Get new access token using refresh token

### Request Body
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your-refresh-token-here"
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response (401)
```json
{
  "statusCode": 401,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Invalid refresh token"
}
```

---

## 7. Logout

**Endpoint:** `POST /auth/logout`  
**Auth Required:** Yes  
**Description:** Logout user (invalidate sessions)

### Query Parameters
- `device_id`: Optional - Logout specific device only

### cURL Examples

**Logout Current Device:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

**Logout Specific Device:**
```bash
curl -X POST "http://localhost:3000/api/v1/auth/logout?device_id=device-12345" \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

# 👤 USER APIS

## 8. Get Current User Profile

**Endpoint:** `GET /users/me`  
**Auth Required:** Yes  
**Description:** Get logged-in user's profile

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "timezone": "America/New_York",
    "is_email_verified": true,
    "is_active": true,
    "last_login_at": "2026-01-02T10:30:00.000Z",
    "created_at": "2026-01-01T08:00:00.000Z",
    "preferred_language": {
      "id": "lang-uuid",
      "code": "en",
      "name": "English",
      "native_name": "English",
      "direction": "ltr"
    },
    "stats": {
      "id": "stats-uuid",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "total_duas_read": 45,
      "total_dhikr_count": "12500",
      "total_challenges_completed": 8,
      "total_challenges_joined": 12,
      "current_streak_days": 7,
      "longest_streak_days": 15,
      "total_points": 850,
      "level": 9
    }
  }
}
```

---

## 9. Update User Profile

**Endpoint:** `PATCH /users/me`  
**Auth Required:** Yes  
**Description:** Update user profile

### Request Body
```json
{
  "full_name": "John Updated Doe",
  "phone_number": "+1234567891",
  "profile_picture_url": "https://example.com/new-avatar.jpg",
  "timezone": "America/Los_Angeles",
  "preferred_language_code": "ar"
}
```

**Note:** All fields are optional

### cURL Example
```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Updated Doe",
    "timezone": "America/Los_Angeles"
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "full_name": "John Updated Doe",
    "phone_number": "+1234567891",
    "profile_picture_url": "https://example.com/new-avatar.jpg",
    "timezone": "America/Los_Angeles",
    "preferred_language": {
      "code": "ar",
      "name": "Arabic",
      "native_name": "العربية",
      "direction": "rtl"
    }
  }
}
```

---

## 10. Get User Statistics

**Endpoint:** `GET /users/me/stats`  
**Auth Required:** Yes  
**Description:** Get user statistics and gamification data

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/users/me/stats \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "stats-uuid",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "total_duas_read": 45,
    "total_dhikr_count": "12500",
    "total_challenges_completed": 8,
    "total_challenges_joined": 12,
    "current_streak_days": 7,
    "longest_streak_days": 15,
    "last_activity_date": "2026-01-02",
    "total_points": 850,
    "level": 9,
    "created_at": "2026-01-01T08:00:00.000Z",
    "updated_at": "2026-01-02T10:30:00.000Z"
  }
}
```

---

## 11. Get User Daily Activity

**Endpoint:** `GET /users/me/activity`  
**Auth Required:** Yes  
**Description:** Get user's daily activity history

### Query Parameters
- `days`: Number of days to fetch (default: 7, max: 30)

### cURL Example
```bash
curl -X GET "http://localhost:3000/api/v1/users/me/activity?days=7" \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "activity-uuid-1",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "activity_date": "2026-01-02",
      "duas_read": 5,
      "dhikr_count": 250,
      "challenges_completed": 1,
      "session_duration_minutes": 45,
      "created_at": "2026-01-02T10:30:00.000Z"
    },
    {
      "id": "activity-uuid-2",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "activity_date": "2026-01-01",
      "duas_read": 8,
      "dhikr_count": 500,
      "challenges_completed": 2,
      "session_duration_minutes": 60,
      "created_at": "2026-01-01T10:30:00.000Z"
    }
  ]
}
```

---

# 🌍 LANGUAGE APIS

## 12. Get All Languages

**Endpoint:** `GET /languages`  
**Auth Required:** No  
**Description:** Get all languages (including inactive)

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/languages
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "lang-uuid-1",
      "code": "en",
      "name": "English",
      "native_name": "English",
      "direction": "ltr",
      "is_active": true,
      "display_order": 1,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "lang-uuid-2",
      "code": "ar",
      "name": "Arabic",
      "native_name": "العربية",
      "direction": "rtl",
      "is_active": true,
      "display_order": 2,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "lang-uuid-3",
      "code": "ur",
      "name": "Urdu",
      "native_name": "اردو",
      "direction": "rtl",
      "is_active": true,
      "display_order": 3,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 13. Get Active Languages

**Endpoint:** `GET /languages/active`  
**Auth Required:** No  
**Description:** Get only active languages

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/languages/active
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "lang-uuid-1",
      "code": "en",
      "name": "English",
      "native_name": "English",
      "direction": "ltr",
      "is_active": true,
      "display_order": 1
    },
    {
      "id": "lang-uuid-2",
      "code": "ar",
      "name": "Arabic",
      "native_name": "العربية",
      "direction": "rtl",
      "is_active": true,
      "display_order": 2
    }
  ]
}
```

---

# 🤲 DUA APIS

## 14. Get All Dua Categories

**Endpoint:** `GET /duas/categories`  
**Auth Required:** No  
**Description:** Get all dua categories with translations

### Query Parameters
- `language`: Language code (en, ar, ur) - optional

### cURL Examples

**All Languages:**
```bash
curl -X GET http://localhost:3000/api/v1/duas/categories
```

**Specific Language:**
```bash
curl -X GET "http://localhost:3000/api/v1/duas/categories?language=en"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "category-uuid-1",
      "name_key": "morning_evening",
      "icon_url": "https://example.com/icons/morning.svg",
      "color_hex": "#FF5722",
      "display_order": 1,
      "is_active": true,
      "created_at": "2026-01-01T00:00:00.000Z",
      "translations": [
        {
          "id": "trans-uuid-1",
          "category_id": "category-uuid-1",
          "language_id": "lang-uuid-1",
          "name": "Morning & Evening",
          "description": "Duas for morning and evening times",
          "language": {
            "id": "lang-uuid-1",
            "code": "en",
            "name": "English"
          }
        }
      ]
    }
  ]
}
```

---

## 15. Get Single Dua Category

**Endpoint:** `GET /duas/categories/:id`  
**Auth Required:** No  
**Description:** Get category by ID with translations

### Path Parameters
- `id`: Category UUID

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/duas/categories/category-uuid-1
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "category-uuid-1",
    "name_key": "morning_evening",
    "icon_url": "https://example.com/icons/morning.svg",
    "color_hex": "#FF5722",
    "display_order": 1,
    "is_active": true,
    "translations": [
      {
        "id": "trans-uuid-1",
        "name": "Morning & Evening",
        "description": "Duas for morning and evening times"
      }
    ]
  }
}
```

---

## 16. Get All Duas

**Endpoint:** `GET /duas`  
**Auth Required:** No  
**Description:** Get all duas with filters and pagination

### Query Parameters
- `category_id`: Filter by category UUID (optional)
- `is_featured`: Filter featured duas (true/false) (optional)
- `search`: Search in Arabic text, transliteration, or translations (optional)
- `language`: Language code for translations (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### cURL Examples

**All Duas:**
```bash
curl -X GET http://localhost:3000/api/v1/duas
```

**With Filters:**
```bash
curl -X GET "http://localhost:3000/api/v1/duas?category_id=category-uuid-1&language=en&page=1&limit=10"
```

**Search:**
```bash
curl -X GET "http://localhost:3000/api/v1/duas?search=morning&language=en"
```

**Featured Only:**
```bash
curl -X GET "http://localhost:3000/api/v1/duas?is_featured=true"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "dua-uuid-1",
        "category_id": "category-uuid-1",
        "reference": "Abu Dawud 5068",
        "reference_type": "hadith",
        "arabic_text": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        "transliteration": "Asbahna wa asbahal-mulku lillah",
        "audio_url": "https://example.com/audio/dua1.mp3",
        "audio_duration_seconds": 15,
        "recitation_count": 1,
        "benefits_key": "protection",
        "display_order": 1,
        "is_active": true,
        "is_featured": true,
        "created_at": "2026-01-01T00:00:00.000Z",
        "category": {
          "id": "category-uuid-1",
          "name_key": "morning_evening"
        },
        "translations": [
          {
            "id": "trans-uuid-1",
            "dua_id": "dua-uuid-1",
            "language_id": "lang-uuid-1",
            "translation": "We have entered a new day and the dominion belongs to Allah",
            "benefits": "Protection throughout the day",
            "translator_name": "Dr. Abdul Karim",
            "language": {
              "code": "en",
              "name": "English"
            }
          }
        ]
      }
    ],
    "meta": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## 17. Get Single Dua

**Endpoint:** `GET /duas/:id`  
**Auth Required:** No  
**Description:** Get dua by ID with translations

### Path Parameters
- `id`: Dua UUID

### Query Parameters
- `language`: Language code (optional)

### cURL Example
```bash
curl -X GET "http://localhost:3000/api/v1/duas/dua-uuid-1?language=en"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "dua-uuid-1",
    "category_id": "category-uuid-1",
    "reference": "Abu Dawud 5068",
    "reference_type": "hadith",
    "arabic_text": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    "transliteration": "Asbahna wa asbahal-mulku lillah",
    "audio_url": "https://example.com/audio/dua1.mp3",
    "audio_duration_seconds": 15,
    "recitation_count": 1,
    "is_featured": true,
    "category": {
      "id": "category-uuid-1",
      "name_key": "morning_evening"
    },
    "translations": [
      {
        "translation": "We have entered a new day and the dominion belongs to Allah",
        "benefits": "Protection throughout the day",
        "translator_name": "Dr. Abdul Karim",
        "language": {
          "code": "en",
          "name": "English"
        }
      }
    ]
  }
}
```

---

## 18. Mark Dua as Read

**Endpoint:** `POST /duas/:id/read`  
**Auth Required:** Yes  
**Description:** Mark dua as read (updates user stats)

### Path Parameters
- `id`: Dua UUID

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/duas/dua-uuid-1/read \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Dua marked as read"
  }
}
```

**Note:** This increments `total_duas_read` in user stats and updates daily activity

---

## 19. Add Dua to Favorites

**Endpoint:** `POST /duas/:id/favorite`  
**Auth Required:** Yes  
**Description:** Add dua to user's favorites

### Path Parameters
- `id`: Dua UUID

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/duas/dua-uuid-1/favorite \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Dua added to favorites"
  }
}
```

### Already Exists Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Dua already in favorites"
  }
}
```

---

## 20. Remove Dua from Favorites

**Endpoint:** `DELETE /duas/:id/favorite`  
**Auth Required:** Yes  
**Description:** Remove dua from favorites

### Path Parameters
- `id`: Dua UUID

### cURL Example
```bash
curl -X DELETE http://localhost:3000/api/v1/duas/dua-uuid-1/favorite \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Dua removed from favorites"
  }
}
```

---

## 21. Get User's Favorite Duas

**Endpoint:** `GET /duas/favorites/my`  
**Auth Required:** Yes  
**Description:** Get user's favorite duas with pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### cURL Example
```bash
curl -X GET "http://localhost:3000/api/v1/duas/favorites/my?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "dua-uuid-1",
        "arabic_text": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        "transliteration": "Asbahna wa asbahal-mulku lillah",
        "translations": [
          {
            "translation": "We have entered a new day...",
            "language": {
              "code": "en",
              "name": "English"
            }
          }
        ],
        "category": {
          "name_key": "morning_evening"
        }
      }
    ],
    "meta": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

# 🎯 CHALLENGE APIS

## 22. Get All Challenges

**Endpoint:** `GET /challenges`  
**Auth Required:** No  
**Description:** Get all challenges with filters

### Query Parameters
- `type`: Challenge type (singular, collaborative) (optional)
- `difficulty`: Difficulty level (easy, medium, hard) (optional)
- `language`: Language code (optional)
- `is_active`: Filter active challenges (true/false) (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### cURL Examples

**All Challenges:**
```bash
curl -X GET http://localhost:3000/api/v1/challenges
```

**With Filters:**
```bash
curl -X GET "http://localhost:3000/api/v1/challenges?type=singular&difficulty=easy&language=en"
```

**Active Only:**
```bash
curl -X GET "http://localhost:3000/api/v1/challenges?is_active=true"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "challenge-uuid-1",
        "title_key": "tasbih_100",
        "description_key": "tasbih_100_desc",
        "type": "singular",
        "difficulty": "easy",
        "target_count": 100,
        "duration_days": 7,
        "arabic_text": "سُبْحَانَ اللَّهِ",
        "transliteration": "Subhan Allah",
        "image_url": "https://example.com/images/tasbih.jpg",
        "audio_url": "https://example.com/audio/tasbih.mp3",
        "reward_points": 10,
        "reward_assignment": "per_tap",
        "badge_icon_url": "https://example.com/badges/tasbih.svg",
        "start_date": "2026-01-01T00:00:00.000Z",
        "end_date": "2026-12-31T23:59:59.000Z",
        "is_recurring": false,
        "is_active": true,
        "display_order": 1,
        "translations": [
          {
            "id": "trans-uuid-1",
            "title": "Say SubhanAllah 100 Times",
            "description": "Recite SubhanAllah 100 times daily for 7 days",
            "dhikr_text_translation": "Glory be to Allah",
            "benefits": "Purifies the soul and earns immense rewards",
            "language": {
              "code": "en",
              "name": "English"
            }
          }
        ]
      }
    ],
    "meta": {
      "total": 8,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

## 23. Get Single Challenge

**Endpoint:** `GET /challenges/:id`  
**Auth Required:** No  
**Description:** Get challenge by ID

### Path Parameters
- `id`: Challenge UUID

### Query Parameters
- `language`: Language code (optional)

### cURL Example
```bash
curl -X GET "http://localhost:3000/api/v1/challenges/challenge-uuid-1?language=en"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "challenge-uuid-1",
    "title_key": "tasbih_100",
    "type": "singular",
    "difficulty": "easy",
    "target_count": 100,
    "duration_days": 7,
    "arabic_text": "سُبْحَانَ اللَّهِ",
    "transliteration": "Subhan Allah",
    "reward_points": 10,
    "translations": [
      {
        "title": "Say SubhanAllah 100 Times",
        "description": "Recite SubhanAllah 100 times daily for 7 days",
        "dhikr_text_translation": "Glory be to Allah",
        "benefits": "Purifies the soul and earns immense rewards"
      }
    ]
  }
}
```

---

## 24. Join Challenge

**Endpoint:** `POST /challenges/:id/join`  
**Auth Required:** Yes  
**Description:** Join a challenge

### Path Parameters
- `id`: Challenge UUID

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/challenges/challenge-uuid-1/join \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "progress-uuid-1",
    "user_id": "user-uuid-1",
    "challenge_id": "challenge-uuid-1",
    "current_count": 0,
    "target_count": 100,
    "status": "active",
    "started_at": "2026-01-02T10:30:00.000Z"
  }
}
```

**Note:** If already joined, returns existing progress

---

## 25. Submit Dhikr Progress

**Endpoint:** `POST /challenges/:id/progress`  
**Auth Required:** Yes  
**Description:** Submit dhikr count for a challenge

### Path Parameters
- `id`: Challenge UUID

### Request Body
```json
{
  "count": 33,
  "device_id": "device-12345"
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/challenges/challenge-uuid-1/progress \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "count": 33,
    "device_id": "device-12345"
  }'
```

### Success Response (200) - In Progress
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "progress": {
      "id": "progress-uuid-1",
      "user_id": "user-uuid-1",
      "challenge_id": "challenge-uuid-1",
      "current_count": 33,
      "target_count": 100,
      "status": "active",
      "started_at": "2026-01-02T10:30:00.000Z",
      "last_updated_at": "2026-01-02T11:00:00.000Z"
    },
    "completed": false,
    "points_earned": 0
  }
}
```

### Success Response (200) - Completed
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "progress": {
      "id": "progress-uuid-1",
      "user_id": "user-uuid-1",
      "challenge_id": "challenge-uuid-1",
      "current_count": 100,
      "target_count": 100,
      "status": "completed",
      "started_at": "2026-01-02T10:30:00.000Z",
      "completed_at": "2026-01-02T12:00:00.000Z",
      "last_updated_at": "2026-01-02T12:00:00.000Z"
    },
    "completed": true,
    "points_earned": 50
  }
}
```

**Note:** Also updates user stats (dhikr count, points, level)

---

## 26. Get My Progress for Challenge

**Endpoint:** `GET /challenges/:id/my-progress`  
**Auth Required:** Yes  
**Description:** Get user's progress for specific challenge

### Path Parameters
- `id`: Challenge UUID

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/challenges/challenge-uuid-1/my-progress \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "progress-uuid-1",
    "user_id": "user-uuid-1",
    "challenge_id": "challenge-uuid-1",
    "current_count": 65,
    "target_count": 100,
    "status": "active",
    "started_at": "2026-01-02T10:30:00.000Z",
    "last_updated_at": "2026-01-02T11:30:00.000Z",
    "challenge": {
      "id": "challenge-uuid-1",
      "title_key": "tasbih_100",
      "type": "singular",
      "difficulty": "easy",
      "target_count": 100,
      "reward_points": 50,
      "translations": [
        {
          "title": "Say SubhanAllah 100 Times",
          "description": "Recite SubhanAllah 100 times daily for 7 days"
        }
      ]
    }
  }
}
```

### Error Response (404)
```json
{
  "statusCode": 404,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Progress not found"
}
```

---

## 27. Get My Active Challenges

**Endpoint:** `GET /challenges/my/active`  
**Auth Required:** Yes  
**Description:** Get all active challenges for current user

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/challenges/my/active \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "progress-uuid-1",
      "user_id": "user-uuid-1",
      "challenge_id": "challenge-uuid-1",
      "current_count": 65,
      "target_count": 100,
      "status": "active",
      "started_at": "2026-01-02T10:30:00.000Z",
      "challenge": {
        "id": "challenge-uuid-1",
        "title_key": "tasbih_100",
        "type": "singular",
        "difficulty": "easy",
        "translations": [
          {
            "title": "Say SubhanAllah 100 Times"
          }
        ]
      }
    },
    {
      "id": "progress-uuid-2",
      "user_id": "user-uuid-1",
      "challenge_id": "challenge-uuid-2",
      "current_count": 250,
      "target_count": 1000,
      "status": "active",
      "started_at": "2026-01-01T08:00:00.000Z",
      "challenge": {
        "id": "challenge-uuid-2",
        "title_key": "istighfar_1000",
        "type": "collaborative",
        "difficulty": "medium"
      }
    }
  ]
}
```

---

## 28. Get My Completed Challenges

**Endpoint:** `GET /challenges/my/completed`  
**Auth Required:** Yes  
**Description:** Get user's completed challenges with pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### cURL Example
```bash
curl -X GET "http://localhost:3000/api/v1/challenges/my/completed?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "progress-uuid-3",
        "user_id": "user-uuid-1",
        "challenge_id": "challenge-uuid-3",
        "current_count": 100,
        "target_count": 100,
        "status": "completed",
        "started_at": "2025-12-25T08:00:00.000Z",
        "completed_at": "2026-01-01T10:00:00.000Z",
        "challenge": {
          "id": "challenge-uuid-3",
          "title_key": "morning_adhkar",
          "type": "singular",
          "reward_points": 100,
          "translations": [
            {
              "title": "Morning Adhkar Challenge"
            }
          ]
        }
      }
    ],
    "meta": {
      "total": 8,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

## 29. Get Collaborative Challenge Stats

**Endpoint:** `GET /challenges/:id/collaborative-stats`  
**Auth Required:** No  
**Description:** Get statistics for collaborative challenge

### Path Parameters
- `id`: Challenge UUID

### cURL Example
```bash
curl -X GET http://localhost:3000/api/v1/challenges/challenge-uuid-2/collaborative-stats
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "stats-uuid-1",
    "challenge_id": "challenge-uuid-2",
    "total_participants": 1547,
    "total_count": "156890",
    "last_updated_at": "2026-01-02T12:00:00.000Z",
    "challenge": {
      "id": "challenge-uuid-2",
      "title_key": "istighfar_1000000",
      "type": "collaborative",
      "target_count": 1000000,
      "translations": [
        {
          "title": "One Million Istighfar"
        }
      ]
    }
  }
}
```

**Note:** Only available for collaborative challenges

---

# 👨‍💼 ADMIN APIS

## 30. Admin Login

**Endpoint:** `POST /admin/login`  
**Auth Required:** No  
**Description:** Admin login

### Request Body
```json
{
  "email": "admin@dualy.com",
  "password": "Admin@123"
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dualy.com",
    "password": "Admin@123"
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "admin-uuid-1",
      "email": "admin@dualy.com",
      "full_name": "System Administrator",
      "role": "super_admin",
      "can_manage_users": true,
      "can_manage_content": true,
      "can_manage_translations": true,
      "can_view_analytics": true
    }
  }
}
```

---

## 31. Create Dua Category (Admin)

**Endpoint:** `POST /admin/dua-categories`  
**Auth Required:** Yes (Admin, Super Admin, Content Moderator)  
**Description:** Create new dua category

### Request Body
```json
{
  "name_key": "traveling",
  "icon_url": "https://example.com/icons/travel.svg",
  "color_hex": "#2196F3",
  "display_order": 10,
  "is_active": true,
  "translations": [
    {
      "language_code": "en",
      "name": "Traveling",
      "description": "Duas for travelers"
    },
    {
      "language_code": "ar",
      "name": "السفر",
      "description": "أدعية المسافرين"
    }
  ]
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/admin/dua-categories \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name_key": "traveling",
    "icon_url": "https://example.com/icons/travel.svg",
    "color_hex": "#2196F3",
    "display_order": 10,
    "translations": [
      {
        "language_code": "en",
        "name": "Traveling",
        "description": "Duas for travelers"
      }
    ]
  }'
```

### Success Response (201)
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": "category-uuid-new",
    "name_key": "traveling",
    "icon_url": "https://example.com/icons/travel.svg",
    "color_hex": "#2196F3",
    "display_order": 10,
    "is_active": true,
    "translations": [
      {
        "language_code": "en",
        "name": "Traveling",
        "description": "Duas for travelers"
      }
    ]
  }
}
```

---

## 32. Update Dua Category (Admin)

**Endpoint:** `PATCH /admin/dua-categories/:id`  
**Auth Required:** Yes (Admin, Super Admin, Content Moderator)  
**Description:** Update dua category

### Path Parameters
- `id`: Category UUID

### Request Body (All fields optional)
```json
{
  "name_key": "traveling_updated",
  "color_hex": "#FF5722",
  "display_order": 5,
  "is_active": false,
  "translations": [
    {
      "language_code": "en",
      "name": "Travel & Journey",
      "description": "Updated description"
    }
  ]
}
```

### cURL Example
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/dua-categories/category-uuid-1 \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "color_hex": "#FF5722",
    "display_order": 5
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "category-uuid-1",
    "name_key": "traveling",
    "color_hex": "#FF5722",
    "display_order": 5,
    "is_active": true,
    "translations": [...]
  }
}
```

---

## 33. Delete Dua Category (Admin)

**Endpoint:** `DELETE /admin/dua-categories/:id`  
**Auth Required:** Yes (Admin, Super Admin)  
**Description:** Soft delete dua category

### Path Parameters
- `id`: Category UUID

### cURL Example
```bash
curl -X DELETE http://localhost:3000/api/v1/admin/dua-categories/category-uuid-1 \
  -H "Authorization: Bearer <admin_access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Item deleted successfully"
  }
}
```

---

## 34. Create Dua (Admin)

**Endpoint:** `POST /admin/duas`  
**Auth Required:** Yes (Admin, Super Admin, Content Moderator)  
**Description:** Create new dua

### Request Body
```json
{
  "category_id": "category-uuid-1",
  "reference": "Sahih Muslim 2721",
  "reference_type": "hadith",
  "arabic_text": "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ",
  "transliteration": "Allahumma anta rabbi la ilaha illa anta",
  "audio_url": "https://example.com/audio/dua-new.mp3",
  "audio_duration_seconds": 20,
  "recitation_count": 3,
  "benefits_key": "forgiveness",
  "display_order": 1,
  "is_active": true,
  "is_featured": false,
  "translations": [
    {
      "language_code": "en",
      "translation": "O Allah, You are my Lord, there is no deity except You",
      "benefits": "Seeking forgiveness and closeness to Allah",
      "translator_name": "Dr. Muhammad Khan"
    }
  ]
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/admin/duas \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": "category-uuid-1",
    "arabic_text": "اللَّهُمَّ أَنْتَ رَبِّي",
    "transliteration": "Allahumma anta rabbi",
    "translations": [
      {
        "language_code": "en",
        "translation": "O Allah, You are my Lord"
      }
    ]
  }'
```

### Success Response (201)
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": "dua-uuid-new",
    "category_id": "category-uuid-1",
    "arabic_text": "اللَّهُمَّ أَنْتَ رَبِّي",
    "transliteration": "Allahumma anta rabbi",
    "translations": [...]
  }
}
```

---

## 35. Update Dua (Admin)

**Endpoint:** `PATCH /admin/duas/:id`  
**Auth Required:** Yes (Admin, Super Admin, Content Moderator)  
**Description:** Update dua

### Path Parameters
- `id`: Dua UUID

### Request Body (All fields optional)
```json
{
  "arabic_text": "Updated Arabic text",
  "is_featured": true,
  "display_order": 10,
  "translations": [
    {
      "language_code": "en",
      "translation": "Updated translation"
    }
  ]
}
```

### cURL Example
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/duas/dua-uuid-1 \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "is_featured": true,
    "display_order": 1
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "dua-uuid-1",
    "is_featured": true,
    "display_order": 1,
    "translations": [...]
  }
}
```

---

## 36. Delete Dua (Admin)

**Endpoint:** `DELETE /admin/duas/:id`  
**Auth Required:** Yes (Admin, Super Admin)  
**Description:** Soft delete dua

### Path Parameters
- `id`: Dua UUID

### cURL Example
```bash
curl -X DELETE http://localhost:3000/api/v1/admin/duas/dua-uuid-1 \
  -H "Authorization: Bearer <admin_access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Item deleted successfully"
  }
}
```

---

## 37. Create Challenge (Admin)

**Endpoint:** `POST /admin/challenges`  
**Auth Required:** Yes (Admin, Super Admin, Content Moderator)  
**Description:** Create new dhikr challenge

### Request Body
```json
{
  "title_key": "salawat_1000",
  "description_key": "salawat_1000_desc",
  "type": "singular",
  "difficulty": "medium",
  "target_count": 1000,
  "duration_days": 30,
  "arabic_text": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
  "transliteration": "Allahumma salli ala Muhammad",
  "image_url": "https://example.com/images/salawat.jpg",
  "audio_url": "https://example.com/audio/salawat.mp3",
  "reward_points": 100,
  "reward_assignment": "on_challenge_complete",
  "badge_icon_url": "https://example.com/badges/salawat.svg",
  "start_date": "2026-01-01T00:00:00Z",
  "end_date": "2026-12-31T23:59:59Z",
  "is_recurring": false,
  "is_active": true,
  "display_order": 1,
  "translations": [
    {
      "language_code": "en",
      "title": "Send 1000 Salawat",
      "description": "Send salutations upon Prophet Muhammad (PBUH) 1000 times in 30 days",
      "dhikr_text_translation": "O Allah, send blessings upon Muhammad",
      "benefits": "Brings closeness to Allah and the Prophet"
    }
  ]
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/admin/challenges \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title_key": "salawat_1000",
    "type": "singular",
    "difficulty": "medium",
    "target_count": 1000,
    "arabic_text": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    "reward_points": 100,
    "translations": [
      {
        "language_code": "en",
        "title": "Send 1000 Salawat"
      }
    ]
  }'
```

### Success Response (201)
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": "challenge-uuid-new",
    "title_key": "salawat_1000",
    "type": "singular",
    "difficulty": "medium",
    "target_count": 1000,
    "reward_points": 100,
    "translations": [...]
  }
}
```

---

## 38. Update Challenge (Admin)

**Endpoint:** `PATCH /admin/challenges/:id`  
**Auth Required:** Yes (Admin, Super Admin, Content Moderator)  
**Description:** Update dhikr challenge

### Path Parameters
- `id`: Challenge UUID

### Request Body (All fields optional)
```json
{
  "difficulty": "hard",
  "target_count": 2000,
  "reward_points": 200,
  "is_active": false,
  "translations": [
    {
      "language_code": "en",
      "title": "Updated title"
    }
  ]
}
```

### cURL Example
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/challenges/challenge-uuid-1 \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reward_points": 200,
    "is_active": true
  }'
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "challenge-uuid-1",
    "reward_points": 200,
    "is_active": true,
    "translations": [...]
  }
}
```

---

## 39. Delete Challenge (Admin)

**Endpoint:** `DELETE /admin/challenges/:id`  
**Auth Required:** Yes (Admin, Super Admin)  
**Description:** Soft delete challenge

### Path Parameters
- `id`: Challenge UUID

### cURL Example
```bash
curl -X DELETE http://localhost:3000/api/v1/admin/challenges/challenge-uuid-1 \
  -H "Authorization: Bearer <admin_access_token>"
```

### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Item deleted successfully"
  }
}
```

---

# 📊 COMMON ERROR RESPONSES

## 400 Bad Request
```json
{
  "statusCode": 400,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": [
    "email must be an email",
    "password must be at least 8 characters"
  ]
}
```

## 401 Unauthorized
```json
{
  "statusCode": 401,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Unauthorized"
}
```

## 403 Forbidden
```json
{
  "statusCode": 403,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Forbidden resource"
}
```

## 404 Not Found
```json
{
  "statusCode": 404,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Entity with ID xxx not found"
}
```

## 409 Conflict
```json
{
  "statusCode": 409,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Email already registered"
}
```

## 500 Internal Server Error
```json
{
  "statusCode": 500,
  "timestamp": "2026-01-02T10:30:00.000Z",
  "message": "Internal server error"
}
```

---

# 🔍 TESTING TIPS

## 1. Get JWT Token
```bash
# Login first
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dualy.com","password":"Admin@123"}' \
  | jq -r '.data.access_token')

# Use token
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## 2. Test with Pagination
```bash
# First page
curl "http://localhost:3000/api/v1/duas?page=1&limit=5"

# Second page
curl "http://localhost:3000/api/v1/duas?page=2&limit=5"
```

## 3. Test Search
```bash
curl "http://localhost:3000/api/v1/duas?search=morning&language=en"
```

## 4. Test Filters
```bash
curl "http://localhost:3000/api/v1/challenges?type=singular&difficulty=easy"
```

---

# 📝 POSTMAN COLLECTION

You can import these cURL commands into Postman:
1. Click "Import" in Postman
2. Select "Raw Text"
3. Paste any cURL command
4. Click "Continue" and "Import"

---

# 🎯 QUICK START GUIDE

## For Beginners:

### Step 1: Start the server
```bash
docker-compose up -d
npm run migration:run
npm run seed
npm run start:dev
```

### Step 2: Register a user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345",
    "full_name": "Test User"
  }'
```

### Step 3: Get languages
```bash
curl http://localhost:3000/api/v1/languages/active
```

### Step 4: Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345"
  }'
```

Save the `access_token` from response!

### Step 5: Get your profile
```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 6: Get duas
```bash
curl http://localhost:3000/api/v1/duas?language=en
```

### Step 7: Join a challenge
```bash
curl -X POST http://localhost:3000/api/v1/challenges/CHALLENGE_ID/join \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 8: Submit progress
```bash
curl -X POST http://localhost:3000/api/v1/challenges/CHALLENGE_ID/progress \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

---

# 📚 SWAGGER DOCUMENTATION

Interactive API documentation is available at:
```
http://localhost:3000/api/docs
```

---

_Last Updated: January 2, 2026_  
_Version: 1.0.0_  
_Total Endpoints: 39+_