export interface Medicine {
  id: string;
  medName: string;
  medForm: 'cairan' | 'kapsul' | 'tablet' | 'suntikan' | 'bubuk' | 'patch' | 'gel';
  dosage: string;
  frequencyTimesPerDay: number;
  frequencyIntervalDays: number;
  reminderTimes: string[];
  duration: string;
  stockQuantity: number;
  medPhotos?: string | null;
  instructions?: string;
  prescribingDoctor?: string;
  dispensingPharmacy?: string;
}