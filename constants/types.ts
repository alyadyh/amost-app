import React from 'react'
import CapsuleSvg from "@/components/svg/CapsuleSvg"
import GelSvg from "@/components/svg/GelSvg"
import InjectionSvg from "@/components/svg/InjectionSvg"
import PatchSvg from "@/components/svg/PatchSvg"
import PowderSvg from "@/components/svg/PowderSvg"
import TabletSvg from "@/components/svg/TabletSvg"

export interface Medicine {
  id: string
  med_name: string
  med_form: string
  dosage: string
  dose_quantity: number
  frequency: string
  frequency_times_per_day: number
  frequency_interval_days: number
  reminder_times: string[]  // Format: "HH:mm"
  duration: number
  stock_quantity: number
  med_photos?: string | null
  instructions?: string
  prescribing_doctor?: string
  dispensing_pharmacy?: string
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
  log_date: string // Store date in 'YYYY-MM-DD' format
  log_time: string | null // Store time in 'HH:mm' format
  taken: boolean | null
}