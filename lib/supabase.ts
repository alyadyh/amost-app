import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, Session, User } from '@supabase/supabase-js'
import Constants from 'expo-constants'

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
    const { data, error } = await supabase.from('medicines').select('*')
    if (error) {
      throw new Error(error.message)
    }
    return data
  } catch (error) {
    console.error('Error fetching medicines:', error)
    return null
  }
}

export const fetchLogsWithMedicines = async () => {
  const session = await getUserSession()
  try {
    const { data, error } = await supabase
      .from('med_logs')
      .select('*, medicines(*)')
      .eq('user_id', session?.user.id)
      .order('log_date', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }
    return data
  } catch (error) {
    console.error('Error fetching logs with medicines:', error)
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