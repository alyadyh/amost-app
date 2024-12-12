"use client";

import { supabase } from "@/constants/supabase";
import { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, fullname: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullname, email },
        emailRedirectTo: "amost://signIn",
      },
    });
  };

  const resetPasswordForEmail = async (email: string) => {
    const redirectTo = "amost://createPassword";
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  };

  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const onAuthStateChange = (
    callback: (event: string, session: Session | null) => void,
  ) => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      },
    );
    return authListener;
  };

  return {
    signIn,
    signUp,
    resetPasswordForEmail,
    updatePassword,
    signOut,
    onAuthStateChange,
  };
};

export const setSession = async (
  access_token: string,
  refresh_token: string,
) => {
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    console.error("Error setting session:", error);
    return null;
  }
  return data;
};

export const getUserSession = async (): Promise<Session | null> => {
  const { data: session, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }
  return session?.session ?? null;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  return data.user;
};

export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from("profiles").select("id").eq(
      "email",
      email,
    ).maybeSingle();

    if (error) {
      if (error.message === "The result contains 0 rows") {
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (err) {
    console.error("Error checking if email exists:", err);
    throw err;
  }
};
