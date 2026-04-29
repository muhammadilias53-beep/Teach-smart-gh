# TeachSmart Ghana Security Specification

## 1. Data Invariants
- **Identity Lock**: A user can only access their own profile.
- **Ownership Integrity**: Lesson plans, schemes, and exams are owned by the creator (`authorId`). 
- **Relational Integrity**: Subscription status remains 'trial' until verified via server-side payment logic (though rules must protect against client-side escalations).
- **Format Validation**: All string fields must adhere to size limits to prevent resource exhaustion.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **The Ghost Writer**: Attempting to create a lesson plan with someone else's `authorId`.
2. **The Shadow Field**: Adding `isAdmin: true` to a user profile update.
3. **The ID Poison**: Sending a 2KB string as a document ID.
4. **The Time Warp**: Providing a future `createdAt` timestamp instead of `request.time`.
5. **The Price Hack**: Modifying `subscriptionStatus` to 'active' without a valid payment reference.
6. **The PII Leak**: Authenticated user 'A' trying to read user 'B's specific profile data.
7. **The Terminal Bypass**: Updating a 'cancelled' subscription record back to 'trial'.
8. **The State Jumper**: Changing a lesson plan's status/standard after it was finalized.
9. **The Blanket Scrape**: Running a query for all lesson plans without filtering by `authorId`.
10. **The Content Injector**: Injecting 1MB of junk text into the `contentStandard` field.
11. **The Relational Orphan**: Creating a lesson plan for a non-existent subject or level.
12. **The Anonymous Write**: Attempting to save a plan without being signed in.

## 3. Conflict Report
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
|------------|-------------------|--------------------|-------------------|
| users      | Blocked (isOwner) | Blocked (Invariants)| Blocked (Size)    |
| lessonPlans| Blocked (isValid) | Blocked (Immutable)| Blocked (Regex)   |
| schemes    | Blocked (isValid) | Blocked (Immutable)| Blocked (Regex)   |
| exams      | Blocked (isValid) | Blocked (Immutable)| Blocked (Regex)   |
