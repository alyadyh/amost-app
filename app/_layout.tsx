import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import "../global.css"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import * as Linking from 'expo-linking'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

export const unstable_settings = {
  // Ensure that reloading on /modal keeps a back button present.
  initialRouteName: "(tabs)",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    ...FontAwesome.font,
  })

  const [session, setSession] = useState<Session | null>(null)
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false)
  const router = useRouter()

  // Supabase session management
  useEffect(() => {
    // Check session on load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) {
        // Redirect to sign-in if no session
        router.replace("/signIn")
      }
    })

    // Listen for session changes (sign-in, sign-out)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        // Redirect to sign-in if user logs out
        router.replace("/signIn")
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // Deep linking to handle email confirmation
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const data = Linking.parse(event.url)
      if (data.path === 'confirm-email') {
        // If the email confirmation link is clicked, set the confirmation state
        setIsEmailConfirmed(true)
        // Redirect to the sign-in page
        router.replace("/signIn")
      }
    }

    const subscription = Linking.addEventListener('url', handleDeepLink)

    return () => {
      subscription.remove()
    }
  }, [])

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  return <RootLayoutNav session={session} isEmailConfirmed={isEmailConfirmed} />
}

function RootLayoutNav({ session, isEmailConfirmed  }: { session: Session | null, isEmailConfirmed: boolean }) {
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

          {/* Pass isEmailConfirmed to the SignIn screen */}
          <Stack.Screen name="signIn" initialParams={{ isEmailConfirmed }} />
        </Stack>
      </SafeAreaView>
    </GluestackUIProvider>
  )
}