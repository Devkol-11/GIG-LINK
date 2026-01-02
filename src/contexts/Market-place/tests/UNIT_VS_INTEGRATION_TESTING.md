# Unit vs. Integration Tests: Analysis & Implementation Guide

## Quick Answer

**The repository tests created (GigRepository, ApplicationRepository, ContractRepository,
FreelancerRepository, CreatorRepository) are UNIT TESTS** because they:

- ✅ Mock the Prisma database client entirely
- ✅ Isolate the repository code from actual database
- ✅ Test only repository logic without external dependencies
- ✅ Verify correct method calls to Prisma (not actual data operations)

---

## Table of Contents

1. [Unit Tests vs Integration Tests](#unit-tests-vs-integration-tests)
2. [Current Repository Tests Analysis](#current-repository-tests-analysis)
3. [How to Convert to Integration Tests](#how-to-convert-to-integration-tests)
4. [How to Convert to Proper Unit Tests](#how-to-convert-to-proper-unit-tests)
5. [Best Practices](#best-practices)
6. [When to Use Each](#when-to-use-each)

---

## Unit Tests vs Integration Tests

### Unit Tests

**Definition:** Test a single unit of code in isolation with all external dependencies mocked.

**Characteristics:**

- Fast execution (milliseconds)
- No external services required
- All dependencies mocked
- Tests specific function/method behavior
- Easy to debug failures
- High coverage with minimal data

**Example:**

```typescript
// UNIT TEST: Tests only the save method logic
mockPrismaContract.upsert.mockResolvedValue(mockRecord);
const result = await contractRepository.save(mockContract);
expect(mockPrismaContract.upsert).toHaveBeenCalledWith({...});
```

### Integration Tests

**Definition:** Test how multiple components work together, often involving real external services.

**Characteristics:**

- Slower execution (seconds/minutes)
- Uses real databases or test databases
- Tests actual data flow end-to-end
- Validates schema compliance
- Tests actual Prisma queries execute correctly
- Larger data sets and realistic scenarios

**Example:**

```typescript
// INTEGRATION TEST: Tests actual database interaction
const savedContract = await contractRepository.save(mockContract);
const retrieved = await contractRepository.findById(savedContract.id);
expect(retrieved.status).toBe(mockContract.status);
```

---

## Current Repository Tests Analysis

### What We Have (Unit Tests)

```typescript
// UNIT TEST PATTERN
jest.mock('@core/Prisma/prisma.client.js');

beforeEach(() => {
  mockPrismaContract = prismaDbClient.contract as jest.Mocked<...>;
  contractRepository = new ContractRepository();
});

it('should upsert a contract', async () => {
  mockPrismaContract.upsert.mockResolvedValue(mockRecord as any);
  const result = await contractRepository.save(mockContract);
  expect(mockPrismaContract.upsert).toHaveBeenCalledWith({...});
});
```

**Analysis:**

- ✅ Mocks entire Prisma module
- ✅ Tests repository method calls only
- ✅ Verifies correct parameters passed to Prisma
- ✅ Does NOT verify actual database state
- ✅ Does NOT verify schema compliance
- ✅ Very fast (~10-20ms per test)

**Files with this pattern:**

1. `GigRepository.test.ts` - 18 unit tests
2. `ApplicationRepository.test.ts` - 19 unit tests
3. `ContractRepository.test.ts` - 14 unit tests
4. `FreelancerRepository.test.ts` - 13 unit tests
5. `CreatorRepository.test.ts` - 14 unit tests

**Total: 78 unit tests** covering 33 repository methods

---

## How to Convert to Integration Tests

### Step 1: Remove Prisma Mock

**Before (Unit Test):**

```typescript
jest.mock('@core/Prisma/prisma.client.js');
```

**After (Integration Test):**

```typescript
// Remove the mock - import actual Prisma client
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
```

### Step 2: Set Up Test Database

Create `setupTests.ts` or `jest.setup.ts`:

```typescript
// jest.setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
        // Run migrations on test database
        // This creates actual schema
        await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS test_db;`);
        await prisma.$executeRawUnsafe(`CREATE DATABASE test_db;`);
});

afterAll(async () => {
        await prisma.$disconnect();
});
```

### Step 3: Clean Database Between Tests

```typescript
describe('ContractRepository - INTEGRATION TESTS', () => {
        let contractRepository: ContractRepository;

        beforeEach(async () => {
                // Clear all data before each test
                await prismaDbClient.contract.deleteMany({});
                await prismaDbClient.application.deleteMany({});
                await prismaDbClient.gig.deleteMany({});
        });

        afterAll(async () => {
                await prismaDbClient.$disconnect();
        });

        it('should save and retrieve contract', async () => {
                // Create real data
                const contract = await contractRepository.save(
                        new Contract({
                                id: 'contract-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING'
                        })
                );

                // Verify real data was saved
                const retrieved = await contractRepository.findById(contract.id);
                expect(retrieved.status).toBe('ACTIVE');
                expect(retrieved.amountKobo).toBe(50000);
        });
});
```

### Step 4: Test Real Queries

```typescript
it('should find contracts by gig id with real data', async () => {
  // Create seed data
  const gig = new Gig({ id: 'gig-456', creatorId: 'creator-101', ... });
  const savedGig = await gigRepository.save(gig);

  const contract = new Contract({
    id: 'contract-123',
    gigId: savedGig.id,
    ...
  });
  await contractRepository.save(contract);

  // Test actual Prisma query
  const found = await contractRepository.findByGigId(savedGig.id);

  // Assertions verify real data
  expect(found).toBeDefined();
  expect(found.gigId).toBe(savedGig.id);
});
```

### Step 5: Update jest.config.js

```typescript
// jest.config.js
module.exports = {
        testEnvironment: 'node',
        setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
        testMatch: [
                '**/__tests__/**/*.test.ts',
                // For integration tests
                '**/__tests__/**/*.integration.test.ts'
        ]
};
```

### Full Integration Test Example

```typescript
import { ContractRepository } from '../../adapters/ContractRepository.js';
import { Contract } from '../../domain/entities/Contract.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

describe('ContractRepository - INTEGRATION TESTS', () => {
        let contractRepository: ContractRepository;

        beforeAll(async () => {
                // Setup test database
                // This would use a test database connection
        });

        beforeEach(async () => {
                // Clear data before each test
                await prismaDbClient.contract.deleteMany({});
        });

        afterAll(async () => {
                await prismaDbClient.$disconnect();
        });

        it('should save contract to real database', async () => {
                const contractEntity = new Contract({
                        id: 'contract-123',
                        gigId: 'gig-456',
                        applicationId: 'app-789',
                        creatorId: 'creator-101',
                        freelancerId: 'freelancer-202',
                        amountKobo: 50000,
                        currency: 'NGN',
                        startDate: new Date(),
                        endDate: null,
                        status: 'ACTIVE',
                        paymentStatus: 'PENDING'
                });

                // Save to real database
                const saved = await contractRepository.save(contractEntity);

                // Verify in real database
                const found = await prismaDbClient.contract.findUnique({
                        where: { id: saved.id }
                });

                expect(found).toBeDefined();
                expect(found?.status).toBe('ACTIVE');
                expect(found?.amountKobo).toBe(50000);
        });

        it('should find contract by gig with real query', async () => {
                // Create multiple contracts
                await prismaDbClient.contract.create({
                        data: {
                                id: 'contract-1',
                                gigId: 'gig-456',
                                applicationId: 'app-1',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING'
                        }
                });

                // Test actual repository method
                const found = await contractRepository.findByGigId('gig-456');

                expect(found).toBeDefined();
                expect(found?.gigId).toBe('gig-456');
        });

        it('should update contract in real database', async () => {
                // Create contract
                const contract = await prismaDbClient.contract.create({
                        data: {
                                id: 'contract-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING'
                        }
                });

                // Update via repository
                const updated = await contractRepository.update(contract.id, {
                        status: 'COMPLETED',
                        paymentStatus: 'PAID'
                });

                // Verify in database
                const found = await prismaDbClient.contract.findUnique({
                        where: { id: contract.id }
                });

                expect(found?.status).toBe('COMPLETED');
                expect(found?.paymentStatus).toBe('PAID');
        });
});
```

---

## How to Convert to Proper Unit Tests

### Current State Analysis

Your current tests ARE already unit tests, but they can be improved by:

1. **More specific mock assertions**
2. **Testing edge cases**
3. **Testing error scenarios**
4. **Mocking at correct level**

### Enhancement Example

**Basic Unit Test (Current):**

```typescript
it('should save contract', async () => {
        mockPrismaContract.upsert.mockResolvedValue(mockRecord);
        const result = await contractRepository.save(mockContract);
        expect(mockPrismaContract.upsert).toHaveBeenCalled();
});
```

**Enhanced Unit Test:**

```typescript
it('should save contract with correct upsert parameters', async () => {
        const contractState = {
                id: 'contract-123',
                gigId: 'gig-456',
                amountKobo: 50000,
                status: 'ACTIVE'
        };

        const mockContract = {
                id: 'contract-123',
                getState: jest.fn().mockReturnValue(contractState)
        };

        mockPrismaContract.upsert.mockResolvedValue(contractState);

        await contractRepository.save(mockContract);

        // ENHANCED: Verify exact parameters
        expect(mockPrismaContract.upsert).toHaveBeenCalledWith({
                where: { id: 'contract-123' },
                update: contractState,
                create: contractState
        });

        // ENHANCED: Verify no other methods called
        expect(mockPrismaContract.findUnique).not.toHaveBeenCalled();
        expect(mockPrismaContract.delete).not.toHaveBeenCalled();
});

it('should handle database errors gracefully', async () => {
        const error = new Error('Unique constraint violation');
        mockPrismaContract.upsert.mockRejectedValue(error);

        const mockContract = {
                id: 'contract-123',
                getState: jest.fn().mockReturnValue({ id: 'contract-123' })
        };

        await expect(contractRepository.save(mockContract)).rejects.toThrow('Unique constraint violation');
});

it('should transform entity state correctly', async () => {
        const mockContract = {
                id: 'contract-123',
                getState: jest.fn().mockReturnValue({
                        id: 'contract-123',
                        amountKobo: 50000,
                        currency: 'NGN'
                })
        };

        mockPrismaContract.upsert.mockResolvedValue({
                id: 'contract-123',
                amountKobo: 50000
        });

        await contractRepository.save(mockContract);

        // Verify getState was called to extract entity data
        expect(mockContract.getState).toHaveBeenCalled();
});
```

### Unit Test Best Practices

```typescript
describe('ContractRepository - UNIT TESTS (Enhanced)', () => {
  let contractRepository: ContractRepository;
  let mockPrismaContract: jest.Mocked<typeof prismaDbClient.contract>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaContract = prismaDbClient.contract as jest.Mocked<...>;
    contractRepository = new ContractRepository();
  });

  describe('save', () => {
    // Test successful save
    it('should save contract and call upsert', async () => {
      // Arrange
      const contractData = { id: 'contract-123', status: 'ACTIVE' };
      const mockContract = {
        id: 'contract-123',
        getState: jest.fn().mockReturnValue(contractData),
      };
      mockPrismaContract.upsert.mockResolvedValue(contractData);

      // Act
      await contractRepository.save(mockContract);

      // Assert
      expect(mockPrismaContract.upsert).toHaveBeenCalledWith({
        where: { id: 'contract-123' },
        update: contractData,
        create: contractData,
      });
    });

    // Test error handling
    it('should throw error if upsert fails', async () => {
      const error = new Error('DB Error');
      mockPrismaContract.upsert.mockRejectedValue(error);

      await expect(
        contractRepository.save(mockContract)
      ).rejects.toThrow('DB Error');
    });

    // Test null handling
    it('should handle null contract state', async () => {
      const mockContract = {
        id: 'contract-123',
        getState: jest.fn().mockReturnValue(null),
      };

      // Should either throw or handle gracefully
      // depending on implementation
    });
  });

  describe('findById', () => {
    it('should call findUnique with correct id', async () => {
      mockPrismaContract.findUnique.mockResolvedValue(null);

      await contractRepository.findById('contract-123');

      expect(mockPrismaContract.findUnique).toHaveBeenCalledWith({
        where: { id: 'contract-123' },
      });
    });

    it('should return null for non-existent contract', async () => {
      mockPrismaContract.findUnique.mockResolvedValue(null);

      const result = await contractRepository.findById('non-existent');

      expect(result).toBeNull();
    });

    it('should return contract entity if found', async () => {
      const mockData = { id: 'contract-123', status: 'ACTIVE' };
      mockPrismaContract.findUnique.mockResolvedValue(mockData);

      const result = await contractRepository.findById('contract-123');

      expect(result).toBeDefined();
    });
  });
});
```

---

## Best Practices

### For Unit Tests

✅ **DO:**

- Mock external dependencies (database, APIs, etc.)
- Test one thing per test
- Use descriptive test names
- Test edge cases and error scenarios
- Keep tests fast (< 100ms per test)
- Use Arrange-Act-Assert pattern

❌ **DON'T:**

- Hit real databases
- Make network requests
- Depend on external services
- Test multiple concerns in one test
- Use real time/dates (use mocks)

### For Integration Tests

✅ **DO:**

- Use real database connection (test database)
- Test end-to-end flows
- Verify schema compliance
- Test with realistic data
- Clean up data between tests
- Use transactions for safety

❌ **DON'T:**

- Mock the database
- Test in isolation
- Ignore database constraints
- Skip migrations
- Leave test data in database

---

## When to Use Each

### Use Unit Tests When:

- Testing business logic
- Testing repository methods in isolation
- Need fast feedback (CI/CD)
- Testing error handling
- Testing parameter validation
- You need high test coverage

**Example:** Current ContractRepository tests

### Use Integration Tests When:

- Testing actual database interactions
- Need to verify schema compliance
- Testing data relationships
- Testing pagination with real data
- Testing transaction handling
- Validating ORM queries work correctly

**Example:** Testing that pagination returns correct data

### Use Both When:

- Building production systems
- Critical code paths
- Database queries are complex
- Data consistency is important
- Need full coverage (unit + integration)

**Recommended ratio:** 70% unit tests, 30% integration tests

---

## Migration Strategy

### Phase 1: Keep Current Unit Tests

- Your current 78 unit tests are valuable
- They provide fast feedback
- They catch logic errors early

### Phase 2: Add Integration Tests

Create `.integration.test.ts` files alongside unit tests:

```
adapters/
├── GigRepository.ts
├── GigRepository.test.ts           (unit tests - keep)
├── GigRepository.integration.test.ts (new - integration)
├── ApplicationRepository.ts
├── ApplicationRepository.test.ts    (unit tests - keep)
├── ApplicationRepository.integration.test.ts (new - integration)
```

### Phase 3: Run Both Test Suites

```json
{
        "scripts": {
                "test": "jest --testPathPattern=\\.test\\.ts$",
                "test:integration": "jest --testPathPattern=\\.integration\\.test\\.ts$",
                "test:all": "jest"
        }
}
```

### Phase 4: CI/CD Integration

- Run unit tests on every commit (fast)
- Run integration tests on main branch (slower)
- Run all tests before production deployment

---

## Summary

| Aspect                 | Unit Tests                | Integration Tests      |
| ---------------------- | ------------------------- | ---------------------- |
| **Current Status**     | ✅ Implemented (78 tests) | ❌ Not yet created     |
| **Database**           | Mocked                    | Real test database     |
| **Speed**              | Fast (<1s for all)        | Slow (10-30s+)         |
| **Isolation**          | Complete                  | Interconnected         |
| **CI/CD Frequency**    | Every commit              | Before merge/deploy    |
| **Effort**             | Lower                     | Higher                 |
| **Coverage**           | Good                      | Better for integration |
| **Debugging**          | Easier                    | Harder                 |
| **Real-world Testing** | Limited                   | Comprehensive          |

**Next Steps:**

1. Keep your current unit tests
2. Create test database setup in `jest.setup.ts`
3. Create integration tests mirroring unit tests
4. Add `.integration.test.ts` files for each repository
5. Update CI/CD to run both test types
