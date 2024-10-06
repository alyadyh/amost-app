import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient , Session, User } from '@supabase/supabase-js'
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
  /**
   * Sign in a user with email and password.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns The sign-in response from Supabase.
   */
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  /**
   * Sign up a new user with email, password, and fullname.
   * @param email - User's email address.
   * @param password - User's password.
   * @param fullname - User's full name.
   * @returns The sign-up response from Supabase.
   */
  const signUp = async (email: string, password: string, fullname: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullname },
        emailRedirectTo: "amost://confirm-email",
      },
    })
  }

  /**
   * Send a password reset email to the user.
   * @param email - User's email address.
   * @returns The password reset response from Supabase.
   */
  const resetPasswordForEmail = async (email: string) => {
    const redirectTo = "amost://reset-pass"
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
  }


  /**
   * Update the user's password.
   * @param password - New password.
   * @returns The password update response from Supabase.
   */
  const updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password })
  }
  
  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  /**
   * Listen for authentication state changes.
   * Particularly useful for handling password recovery flows.
   * @param callback - Function to execute on auth state changes.
   */
  const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })

    return authListener
  }

  return { signIn, signUp, signOut, resetPasswordForEmail, updatePassword, onAuthStateChange }
}


// Function to get the current authenticated user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }
  
  return data.user
}

// Helper function to get the current session and user ID
export const getUserSession = async (): Promise<Session | null> => {
  const { data: session, error } = await supabase.auth.getSession()
  if (error) {
    console.error("Error fetching session:", error)
    return null
  }
  return session?.session ?? null
}

/**
 * Fetch the user's profile from the Supabase 'profiles' table.
 * @returns Profile data with full name and avatar URL.
 */
export const fetchUserProfile = async (id: string) => {
  const session = await getUserSession()

  if (session?.user) {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", session.user.id)
      .single()

    if (error) {
      throw new Error(`Error fetching profile: ${error.message}`)
    }
    return profileData
  } else {
    return null
  }
}

/**
 * Update the user's profile with new name and avatar.
 * @param newName - Updated full name of the user.
 * @param newAvatar - Updated avatar URL for the user.
 */
export const updateUserProfile = async (newName: string, newAvatar: string) => {
  const session = await getUserSession()

  if (session?.user) {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: newName, avatar_url: newAvatar })
      .eq("id", session.user.id)
      .single()

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`)
    }
  }
}

/**
 * Upload a new avatar image to Supabase storage.
 * @param selectedImageUri - URI of the image selected by the user.
 * @returns The path of the uploaded avatar image.
 */
export const uploadAvatar = async (selectedImageUri: string) => {
  const response = await fetch(selectedImageUri)
  const arrayBuffer = await response.arrayBuffer()
  const fileExt = selectedImageUri.split(".").pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(fileName, arrayBuffer, {
      contentType: `image/${fileExt}`,
    })

  if (error) {
    throw new Error(`Error uploading avatar: ${error.message}`)
  }
  // return data.path
  const avatarUrl = `https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/avatars/${data.path}`
  return avatarUrl
}