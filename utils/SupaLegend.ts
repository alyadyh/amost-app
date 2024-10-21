import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { configureSynced } from '@legendapp/state/sync'
import { Log, Medicine } from '@/constants/types'
import { createClient, Session, User } from '@supabase/supabase-js';
import { observable, batch } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values'
import { Database } from './database.types';
import { useEffect } from 'react';

// Initialize Supabase client with custom session storage (AsyncStorage)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const generateId = () => uuidv4()

// Configure synced state with persistence
configureSynced(syncedSupabase, {
  persist: { plugin: observablePersistAsyncStorage({ AsyncStorage }) },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
});

// Observable to store the current user session dynamically
export const currentUser$ = observable<User | null>(null);

// Observable to track and persist the user ID
export const userId$ = observable<string>('');

// Sync the session and set observables for user and user ID
export const syncSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error);
    currentUser$.set(null);
    userId$.set('');
  } else {
    const user = data.session?.user ?? null;
    currentUser$.set(user);
    userId$.set(user?.id || '');
  }
};

// Hook to watch for authentication state changes and update observables
export const useAuth = () => {
  useEffect(() => {
    syncSession(); // Sync session on initial load

    // const { onAuthStateChange } = supabase.auth;
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      batch(() => {
        const user = session?.user ?? null;
        currentUser$.set(user);
        userId$.set(user?.id || '');
      });
    });

    // Unsubscribe properly
    return () => authListener.data.subscription.unsubscribe();
  }, []);
};

// Helper to retrieve the current user ID (supports offline mode)
export const getUserId = (): string => userId$.get();

// Authentication functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

// **Sign-up function with profile creation**
export const signUp = async (
  email: string,
  password: string,
  fullName: string
) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }, // Store additional user profile data
      emailRedirectTo: 'amost://confirm-email',
    },
  });
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
  currentUser$.set(null);
  userId$.set('');
};

// Utility to update user password
export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({ password: newPassword });
};

// Function to reset password with an email link
export const resetPasswordForEmail = async (email: string) => {
  const redirectTo = 'amost://reset-pass'; // Adjust for deep linking
  return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
};

// Profiles observable
export const profile$ = observable(
  syncedSupabase({
    supabase,
    collection: 'profiles',
    select: (from) => from.select('*'),
    filter: (select) => select.eq('user_id', getUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: { name: 'profiles', retrySync: true },
    retry: { infinite: true },
  })
);

// Fetch user profile
export const fetchUserProfile = () => {
  const userId = getUserId();
  return profile$[userId].get();
};

// Update user profile
export const updateUserProfile = async (newName: string, newAvatar: string) => {
  const userId = getUserId(); // Get the current user's ID

  if (!userId) {
    console.error('No user logged in');
    return;
  }

  // Get the current profile data from the observable
  const currentProfile = profile$[userId].get(); // Get the profile associated with the user ID

  if (!currentProfile) {
    throw new Error('Profile is not loaded into the observable.');
  }

  // Update profile in Supabase first
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: newName,
      avatar_url: newAvatar,
      updated_at: new Date().toISOString(), // Update the timestamp
    })
    .eq('id', userId);

  if (error) {
    console.error(`Error updating profile: ${error.message}`);
    throw new Error(error.message);
  }

  // Now update the observable with new values while preserving other fields
  profile$[userId].set({
    ...currentProfile, // Preserve existing fields like `id`, `deleted`, `updated_at`
    full_name: newName,  // Update the `full_name` field
    avatar_url: newAvatar,  // Update the `avatar_url` field
    updated_at: new Date().toISOString(), // Set `updated_at` field
    deleted: currentProfile.deleted ?? null, // Ensure `deleted` is preserved
  });
};


// ****
// CRUD
// ****

