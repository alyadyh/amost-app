import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient , User } from '@supabase/supabase-js'
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

// Function to get the current authenticated user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }
  
  return data.user
}