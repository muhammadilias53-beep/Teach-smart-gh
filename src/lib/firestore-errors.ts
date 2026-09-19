import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Detects if a Firestore error is caused by daily/free-tier quota exhaustion or offline network state.
 */
export function isFirestoreQuotaOrOfflineError(error: unknown): boolean {
  if (!error) return false;
  const errObj = error as any;
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code = String(errObj?.code || '').toLowerCase();
  return (
    code === 'resource-exhausted' ||
    code === 'unavailable' ||
    code === 'failed-precondition' ||
    msg.includes('quota limit exceeded') ||
    msg.includes('quota exceeded') ||
    msg.includes('free daily read units') ||
    msg.includes('resource-exhausted') ||
    msg.includes('offline') ||
    msg.includes('unavailable') ||
    msg.includes('network')
  );
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isQuotaOrOffline = isFirestoreQuotaOrOfflineError(error);

  if (isQuotaOrOffline) {
    console.warn(`[Firestore Resilient Cache] ${operationType.toUpperCase()} on '${path || 'unknown'}' fell back to local offline mode:`, error instanceof Error ? error.message : error);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

