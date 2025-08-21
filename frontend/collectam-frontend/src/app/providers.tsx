'use client'

import {HeroUIProvider} from '@heroui/react'
import {AccessibilityProvider} from '../components/AccessibilityProvider'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <HeroUIProvider 
        locale="fr-FR"
        skipFramerMotionAnimations={false}
        disableAnimation={false}
        disableRipple={false}
      >
        {children}
      </HeroUIProvider>
    </AccessibilityProvider>
  )
}
