import { z } from "zod";

export const baseMedSchema = z.object({
  med_name: z.string().min(1, "Nama Obat belum diisi"),
  med_form: z.string().min(1, "Bentuk Obat belum diisi"),
  dosage: z.string().min(1, "Dosis belum diisi"),
  dose_quantity: z.number().positive(),
  frequency: z.string().min(1, "Frekuensi belum diisi"),
  frequency_times_per_day: z.number().min(1),
  frequency_interval_days: z.number().min(1),
  reminder_times: z.array(z.date().refine((date) => !isNaN(date.getTime()), { message: "Pengingat belum dipilih" })),
  stock_quantity: z.number().positive("Stok Obat harus lebih dari 0").min(1, "Stok Obat belum diisi"),
  duration: z.number().positive("Durasi harus lebih dari 0").min(1, "Durasi belum diisi"),
  instructions: z.string().optional(),
  prescribing_doctor: z.string().optional(),
  dispensing_pharmacy: z.string().optional(),
  med_photos: z.string().optional(),
});

export const addMedSchema = baseMedSchema.extend({
  // No dditional fields specific to AddMed
});

export const editMedSchema = baseMedSchema.extend({
  reminder_times: z.array(z.string().min(1, "Pengingat belum dipilih")), // reminder_times as string in edit form
  instructions: z.string().nullable().optional().transform((val) => val ?? ""),
  prescribing_doctor: z.string().nullable().optional().transform((val) => val ?? ""),
  dispensing_pharmacy: z.string().nullable().optional().transform((val) => val ?? ""),
  med_photos: z.string().nullable().optional().transform((val) => val ?? ""),
});
