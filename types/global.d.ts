import type { ReactNode } from 'react'

// Fix React 19 + @react-three/drei type compatibility
declare module '@react-three/drei' {
    export const Float: React.FC<{
        speed?: number
        rotationIntensity?: number
        floatIntensity?: number
        children?: ReactNode
    }>

    export const Environment: React.FC<{
        preset?: string
        background?: boolean
    }>
}

declare module '@react-three/fiber' {
    export * from '@react-three/fiber'
}
