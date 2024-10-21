import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import "../global.css"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getUserId, useAuth, syncSession, supabase } from "@/utils/SupaLegend"
import { Session } from "@supabase/supabase-js"
import * as Linking from 'expo-linking'
import { Toast, ToastTitle, useToast } from "@/components/ui/toast"

export {
  ErrorBoundary,
} from "expo-router"

export const unstable_settings = {
  initialRouteName: "(tabs)",
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    ...FontAwesome.font,
  })

  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()
  const toast = useToast()

  // Supabase session management
  useEffect(() => {
    const checkSession = async () => {
      await syncSession() // Sync the session using `syncSession` from supalegend.ts
      const currentUserId = getUserId() // Get the user ID from observable

      if (!currentUserId) {
        router.replace("/signIn") // If no user ID, redirect to sign-in
      } else {
        const { data: userSession } = await supabase.auth.getSession()
        setSession(userSession?.session ?? null) // Set session based on Supabase session
      }
    }

    checkSession()

    // Use `supabase.auth.onAuthStateChange` directly for session updates
    const authListener = supabase.auth.onAuthStateChange(
      (_: string, session: Session | null) => {
        setSession(session) // Update the session state when authentication state changes
        if (!session) {
          router.replace("/signIn") // Redirect to sign-in if no session
        }
      }
    )

    return () => {
      authListener?.data?.subscription?.unsubscribe() // Clean up listener
    }
  }, [])

  // Handle deep linking for email confirmation and password reset
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event
      const { path, queryParams } = Linking.parse(url)

      if (queryParams) {
        const access_token = Array.isArray(queryParams.access_token)
          ? queryParams.access_token[0]
          : queryParams.access_token
        const refresh_token = Array.isArray(queryParams.refresh_token)
          ? queryParams.refresh_token[0]
          : queryParams.refresh_token

        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })

          if (error) {
            console.error("Error setting session from deep link:", error)
          } else {
            if (path === 'reset-pass') {
              toast.show({
                placement: "top left",
                render: ({ id }) => (
                  <Toast nativeID={id} variant="solid" action="success">
                    <ToastTitle>Ubah passwordmu sekarang!</ToastTitle>
                  </Toast>
                ),
              })
              router.replace("/(tabs)")
            } else if (path === 'confirm-email') {
              toast.show({
                placement: "top left",
                render: ({ id }) => (
                  <Toast nativeID={id} variant="solid" action="success">
                    <ToastTitle>Selamat datang di AMOST!.</ToastTitle>
                  </Toast>
                ),
              })
              router.replace("/(tabs)")
            }
          }
        }
      }
    }

    const subscription = Linking.addEventListener('url', handleDeepLink)

    return () => {
      subscription.remove() // Clean up deep link listener
    }
  }, [])

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav session={session} />
}

function RootLayoutNav({ session }: { session: Session | null }) {
  const insets = useSafeAreaInsets()

  return (
    <GluestackUIProvider mode={'light'}>
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="index" />
          {session ? (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(meds)" />
            </>
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </SafeAreaView>
    </GluestackUIProvider>
  )
}
