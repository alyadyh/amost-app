import { createClient, Session, User } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { observable } from '@legendapp/state'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { configureSynced } from '@legendapp/state/sync'
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { Log, Medicine } from '@/constants/types'

// Create the Supabase client
const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL!
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Configure synced function
const generateId = () => uuidv4()
const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: observablePersistAsyncStorage({ AsyncStorage }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
})

const uid = ''

// Define observables for medicines and med_logs
export const medicines$ = observable(
  customSynced({
    supabase,
    collection: 'medicines',
    select: (from) => from.select('*'),
    // Filter by the current user
    filter: (select) => select.eq('user_id', uid),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'medicines',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
)

export const medLogs$ = observable(
  customSynced({
    supabase,
    collection: 'med_logs',
    select: (from) => from.select('*'),
    // Filter by the current user
    filter: (select) => select.eq('user_id', uid),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'med_logs',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
)

export const profiles$ = observable(
  customSynced({
    supabase,
    collection: 'profiles',
    select: (from) => from.select('*'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'profiles',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
)

export const useAuth = () => {
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, fullname: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullname },
        emailRedirectTo: 'amost://confirm-email',
      },
    })
  }

  const resetPasswordForEmail = async (email: string) => {
    const redirectTo = 'amost://reset-pass'
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  }

  const updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password })
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
    return authListener
  }

  return { signIn, signUp, signOut, resetPasswordForEmail, updatePassword, onAuthStateChange }
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }
  return data.user
}

export const getUserSession = async (): Promise<Session | null> => {
  const { data: session, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error fetching session:', error)
    return null
  }
  return session?.session ?? null
}

export const fetchUserProfile = async (id: string) => {
  const session = await getUserSession()
  if (session?.user) {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', session.user.id)
      .single()

    if (error) {
      throw new Error(`Error fetching profile: ${error.message}`)
    }
    return profileData
  }
  return null
}

export const updateUserProfile = async (newName: string, newAvatar: string) => {
  const session = await getUserSession()
  if (session?.user) {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: newName, avatar_url: newAvatar })
      .eq('id', session.user.id)
      .single()

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`)
    }
  }
}

export const uploadAvatar = async (selectedImageUri: string) => {
  const response = await fetch(selectedImageUri)
  const arrayBuffer = await response.arrayBuffer()
  const fileExt = selectedImageUri.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, {
      contentType: `image/${fileExt}`,
    })

  if (error) {
    throw new Error(`Error uploading avatar: ${error.message}`)
  }
  const avatarUrl = `https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/avatars/${data.path}`
  return avatarUrl
}

export const uploadImage = async (selectedImageUri: string, storagePath: string) => {
  const response = await fetch(selectedImageUri)
  const arrayBuffer = await response.arrayBuffer()
  const fileExt = selectedImageUri.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(storagePath)
    .upload(fileName, arrayBuffer, {
      contentType: `image/${fileExt}`,
    })

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`)
  }

  const imageUrl = `https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/med_photos/${data.path}`
  return imageUrl
}

export const fetchMedicines = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.error('User not found');
      return [];
    }

    const { data, error } = await supabase.from('medicines').select('*').eq('user_id', user.id)
    if (error) {
      console.error('Error while fetching medicines:', error.message)
      throw new Error(error.message)
    }
    return data
  } catch (error) {
    console.error('Error fetching medicines:', error)
    return null
  }
}

export const deleteMedicine = async (medicineId: string) => {
  try {
    const { error } = await supabase.from('medicines').delete().eq('id', medicineId)
    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error deleting medicine:', error)
  }
}

export const fetchLog = async (medicineId: string, logDate: string, reminderTime: string) => {
  try {
    const { data, error } = await supabase
      .from('med_logs')
      .select('*')
      .eq('medicine_id', medicineId)
      .eq('log_date', logDate)
      .eq('reminder_time', reminderTime)
      .single()

    if (error) {
      throw new Error(`Error fetching log: ${error.message}`)
    }
    return data
  } catch (error) {
    console.error('Error during log fetch:', error)
    return null
  }
}

interface LogWithMedicine extends Log {
  medicines?: Medicine
}

export const fetchUserLogsWithMeds = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.error('User not found')
      return null
    }

    const { data: logsData, error } = await supabase
      .from('med_logs')
      .select('*, medicines(*)')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })

    if (error) {
      console.error('Error fetching logs with medicines:', error.message)
      return null
    }

    const today = new Date().toLocaleDateString('en-CA')

    // Filter logs to only include those up to today
    return logsData.filter((log: LogWithMedicine) => {
      const logDate = new Date(log.log_date).toLocaleDateString('en-CA')
      return logDate <= today
    })
  } catch (error) {
    console.error('Error fetching logs with medicines:', error)
    return null
  }
}


export const insertMedicine = async (medicineData: any, userId: string) => {
  try {
    const { error } = await supabase.from("medicines").insert({
      user_id: userId,
      ...medicineData,
    })

    if (error) {
      throw new Error(`Error inserting medicine: ${error.message}`)
    }
    return true
  } catch (error) {
    console.error("Error inserting medicine:", error)
    return false
  }
}

export const updateMedicine = async (medicineId: string, medicineData: any) => {
  try {
    const { error } = await supabase.from("medicines").update(medicineData).eq("id", medicineId)

    if (error) {
      throw new Error(`Error updating medicine: ${error.message}`)
    }
    return true
  } catch (error) {
    console.error("Error updating medicine:", error)
    return false
  }
}