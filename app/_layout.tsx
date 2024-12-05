import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import "../global.css"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth, getUserSession, getCurrentUser, savePushTokenToSupabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import * as Linking from "expo-linking"
import { Toast, ToastTitle, useToast } from "@/components/ui/toast"
import { setSession as updateSession } from "@/lib/supabase"
import { StatusBar } from "@/components/ui/status-bar"
import * as Notifications from "expo-notifications"
import { registerForPushNotificationsAsync } from "@/lib/getToken"

export {
  ErrorBoundary,
} from "expo-router"

export const unstable_settings = {
  initialRouteName: "(tabs)",
}

SplashScreen.preventAutoHideAsync()

/**
 * RootLayout Component
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    ...FontAwesome.font,
  })

  const session = useSessionManagement()
  useDeepLinking()
  useNotificationHandler()

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav session={session} />
}

/**
 * RootLayoutNav Component
 */
function RootLayoutNav({ session }: { session: Session | null }) {
  const insets = useSafeAreaInsets()

  return (
    <GluestackUIProvider mode={"light"}>
      <StatusBar barStyle="light-content" translucent />
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="index" />
          {session ? (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(meds)" />
              <Stack.Screen name="(info)" />
            </>
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </SafeAreaView>
    </GluestackUIProvider>
  )
}

/**
 * Custom Hook: useSessionManagement
 * Manages Supabase session and authentication state.
 */
function useSessionManagement(): Session | null {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeSession = async () => {
      const currentSession = await getUserSession()
      setSession(currentSession)
      if (!currentSession) router.replace("/signIn")
      else await initializePushNotifications()
    }

    initializeSession()

    const { onAuthStateChange } = useAuth()
    const authListener = onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session) {
        await initializePushNotifications()
      } else {
        router.replace("/signIn")
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  return session
}

/**
 * Function: initializePushNotifications
 * Initializes push notifications and saves the token to Supabase.
 */
async function initializePushNotifications() {
  try {
    const token = await registerForPushNotificationsAsync()
    if (token) {
      const user = await getCurrentUser()
      if (user) {
        await savePushTokenToSupabase(user.id, token)
      }
    }
  } catch (error) {
    console.error("Error initializing push notifications:", error)
  }
}

/**
 * Custom Hook: useDeepLinking
 * Handles deep linking for email confirmation and password reset.
 */
function useDeepLinking() {
  const router = useRouter()
  const toast = useToast()

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
          // Await the session update to get the resolved sessionData
          const sessionData = await updateSession(access_token, refresh_token)
        }
      }
    }

    const subscription = Linking.addEventListener("url", handleDeepLink)

    return () => {
      subscription.remove()
    }
  }, [router, toast])
}

/**
 * Custom Hook: useNotificationHandler
 */
function useNotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
      const { data } = response.notification.request.content;

      if (data.action === "OPEN_APP") {
        router.push('/home');
      }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      subscription.remove();
    };
  }, [router]);
}

/**
 * Utility Function: showToast
 */
function showToast(toast: any, message: string) {
  toast.show({
    placement: "top left",
    render: ({ id }: { id: string }) => (
      <Toast nativeID={id} variant="solid" action="success">
        <ToastTitle>{message}</ToastTitle>
      </Toast>
    ),
  })
}
