# Marketplace Context Test Suite

This document provides an overview of the comprehensive test suite created for all marketplace context
usecases.

## Test Files Created

### 1. **CompleteContractUseCase.test.ts**

Tests for completing contracts functionality:

- ✅ Successfully complete a contract
- ✅ Contract not found error handling
- ✅ Authorization checks (creator must own contract)
- ✅ Contract state updates (markAsCompleted, updateEndDate)
- ✅ Persistence to repository

**Test Cases: 7**

### 2. **CreateApplicationUseCase.test.ts**

Tests for creating gig applications:

- ✅ Successful application creation
- ✅ Freelancer existence validation
- ✅ Freelancer eligibility checks (canApplyForGig)
- ✅ Gig existence validation
- ✅ Duplicate application prevention
- ✅ Gig status validation
- ✅ Proper data persistence

**Test Cases: 9**

### 3. **CreateContractUseCase.test.ts**

Tests for contract creation from accepted applications:

- ✅ Contract creation from accepted applications
- ✅ Application validation
- ✅ Gig validation
- ✅ Authorization checks
- ✅ Application status validation (must be ACCEPTED)
- ✅ Contract properties (amount, currency, dates)
- ✅ Event publishing (ContractCreatedEvent)
- ✅ Proper data persistence

**Test Cases: 12**

### 4. **CreateGigUseCase.test.ts**

Tests for creating new gigs:

- ✅ Successful gig creation
- ✅ Proper gig properties initialization
- ✅ Response format validation
- ✅ Multiple tags handling
- ✅ Various price amounts
- ✅ Creator ID preservation
- ✅ Different categories
- ✅ Null deadline handling

**Test Cases: 12**

### 5. **DeleteGigUseCase.test.ts**

Tests for gig deletion:

- ✅ Successful gig deletion
- ✅ Gig not found error handling
- ✅ Authorization checks (creator must own gig)
- ✅ Deletion authorization verification
- ✅ Repository deletion call
- ✅ Multiple gig IDs and creators

**Test Cases: 11**

### 6. **GetContractUseCase.test.ts**

Tests for retrieving contract details (role-based):

- ✅ Contract retrieval for CREATOR role
- ✅ Contract retrieval for FREELANCER role
- ✅ Authorization checks per role
- ✅ Not found error handling
- ✅ Forbidden error for unauthorized access
- ✅ Contract state return
- ✅ Different contract statuses (ACTIVE, COMPLETED, CANCELLED)

**Test Cases: 18**

### 7. **GetGigUseCase.test.ts**

Tests for retrieving gig details:

- ✅ Gig retrieval by ID
- ✅ Not found error handling
- ✅ Gig state mapping
- ✅ Various gig statuses
- ✅ Different categories
- ✅ Multiple tags
- ✅ Different price amounts
- ✅ Deadline handling
- ✅ Creator ID preservation

**Test Cases: 16**

### 8. **ListApplicationsUseCase.test.ts**

Tests for listing applications (role-based with pagination):

- ✅ FREELANCER role - list freelancer's applications
- ✅ CREATOR role - list applications for creator's gigs
- ✅ Pagination calculation (skip/take)
- ✅ Total pages calculation
- ✅ Empty results handling
- ✅ getState invocation on each application
- ✅ Gig ID extraction from creator gigs
- ✅ Default pagination parameters
- ✅ Response metadata (page, total, totalPages)

**Test Cases: 20**

### 9. **ListContractsUseCase.test.ts**

Tests for listing contracts (role-based):

- ✅ CREATOR role - list creator's contracts
- ✅ FREELANCER role - list freelancer's contracts
- ✅ Not found error handling (no contracts)
- ✅ Empty contract list error
- ✅ getState invocation on each contract
- ✅ Single and multiple contracts
- ✅ Different contract statuses
- ✅ Mixed status contracts
- ✅ Response format validation

**Test Cases: 19**

### 10. **ListGigsUseCase.test.ts**

Tests for listing all gigs:

- ✅ Retrieve all gigs
- ✅ Not found error handling
- ✅ Empty gigs array handling
- ✅ getState invocation on each gig
- ✅ Single and multiple gigs
- ✅ Large datasets (100+ gigs)
- ✅ Different gig statuses
- ✅ Different categories
- ✅ Various prices
- ✅ Tags handling
- ✅ Creator diversity

**Test Cases: 21**

### 11. **UpdateApplicationStatusUseCase.test.ts**

Tests for updating applications (role-based):

- ✅ Not found error handling
- ✅ CREATOR role - status update only
- ✅ FREELANCER role - cover letter update only
- ✅ Invalid status validation
- ✅ Valid status updates
- ✅ Status enum validation
- ✅ Cover letter updates
- ✅ Role-based access control
- ✅ ApplicationAcceptedEvent handling
- ✅ Partial updates
- ✅ Empty updates

**Test Cases: 22**

### 12. **UpdateGigUseCase.test.ts**

Tests for updating gigs:

- ✅ Not found error handling
- ✅ Authorization checks (creator must own gig)
- ✅ Title updates
- ✅ Description updates
- ✅ Price updates
- ✅ Category updates
- ✅ Tags updates
- ✅ Deadline updates
- ✅ Multiple field updates
- ✅ Partial updates
- ✅ Response format validation
- ✅ Price increase/decrease scenarios
- ✅ Tags array handling

**Test Cases: 21**

## Summary Statistics

| Metric              | Count            |
| ------------------- | ---------------- |
| Total Test Files    | 12               |
| Total Test Cases    | 188+             |
| Usecases Tested     | 12               |
| Test Coverage Areas |                  |
| - Unit Tests        | ✅ Comprehensive |
| - Error Handling    | ✅ Complete      |
| - Authorization     | ✅ Role-based    |
| - Data Validation   | ✅ Thorough      |
| - Edge Cases        | ✅ Covered       |
| - Pagination        | ✅ Tested        |
| - State Management  | ✅ Validated     |

## Running the Tests

To run all tests in the marketplace context:

```bash
npm test -- src/contexts/Market-place/tests/usecases
```

To run a specific test file:

```bash
npm test -- src/contexts/Market-place/tests/usecases/CompleteContractUseCase.test.ts
```

To run tests with coverage:

```bash
npm test -- --coverage src/contexts/Market-place/tests/usecases
```

## Test Structure

Each test file follows a consistent structure:

1. **Setup** - Mock repositories and usecase initialization
2. **Test Groups** - Organized by functionality (execute, role-based, error scenarios, etc.)
3. **Individual Tests** - Focused on specific behavior
4. **Assertions** - Verify expected outcomes

## Key Testing Patterns Used

1. **Mocking** - Jest mocks for repositories and dependencies
2. **Arrange-Act-Assert** - Clear test setup and validation
3. **Error Testing** - Exception handling validation
4. **Authorization Testing** - Role-based access control validation
5. **Data Validation** - Input and output format verification
6. **Pagination Testing** - Offset and limit calculations
7. **State Management** - Entity state transitions
8. **Event Emission** - Domain event publishing
9. **Partial Updates** - Incomplete data handling
10. **Edge Cases** - Boundary conditions and special scenarios

## Notes

- All tests use Jest as the testing framework
- Tests are isolated with proper setup and teardown
- Mocks prevent external dependencies
- Tests focus on behavior, not implementation details
- Both happy path and error scenarios are covered
- Role-based access control is thoroughly tested
- Pagination logic is validated with various inputs

## Future Improvements

- Add integration tests
- Add E2E tests with actual database
- Add performance tests for bulk operations
- Add mutation testing
- Add snapshot testing where applicable
