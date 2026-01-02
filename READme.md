# GIG-LINK API

A modern freelance marketplace platform connecting creators and freelancers with secure contracts, escrow
payments, and transparent workflows.

## Quick Start

```bash
npm run dev                    # Start server (http://localhost:3000)
npm run type check             # Check for TypeScript errors
npm run db:migrate             # Run database migrations
```

## Features

- **Authentication** - Secure user registration and login
- **Marketplace** - Create gigs, apply for jobs, manage contracts
- **Wallet System** - Deposit, withdraw, manage balances
- **Escrow Payments** - Secure payment holding until contract completion
- **Payment Integration** - Paystack integration for payments
- **Email Notifications** - Welcome, OTP, and status emails

## Documentation

- **[API.md](API.md)** - Complete API endpoint reference
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[Interactive Swagger UI](http://localhost:3000/api-docs)** - Test endpoints live

## Architecture

Domain-Driven Design (DDD) with hexagonal architecture:

```
src/
├── contexts/              # Business modules (Auth, User, Marketplace, Billing)
│   ├── domain/           # Core business logic
│   ├── application/      # Use cases
│   ├── http/             # API routes
│   ├── adapters/         # External integrations
│   └── ports/            # Interfaces
├── infrastructure/       # Database, Redis, Email, Payments
├── shared/              # Utils, helpers, types, middlewares
└── tests/               # Test utilities
│   ├── errors/
│   ├── utils/
│   └── middleware/
└── server.ts
```

---

## 🧪 Testing

Unit and integration testing are being set up using **Jest**. Each module will have isolated test suites
covering its use cases and entities.

---

## 🧑‍💻 Tech Stack

- **Runtime:** Node.js + TypeScript (ES Modules)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Message-broker:** Bull-mq
- **Caching:** Redis
- **Architecture:** Event-Driven Architecture + Domain-Driven Design + Hexagonal architecture
- **Testing:** Jest
- **Bench-marking:** Auto-cannon
- **Payment Provider:** Paystack
