import { motion } from 'framer-motion'

interface MayaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

export default function MayaAvatar({ size = 'md', animated = false }: MayaAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  }

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
    xl: 72
  }

  const Avatar = animated ? motion.div : 'div'

  return (
    <Avatar
      className={`${sizes[size]} bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg`}
      {...(animated && {
        animate: {
          boxShadow: [
            '0 10px 15px -3px rgba(251, 146, 60, 0.4)',
            '0 20px 25px -5px rgba(251, 146, 60, 0.6)',
            '0 10px 15px -3px rgba(251, 146, 60, 0.4)',
          ]
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    >
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized "M" for Maya with AI circuit elements */}
        <path
          d="M4 18V8L8 12L12 6L16 12L20 8V18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* AI dots */}
        <circle cx="4" cy="8" r="1.5" fill="white" />
        <circle cx="8" cy="12" r="1.5" fill="white" />
        <circle cx="12" cy="6" r="1.5" fill="white" />
        <circle cx="16" cy="12" r="1.5" fill="white" />
        <circle cx="20" cy="8" r="1.5" fill="white" />
        {/* Bottom circuit line */}
        <path
          d="M6 18H18"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </Avatar>
  )
}