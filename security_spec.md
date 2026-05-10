# Security Specification - Teacher's Resources App

## Data Invariants
1. A User profile must belong to the authenticated user and have a valid email.
2. Users can only read their own profile, unless they are an admin.
3. Resources, Notes, and SavedResources must have an `authorId` or `userId` matching the creator/owner.
4. Notifications can be read by the owner or if targeted at 'all'.
5. News history is system-only (Admin only).

## The "Dirty Dozen" Payloads (Denial Tests)

1. **Identity Spoofing**: Attempt to create a user profile with a different UID.
   ```json
   { "uid": "attacker_id", "email": "victim@example.com", "displayName": "Victim" }
   ```
2. **State Shortcutting**: Attempt to update `subscriptionStatus` to 'active' directly from client.
3. **Ghost Field Injection**: Adding `isVerified: true` to a profile update.
4. **PII Blanket Read**: Authenticated user trying to `get` another user's profile.
5. **Orphaned Resource**: Creating a resource without a valid `authorId` or matching `request.auth.uid`.
6. **Notification Hijack**: Authenticated user trying to read someone else's targeted notification.
7. **News Tampering**: Non-admin trying to write to `news_history`.
8. **Admin Privilege Escalation**: User trying to change their own `role` or `plan`.
9. **Large Payload Attack**: Sending 1MB string in `displayName`.
10. **ID Poisoning**: Using a 2KB string as a `resourceId`.
11. **Timestamp Spoofing**: Sending a past `updatedAt` instead of `request.time`.
12. **System Field Modification**: Attempting to change `authorId` on an existing resource.

## Red Team Evaluation Plan
- Verify that `isOwner` check is present and correct.
- Verify `isValidId` and `.size()` checks on all string inputs.
- Verify `affectedKeys().hasOnly()` gates for all updates.
- Verify `isVerified()` check for creating content.
