import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email belum diisi").email(),
  password: z.string().min(1, "Password belum diisi"),
});

export const signUpSchema = z.object({
  fullname: z.string().min(1, "Nama belum diisi"),
  email: z.string().min(1, "Email belum diisi").email(),
  password: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(/.*[A-Z].*/, "Minimal harus terdiri dari satu huruf besar")
    .regex(/.*[a-z].*/, "Minimal harus terdiri dari satu huruf kecil")
    .regex(/.*\d.*/, "Minimal harus terdiri dari satu angka")
    .regex(
      /.*[`~<>?,./!@#$%^&*()\-_=+"|'{}[\]:\\].*/,
      "Minimal harus terdiri dari satu karakter simbol",
    ),
  confirmpassword: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(/.*[A-Z].*/, "Minimal harus terdiri dari satu huruf besar")
    .regex(/.*[a-z].*/, "Minimal harus terdiri dari satu huruf kecil")
    .regex(/.*\d.*/, "Minimal harus terdiri dari satu angka")
    .regex(
      /.*[`~<>?,./!@#$%^&*()\-_=+"|'{}[\]:\\].*/,
      "Minimal harus terdiri dari satu karakter simbol",
    ),
  privacyagreement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui Kebijakan Privasi dan Syarat Ketentuan",
  }),
});

export const createPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(/.*[A-Z].*/, "Satu huruf besar")
    .regex(/.*[a-z].*/, "Satu huruf kecil")
    .regex(/.*\d.*/, "Satu angka")
    .regex(/.*[`~<>?,./!@#$%^&*()\-_=+"|'{}[\]:\\].*/, "Satu karakter simbol"),
  confirmpassword: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(/.*[A-Z].*/, "Satu huruf besar")
    .regex(/.*[a-z].*/, "Satu huruf kecil")
    .regex(/.*\d.*/, "Satu angka")
    .regex(/.*[`~<>?,./!@#$%^&*()\-_=+"|'{}[\]:\\].*/, "Satu karakter simbol"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
});
