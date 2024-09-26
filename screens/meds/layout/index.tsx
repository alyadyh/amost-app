import React from 'react'
import { ScrollView, View } from 'react-native'

import { SafeAreaView } from '@/components/ui/safe-area-view'

type MedLayoutProps = {
  children: React.ReactNode
}

const MedLayout= (props: MedLayoutProps) => {
  return (
    <SafeAreaView className="w-full h-full bg-white p-6">
        {props.children}
    </SafeAreaView>
  )
}

export default MedLayout