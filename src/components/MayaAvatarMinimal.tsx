import { motion } from 'framer-motion'

interface MayaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

export default function MayaAvatarMinimal({ size = 'md', animated = false }: MayaAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  }

  const Avatar = animated ? motion.div : 'div'

  return (
    <Avatar
      className={`${sizes[size]} relative`}
      {...(animated && {
        animate: {
          scale: [1, 1.05, 1],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg" />
      
      {/* Letter M for Maya */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-white ${
          size === 'xl' ? 'text-5xl' : 
          size === 'lg' ? 'text-2xl' : 
          size === 'md' ? 'text-lg' : 
          'text-sm'
        }`}>
          M
        </span>
      </div>
      
      {/* Subtle AI indicator dots */}
      {(size === 'lg' || size === 'xl') && (
        <>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full opacity-80" />
          <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
          <div className="absolute bottom-2.5 right-0.5 w-1 h-1 bg-white rounded-full opacity-40" />
        </>
      )}
    </Avatar>
  )
}