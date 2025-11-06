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
| **Authentication** | User registration and login for both freelancers and creators                | ✅ In progress |
| **Contracts**      | Create, manage, and complete contracts between users                         | ✅ In progress |
| **Applications**   | Freelancers apply to gigs with status transitions (accept, reject, withdraw) | ✅ In progress |
| **Escrow System**  | Holds payments securely until contract completion                            | 🔄 Planned     |
| **Wallet System**  | Handles balance, deposits, withdrawals, and transactions                     | 🔄 Planned     |
| **Payments**       | Integration with external payment provider (e.g., Paystack/Stripe)           | 🔄 Planned     |
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
├── modules/
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

## 🚀 Roadmap

- [ ] Finalize **Contract** module CRUD and transitions
- [ ] Implement **Wallet** and **Escrow** contexts
- [ ] Integrate **Payment Service Provider** (Paystack/Stripe)
- [ ] Add **Dispute Resolution** and **Refund** flow
- [ ] Complete **End-to-End** tests
- [ ] Deploy to a cloud environment (Supabase/Postgres backend)

---

## 🧑‍💻 Tech Stack

- **Runtime:** Node.js + TypeScript (ES Modules)
- **ORM:** Prisma
- **Database:** PostgreSQL (via Supabase)
- **Architecture:** Domain-Driven Design
- **Testing:** Jest
- **Payment Provider:** Paystack (planned)

---

## 📌 Disclaimer

This repository represents an **educational and experimental implementation** of a professional-grade marketplace backend.
The codebase is still evolving — expect frequent refactors and architectural changes as development continues.

---

## 🧭 Author

**Collins-okocha Bethel**
Backend Engineer | DDD & OOP Enthusiast

> _“Building structured logic from real-world complexity.”_

---

Would you like me to add a **section explaining the high-level domain contexts (Contracts, Applications, Wallet, Escrow)** with short 1-paragraph summaries each — so that new contributors or teammates instantly understand the system boundaries?