// Medicines observable
export const medicines$ = observable(
  syncedSupabase({
    supabase,
    collection: 'medicines',
    select: (from) => from.select('*'),
    filter: (select) => select.eq('user_id', getUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: { name: 'medicines', retrySync: true },
    retry: { infinite: true },
  })
)

// Logs observable
export const medLogs$ = observable(
  syncedSupabase({
    supabase,
    collection: 'med_logs',
    select: (from) => from.select('*'),
    filter: (select) => select.eq('user_id', getUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: { name: 'med_logs', retrySync: true },
    retry: { infinite: true },
  })
);

// CRUD Functions using observables

// Get all medicines
export const fetchMedicines = () => medicines$.get();

// Add a new medicine
export const addMedicine = (medicineData: Partial<Medicine>) => {
  const id = generateId();
  const userId = getUserId();

  // Ensure optional fields are either provided or set to null to match the expected types
  const newMedicine = {
    id,
    med_name: medicineData.med_name ?? '',
    med_form: medicineData.med_form ?? '',
    dosage: medicineData.dosage ?? '',
    dose_quantity: medicineData.dose_quantity ?? 0,
    frequency: medicineData.frequency ?? '',
    frequency_times_per_day: medicineData.frequency_times_per_day ?? 1,
    frequency_interval_days: medicineData.frequency_interval_days ?? 1,
    reminder_times: medicineData.reminder_times ?? [],
    duration: medicineData.duration ?? 1,
    stock_quantity: medicineData.stock_quantity ?? 0,
    med_photos: medicineData.med_photos ?? null,
    instructions: medicineData.instructions ?? null,
    prescribing_doctor: medicineData.prescribing_doctor ?? null,
    dispensing_pharmacy: medicineData.dispensing_pharmacy ?? null,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: null,
    deleted: false,
  };

  // Set the new medicine in the observable to trigger sync with Supabase
   medicines$[id].set(newMedicine);
};

// Upload an Med Image or Avatar to Supabase storage
export const uploadImage = async (imageUri: string, storagePath: string) => {
  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const fileExt = imageUri.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(storagePath)
    .upload(fileName, arrayBuffer, { contentType: `image/${fileExt}` });

  if (error) {
    console.error(`Error uploading image: ${error.message}`);
    throw new Error(error.message);
  }

  return `https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/${storagePath}/${data.path}`;
};

// Update an existing medicine
export const updateMedicine = (id: string, updatedData: Partial<Medicine>) => {
  const existingMedicine = medicines$[id].get(); // Get the current data to ensure required fields are present

  if (!existingMedicine) {
    throw new Error(`Medicine with id ${id} not found.`);
  }

  const updatedMedicine = {
    ...existingMedicine,
    ...updatedData, // Spread only defined fields
    updated_at: new Date().toISOString(),
  };

  // Ensure required fields like `created_at` are preserved
  medicines$[id].set(updatedMedicine);
};


// Soft delete a medicine by setting the "deleted" field to true
export const deleteMedicine = (id: string) => {
  medicines$[id].deleted.set(true);
};

// Get all logs
// Get all logs
export const fetchLogs = () => {
  const logs = medLogs$.get(); // Get the current logs from the observable

  // If logs is an object (keyed by IDs), convert it to an array
  if (logs && typeof logs === 'object' && !Array.isArray(logs)) {
    return Object.values(logs);
  }

  return logs || []; // Return an array (empty if no logs exist)
};


// Add or update a log entry
export const insertOrUpdateLog = (logData: Partial<Log>) => {
  const id = logData.id || uuidv4();
  const existingLog = medLogs$[id].get(); // Get existing log to prevent missing required fields

  const newLog = {
    ...existingLog, // Keep any existing data to ensure required fields are present
    ...logData, // Spread new log data
    id,
    user_id: getUserId(),
    med_name: logData.med_name ?? existingLog?.med_name ?? 'Unnamed Medicine',
    created_at: logData.created_at || existingLog?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted: logData.deleted ?? existingLog?.deleted ?? false,
  };

  medLogs$[id].set(newLog);
};


// Soft delete a log entry
export const deleteLog = (id: string) => {
  medLogs$[id].deleted.set(true);
};
