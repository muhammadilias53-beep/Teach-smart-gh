/**
 * Email Security and Canonicalization Utilities for TeachSmartGH
 * Prevents disposable email churning and Gmail alias (+tag) trial abuse.
 */

// Popular disposable / temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'sharklasers.com',
  'grr.la',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  '10minutemail.net',
  'trashmail.com',
  'trashmail.net',
  'trashmail.org',
  'yopmail.com',
  'yopmail.net',
  'throwawaymail.com',
  'getairmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'mohmal.com',
  'generator.email',
  'burnermail.io',
  'mytemp.email',
  'crazymailing.com',
  'dropmail.me',
  'nada.ltd',
  'inboxkitten.com'
]);

/**
 * Checks if an email uses a known disposable / throwaway domain.
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.trim().toLowerCase().split('@')[1];
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Canonicalizes an email address to identify identical mailboxes.
 * 1. Lowers case and trims whitespace.
 * 2. For Gmail/Googlemail: removes dots before '@' and strips '+tags' (e.g. user+1@gmail.com -> user@gmail.com).
 * 3. For other providers: strips '+tags' if present.
 */
export function canonicalizeEmail(email: string): string {
  if (!email || !email.includes('@')) return (email || '').trim().toLowerCase();
  
  const [rawLocal, rawDomain] = email.trim().toLowerCase().split('@');
  let localPart = rawLocal;
  let domainPart = rawDomain;

  if (domainPart === 'googlemail.com') {
    domainPart = 'gmail.com';
  }

  // Strip '+' tags (sub-addressing / aliases)
  if (localPart.includes('+')) {
    localPart = localPart.split('+')[0];
  }

  // For Gmail, remove all dots from the local part (john.doe == johndoe)
  if (domainPart === 'gmail.com') {
    localPart = localPart.replace(/\./g, '');
  }

  return `${localPart}@${domainPart}`;
}
