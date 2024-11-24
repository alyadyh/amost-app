import { Log } from '@/constants/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, Session, User } from '@supabase/supabase-js'
import { format } from 'date-fns'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL!
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// Function to set the session using access and refresh tokens
export const setSession = async (access_token: string, refresh_token: string) => {
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token
  })

  if (error) {
    console.error('Error setting session:', error)
    return null
  }
  return data
}

// Authentication functions
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
        emailRedirectTo: 'amost://confirm-email'
      }
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

// User-related functions
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

// Medicine-related functions
export const fetchMedicines = async () => {
  const session = await getUserSession()
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', session?.user.id)
    if (error) {
      throw new Error(error.message)
    }
    return data
  } catch (error) {
    console.error('Error fetching medicines:', error)
    return null
  }
}

export const insertMedicine = async (medicineData: any, userId: string) => {
  try {
    const { error } = await supabase.from('medicines').insert({
      user_id: userId,
      ...medicineData
    })

    if (error) {
      throw new Error(`Error inserting medicine: ${error.message}`)
    }
    return true
  } catch (error) {
    console.error('Error inserting medicine:', error)
    return false
  }
}

export const updateMedicine = async (medicineId: string, medicineData: any) => {
  try {
    const { error } = await supabase.from('medicines').update(medicineData).eq('id', medicineId)

    if (error) {
      throw new Error(`Error updating medicine: ${error.message}`)
    }
    return true
  } catch (error) {
    console.error('Error updating medicine:', error)
    return false
  }
}

export const deleteMedicine = async (medicineId: string, onSuccess?: () => void) => {
  const { error } = await supabase.from('medicines').delete().eq('id', medicineId)
  if (error) {
    console.error('Error deleting medicine:', error.message)
    throw error
  }
  onSuccess && onSuccess()
}

export const uploadImage = async (selectedImageUri: string, storagePath: string) => {
  const response = await fetch(selectedImageUri)
  const arrayBuffer = await response.arrayBuffer()
  const fileExt = selectedImageUri.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage.from(storagePath).upload(fileName, arrayBuffer, {
    contentType: `image/${fileExt}`
  })

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`)
  }

  const imageUrl = `https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/${storagePath}/${data.path}`
  return imageUrl
}

// Log-related functions
export const fetchLog = async () => {
  const session = await getUserSession()
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('user_id', session?.user.id)
      .order('log_date', { ascending: false })

    if (error) {
      throw new Error(`Error fetching log: ${error.message}`)
    }
    return data
  } catch (error) {
    console.error('Error during log fetch:', error)
    return null
  }
}

export const updateLog = async (logData: {
  user_id: string
  medicine_id: string
  med_name: string
  log_date: string
  reminder_time: string
  taken: boolean | null
  log_time?: string | null
}) => {
  const { data, error } = await supabase.from('logs').upsert(logData)
  // const { data, error } = await supabase.from('logs').upsert(logData, {
  //   onConflict: 'user_id,medicine_id,reminder_time'
  // })
  if (error) {
    console.error('Error upserting log:', error.message)
    throw error
  }
  return data
}

export const fetchMonthLogs = async (userId: string, oneMonthAgo: Date): Promise<Log[]> => {
  try {
    const { data: logsData, error: logsError } = await supabase
      .from('logs')
      .select('*')
      .eq('user_id', userId)
      .eq('taken', true)
      .gte('log_date', oneMonthAgo.toISOString())

    if (logsError) {
      throw new Error(logsError.message)
    }

    // Filter out logs with no associated medicine
    const validLogs: Log[] = logsData?.filter(log => log.medicine_id !== null && log.medicine !== null) || []

    return validLogs
  } catch (error) {
    console.error('Error fetching logs:', error)
    return []
  }
}

export const fetchWeeklyLogs = async (userId: string, startOfWeekDate: Date, endOfWeekDate: Date): Promise<Log[]> => {
  try {
    // Fetch logs for the user within the current week (Monday to Sunday)
    const { data: logsData, error: logsError } = await supabase
      .from('logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', format(startOfWeekDate, 'yyyy-MM-dd')) // Ensure the date format is consistent
      .lte('log_date', format(endOfWeekDate, 'yyyy-MM-dd')) // End date of the week

    if (logsError) {
      throw new Error(logsError.message)
    }

    // Return the fetched logs
    return logsData || []
  } catch (error) {
    console.error('Error fetching logs for week:', error)
    return []
  }
}
