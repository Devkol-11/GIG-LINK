## 🧠 Overview

**Gig-Link** is a backend service for a modern freelance marketplace that connects **creators** and
**freelancers** through verified contracts, secure escrow payments, and transparent collaboration
workflows.

---

## ⚙️ Core Features (Planned & In Progress)

**Authentication** : User registration and login for both freelancers and creators  
**Contracts** : Create, manage, and complete contracts betwusers  
**Applications** : Freelancers apply to gigs with status transitions (accept, reject, withdraw)
**Escrow System** : Holds payments securely until contract completion  
**Wallet System** : Handles balance, deposits, withdrawals, and transactions
**Payments**:Integration with external payment provider (e.g., Paystack/Stripe) **Disputes** :Handle
disagreements and refunds through admin or automated logic

---

## 🧩 Architecture Overview

Gig-Link follows a **Domain-Driven Design (DDD)** inspired modular hexagonal architecture with clear
separation of concerns:

- **Domain Layer** → Business entities and core logic
- **Application Layer** → Use cases and orchestration between adapters
- **Http Layer** → Handles Networking
- **Adapters** → External integrations
- **Ports** → Interfaces for external integrations

This structure ensures maintainability, testability, and scalability as the project grows.

---

## 🗂️ Project Structure (Simplified)

```
src/
├── contexts/
├── contexts/
│   ├── contracts/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── interface/
│   ├── applications/
│   ├── wallet/
│   └── escrow/
├── shared/
│   ├── errors/
│   ├── utils/
│   └── middleware/
└── server.ts
```

---

## 🧪 Testing

Unit and integration testing are being set up using **Jest**. Each module will have isolated test
suites covering its use cases and entities.

---

## 🧑‍💻 Tech Stack

- **Runtime:** Node.js + TypeScript (ES Modules)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Message-broker:** Rabbit-mq
- **Caching:** Redis
- **Architecture:** Domain-Driven Design + Hexagonal architecture
- **Testing:** Jest
- **Bench-marking:** Auto-cannon
- **Payment Provider:** Paystack
