"use client"

import React from 'react'
import { SafeAreaView } from '@/components/ui/safe-area-view'

type TabLayoutProps = {
  children: React.ReactNode
}

const TabLayout= (props: TabLayoutProps) => {
  return (
    <SafeAreaView className="w-full h-full bg-white p-6 pb-0">
        {props.children}
    </SafeAreaView>
  )
}

export default TabLayout
