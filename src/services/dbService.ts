import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, StoredAssessment, UserRole } from '../types/auth';

/**
 * Creates or updates a user profile document in Firestore
 */
export async function syncUserProfile(
  uid: string,
  email: string,
  displayName: string,
  role: UserRole = 'patient',
  preferredLanguage?: string
): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userDocRef);

  if (snapshot.exists()) {
    const existing = snapshot.data() as UserProfile;
    return existing;
  }

  const newProfile: UserProfile = {
    uid,
    email: email || '',
    displayName: displayName || (email ? email.split('@')[0] : 'User'),
    role,
    createdAt: new Date().toISOString(),
    preferredLanguage: (preferredLanguage as any) || 'hi',
  };

  await setDoc(userDocRef, newProfile);
  return newProfile;
}

/**
 * Fetch a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user role (patient, asha_worker, clinician)
 */
export async function updateUserRole(uid: string, newRole: UserRole): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, { role: newRole }, { merge: true });
}

/**
 * Save health risk assessment record into Firestore
 */
export async function saveAssessmentRecord(
  assessment: Omit<StoredAssessment, 'id'>
): Promise<string> {
  const collRef = collection(db, 'healthAssessments');
  const docRef = await addDoc(collRef, assessment);
  return docRef.id;
}

/**
 * Get assessments for a specific user (Patient view)
 */
export async function getUserAssessments(userId: string): Promise<StoredAssessment[]> {
  try {
    const collRef = collection(db, 'healthAssessments');
    const q = query(
      collRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(25)
    );
    const querySnapshot = await getDocs(q);
    const list: StoredAssessment[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...(docSnap.data() as Omit<StoredAssessment, 'id'>) });
    });
    return list;
  } catch (error) {
    // If index is building or query fails, fallback to unordered or client-side sort
    try {
      const collRef = collection(db, 'healthAssessments');
      const qFallback = query(collRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(qFallback);
      const list: StoredAssessment[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<StoredAssessment, 'id'>) });
      });
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (innerErr) {
      console.error('Error fetching user assessments:', innerErr);
      return [];
    }
  }
}

/**
 * Get all assessments for authorized health workers (ASHA Worker / Clinician role)
 */
export async function getAllAssessmentsForWorker(): Promise<StoredAssessment[]> {
  try {
    const collRef = collection(db, 'healthAssessments');
    const q = query(collRef, orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    const list: StoredAssessment[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...(docSnap.data() as Omit<StoredAssessment, 'id'>) });
    });
    return list;
  } catch (error) {
    try {
      const collRef = collection(db, 'healthAssessments');
      const querySnapshot = await getDocs(collRef);
      const list: StoredAssessment[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<StoredAssessment, 'id'>) });
      });
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (innerErr) {
      console.error('Error fetching worker assessments:', innerErr);
      return [];
    }
  }
}

/**
 * Delete an assessment
 */
export async function deleteAssessment(assessmentId: string): Promise<void> {
  const docRef = doc(db, 'healthAssessments', assessmentId);
  await deleteDoc(docRef);
}
