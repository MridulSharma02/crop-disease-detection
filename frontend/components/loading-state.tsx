'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Analyzing leaf structure...',
  'Checking for lesion patterns...',
  'Comparing to disease database...',
  'Calculating confidence score...',
  'Preparing treatment plan...',
]

const LEAF_POSITIONS = [
  { x: 15, y: 20, delay: 0, size: 28, rotate: -20 },
  { x: 75, y: 10, delay: 0.4, size: 22, rotate: 30 },
  { x: 85, y: 55, delay: 0.8, size: 18, rotate: -10 },
  { x: 20, y: 70, delay: 1.2, size: 24, rotate: 45 },
  { x: 55, y: 80, delay: 0.6, size: 20, rotate: -35 },
  { x: 5, y: 45, delay: 1.5, size: 16, rotate: 15 },
  { x: 90, y: 30, delay: 1.0, size: 14, rotate: 25 },
]

function LeafIcon({ size, rotate, color = '#1a3a2a' }: { size: number; rotate: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <path
        d="M12 22C12 22 3 16 3 9C3 5.13 7.03 2 12 2C17 2 21 5.13 21 9C21 16 12 22 12 22Z"
        fill={color}
        fillOpacity="0.7"
      />
      <path
        d="M12 22L12 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  )
}

interface LoadingStateProps {
  imagePreview: string
}

export function LoadingState({ imagePreview }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => (s < STEPS.length - 1 ? s + 1 : s))
    }, 600)

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(progressInterval)
          return p
        }
        return p + Math.random() * 3
      })
    }, 100)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-[#f5f0e8] flex items-center justify-center z-50 overflow-hidden">
      {/* Floating leaf decorations */}
      {LEAF_POSITIONS.map((leaf, i) => (
        <div
          key={i}
          className="absolute animate-leaf-float pointer-events-none opacity-40"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${3 + leaf.delay * 0.5}s`,
          }}
          aria-hidden="true"
        >
          <LeafIcon size={leaf.size} rotate={leaf.rotate} />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-sm w-full">
        {/* Image preview with scan effect */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-2xl shadow-[#1a3a2a]/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Leaf being analyzed"
            className="w-full h-full object-cover"
          />

          {/* Scan line overlay */}
          <div
            className="absolute inset-x-0 h-12 pointer-events-none animate-scan-line"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(26,58,42,0.5), transparent)',
              top: '0',
            }}
            aria-hidden="true"
          />

          {/* Corner brackets */}
          {[
            'top-3 left-3 border-t-2 border-l-2',
            'top-3 right-3 border-t-2 border-r-2',
            'bottom-3 left-3 border-b-2 border-l-2',
            'bottom-3 right-3 border-b-2 border-r-2',
          ].map((classes, i) => (
            <div
              key={i}
              className={`absolute w-5 h-5 border-[#f5f0e8] ${classes} rounded-sm`}
              aria-hidden="true"
            />
          ))}

          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-3xl border-2 border-[#1a3a2a]/40 animate-pulse-ring pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Progress ring */}
        <div className="relative flex items-center justify-center" aria-label={`Analysis ${Math.round(progress)}% complete`}>
          <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
            {/* Track */}
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#d4c9b5"
              strokeWidth="6"
            />
            {/* Fill */}
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#1a3a2a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="213.6"
              strokeDashoffset={213.6 - (progress / 100) * 213.6}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <span className="absolute text-[#1a3a2a] font-bold text-lg">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="font-display text-2xl text-[#1a3a2a] mb-2">
            Analyzing Leaf...
          </h2>

          {/* Steps */}
          <div className="space-y-1 min-h-[6rem]">
            {STEPS.map((step, i) => (
              <p
                key={step}
                className={`text-sm transition-all duration-500 ${
                  i < currentStep
                    ? 'text-[#1a3a2a]/40 line-through'
                    : i === currentStep
                    ? 'text-[#1a3a2a] font-semibold scale-105'
                    : 'text-[#5a7060]/40'
                }`}
              >
                {i < currentStep ? '✓ ' : i === currentStep ? '→ ' : '  '}
                {step}
              </p>
            ))}
          </div>
        </div>

        {/* Pulsing dots */}
        <div className="flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#1a3a2a] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
