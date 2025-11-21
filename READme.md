# Gig-Link 🧩

_A work-in-progress freelance marketplace backend_

## 🚧 Project Status

> **Note:** This project is currently under active development.
> Major features, contexts, and architectural components are still being implemented and refined. Expect breaking changes until the initial MVP release.

---

## 🧠 Overview

**Gig-Link** is a backend service for a modern freelance marketplace that connects **creators** and **freelancers** through verified contracts, secure escrow payments, and transparent collaboration workflows.

It aims to provide a structured, domain-driven foundation for scalable and secure freelance operations — including wallet systems, contract management, and payment integrity.

---

## ⚙️ Core Features (Planned & In Progress)

| Context            | Description                                                                  | Status         |
| ------------------ | ---------------------------------------------------------------------------- | -------------- |
| **Authentication** | User registration and login for both freelancers and creators                | ✅ In Progress |
| **Contracts**      | Create, manage, and complete contracts between users                         | ✅ Done |
| **Applications**   | Freelancers apply to gigs with status transitions (accept, reject, withdraw) | ✅ Done |
| **Escrow System**  | Holds payments securely until contract completion                            | ✅ In progress   |
| **Wallet System**  | Handles balance, deposits, withdrawals, and transactions                     | ✅ In progress     |
| **Payments**       | Integration with external payment provider (e.g., Paystack/Stripe)           | ✅ In progress     |
| **Disputes**       | Handle disagreements and refunds through admin or automated logic            | 🕓 Planned     |

---

## 🧩 Architecture Overview

Gig-Link follows a **Domain-Driven Design (DDD)** inspired modular architecture with clear separation of concerns:

- **Domain Layer** → Business entities and core logic
- **Application Layer** → Use cases and orchestration between repositories
- **Infrastructure Layer** → Database repositories and external integrations
- **Interface Layer** → REST controllers and request validation

This structure ensures maintainability, testability, and scalability as the project grows.

---

## 🗂️ Project Structure (Simplified)

```
src/
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

Unit and integration testing are being set up using **Jest**.
Each module will have isolated test suites covering its use cases and entities.

---

## 🧑‍💻 Tech Stack

- **Runtime:** Node.js + TypeScript (ES Modules)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Architecture:** Domain-Driven Design
- **Testing:** Jest
- **Payment Provider:** Paystack

---

## 📌 Disclaimer

This repository represents an **educational and experimental implementation** of a professional-grade marketplace backend.
The codebase is still evolving — expect frequent refactors and architectural changes as development continues.

---

