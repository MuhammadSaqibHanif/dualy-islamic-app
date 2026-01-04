## 🔌 API ENDPOINTS

### Authentication
```
POST   /api/v1/auth/register          # Register new user                       
POST   /api/v1/auth/login             # Login user
GET    /api/v1/auth/verify-email      # Verify email
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
POST   /api/v1/auth/refresh           # Refresh access token
POST   /api/v1/auth/logout            # Logout user
```

### Users
```
GET    /api/v1/users/me               # Get current user profile
PATCH  /api/v1/users/me               # Update profile
GET    /api/v1/users/me/stats         # Get user statistics
GET    /api/v1/users/me/activity      # Get daily activity
```

### Duas
```
GET    /api/v1/duas/categories        # Get all categories
GET    /api/v1/duas                   # Get all duas (paginated)
GET    /api/v1/duas/:id               # Get specific dua
POST   /api/v1/duas/:id/read          # Mark dua as read
POST   /api/v1/duas/:id/favorite      # Add to favorites
DELETE /api/v1/duas/:id/favorite      # Remove from favorites
GET    /api/v1/duas/favorites/my      # Get my favorites
```

### Challenges
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

### Admin
```
POST   /api/v1/admin/login            # Admin login                                # TESTED √
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