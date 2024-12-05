// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "jsr:@supabase/supabase-js@2";

interface Notification {
  id: string;
  log_id: string;
  user_id: string;
  medicine_id: string;
  med_name: string;
  dosage: string;
  instructions?: string;
  log_date: string;
  reminder_time: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Notification;
  schema: "public";
  old_record: null | Notification;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function sendNotification(notif: Notification, pushToken: string) {
  const { med_name, dosage, instructions } = notif;

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("EXPO_ACCESS_TOKEN")}`,
    },
    body: JSON.stringify({
      to: pushToken,
      sound: "default",
      title: `${dosage} ${med_name} sekarang!`,
      body: instructions
        ? `${instructions}, jangan lupa catat log-mu ya~`
        : "Jangan lupa catat log-mu ya~",
      data: {
        notifId: notif.id,
        logId: notif.log_id,
        userId: notif.user_id,
        action: "OPEN_APP",
      },
    }),
  }).then((res) => res.json());

  return res;
}

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  const notif = payload.record;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("expo_push_token")
    .eq("id", notif.user_id)
    .single();

  if (!profileData || !profileData.expo_push_token) {
    console.error(`Expo push token not found for user: ${notif.user_id}`);
    return new Response("No push token found", { status: 400 });
  }

  const notificationResult = await sendNotification(
    notif,
    profileData.expo_push_token,
  );

  if (notificationResult.errors) {
    console.error("Failed to send notification:", notificationResult.errors);
    return new Response("Notification failed", { status: 500 });
  }

  console.log("Notification sent successfully");
  return new Response("Notification sent", { status: 200 });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notify' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
