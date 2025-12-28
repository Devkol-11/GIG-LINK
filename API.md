# API Reference

Base URL: `http://localhost:3000/api/v1`

## Authentication (`/auth`)

### Register Freelancer

```
POST /auth/register/free-lancer

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Register Creator

```
POST /auth/register/creator

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

### Login

```
POST /auth/login

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Forgot Password

```
POST /auth/forgot-password

{
  "email": "user@example.com"
}
```

### Reset Password

```
POST /auth/reset-password

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPass123!"
}
```

## Users (`/users`)

### Create Profile

```
POST /users/createProfile

Authorization: Bearer <token>

{
  "bio": "Experienced developer",
  "skills": ["JavaScript", "React"],
  "portfolio": "https://portfolio.com",
  "hourlyRate": 50
}
```

### Get Profile

```
GET /users/profile

Authorization: Bearer <token>
```

### Update Profile

```
PUT /users/profile

Authorization: Bearer <token>

{
  "bio": "...",
  "skills": [...],
  "portfolio": "..."
}
```

### Upload Avatar

```
POST /users/avatar

Authorization: Bearer <token>
Content-Type: multipart/form-data

[file]
```

## Marketplace (`/market-place`)

### Create Gig

```
POST /market-place/gigs

Authorization: Bearer <token>

{
  "title": "Build React Dashboard",
  "description": "Professional dashboard",
  "price": 5000,
  "category": "Web Development",
  "deliveryTime": 7,
  "skills": ["React", "TypeScript"]
}
```

### List Gigs

```
GET /market-place/gigs?page=1&limit=10

No auth required
```

### Get Gig

```
GET /market-place/gigs/:id

No auth required
```

### Update Gig

```
PUT /market-place/gigs/:id

Authorization: Bearer <token>

{...fields}
```

### Delete Gig

```
DELETE /market-place/gigs/:id

Authorization: Bearer <token>
```

### Create Application

```
POST /market-place/applications

Authorization: Bearer <token>

{
  "gigId": "gig-id",
  "proposal": "I can do this",
  "proposedPrice": 4500,
  "estimatedDays": 5
}
```

### List Applications

```
GET /market-place/applications

Authorization: Bearer <token>
```

### Update Application Status

```
PUT /market-place/applications/:id

Authorization: Bearer <token>

{
  "status": "accepted|rejected"
}
```

### Create Contract

```
POST /market-place/contracts

Authorization: Bearer <token>

{
  "applicationId": "app-id",
  "terms": "Contract terms"
}
```

### Get Contract

```
GET /market-place/contracts/:id

Authorization: Bearer <token>
```

### Update Contract Status

```
PUT /market-place/contracts/:id

Authorization: Bearer <token>

{
  "status": "active|completed|cancelled"
}
```

## Billing (`/billing`)

### Create Payment

```
POST /billing/payments

Authorization: Bearer <token>

{
  "amount": 5000,
  "reference": "unique-ref",
  "email": "user@example.com"
}

Response: {paymentUrl: "..."}
```

### Verify Payment

```
POST /billing/payments/verify

Authorization: Bearer <token>

{
  "reference": "unique-ref"
}
```

### Create Wallet

```
POST /billing/wallets

Authorization: Bearer <token>

{
  "accountNumber": "1234567890",
  "bankCode": "050"
}
```

### Get Wallet Payments

```
GET /billing/wallets/payments

Authorization: Bearer <token>
```

### Request Withdrawal

```
POST /billing/withdrawals

Authorization: Bearer <token>

{
  "amount": 5000,
  "walletId": "wallet-id"
}
```

### Get Withdrawals

```
GET /billing/withdrawals

Authorization: Bearer <token>
```

### Fund Escrow

```
POST /billing/escrows/fund

Authorization: Bearer <token>

{
  "contractId": "contract-id",
  "amount": 5000,
  "reference": "unique-ref"
}
```

### Release Escrow

```
POST /billing/escrows/release

Authorization: Bearer <token>

{
  "escrowId": "escrow-id"
}
```

## Error Responses

All endpoints return standard error format:

```json
{
        "error": true,
        "message": "Error description",
        "statusCode": 400
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Response Format

Success responses:

```json
{
  "data": {...},
  "message": "Success message"
}
```

List responses include pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```
