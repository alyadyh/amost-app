import React from 'react'
import CapsuleSvg from "@/components/svg/CapsuleSvg"
import GelSvg from "@/components/svg/GelSvg"
import InjectionSvg from "@/components/svg/InjectionSvg"
import PatchSvg from "@/components/svg/PatchSvg"
import PowderSvg from "@/components/svg/PowderSvg"
import TabletSvg from "@/components/svg/TabletSvg"

export interface Medicine {
  id: string
  medName: string
  medForm: 'cairan' | 'kapsul' | 'tablet' | 'suntikan' | 'bubuk' | 'patch' | 'gel'
  dosage: string
  doseQuantity: number
  frequency: string
  frequencyTimesPerDay: number
  frequencyIntervalDays: number
  reminderTimes: string[]  // Format: "HH:mm"
  duration: number
  stockQuantity: number
  medPhotos?: string | null
  instructions?: string
  prescribingDoctor?: string
  dispensingPharmacy?: string
}

export type MedForm = 'cairan' | 'kapsul' | 'tablet' | 'suntikan' | 'bubuk' | 'patch' | 'gel'

// Mapping medForm to image paths
export const medFormActive: Record<MedForm, any> = {
  cairan: require('@/assets/images/med-form/active/liquid.png'),
  kapsul: require('@/assets/images/med-form/active/capsule.png'),
  tablet: require('@/assets/images/med-form/active/tablet.png'),
  suntikan: require('@/assets/images/med-form/active/injection.png'),
  bubuk: require('@/assets/images/med-form/active/powder.png'),
  patch: require('@/assets/images/med-form/active/patch.png'),
  gel: require('@/assets/images/med-form/active/gel.png'),
}

export const medFormInactive: Record<MedForm, any> = {
  cairan: require('@/assets/images/med-form/inactive/liquid.png'),
  kapsul: require('@/assets/images/med-form/inactive/capsule.png'),
  tablet: require('@/assets/images/med-form/inactive/tablet.png'),
  suntikan: require('@/assets/images/med-form/inactive/injection.png'),
  bubuk: require('@/assets/images/med-form/inactive/powder.png'),
  patch: require('@/assets/images/med-form/inactive/patch.png'),
  gel: require('@/assets/images/med-form/inactive/gel.png'),
}

// export const medFormImages: Record<MedForm, JSX.Element> = {
//   cairan: <LiquidSvg />,
//   kapsul: <CapsuleSvg />,
//   tablet: <TabletSvg />,
//   suntikan: <InjectionSvg />,
//   bubuk: <PowderSvg />,
//   patch: <PatchSvg />,
//   gel: <GelSvg />
// }

export type Log = {
  id: string
  date: string // Store date in 'YYYY-MM-DD' format
  time: string | null // Store time in 'HH:mm' format
  taken: boolean | null
}