'use client'

import { useRef, useState, useCallback } from 'react'
import { Camera, Upload, ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImageSelected: (file: File, preview: string) => void
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        onImageSelected(file, preview)
      }
      reader.readAsDataURL(file)
    },
    [onImageSelected]
  )

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((c) => c + 1)
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((c) => {
      const next = c - 1
      if (next <= 0) setIsDragging(false)
      return next
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-[#1a3a2a]/10 text-[#1a3a2a] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a2a] inline-block" />
          AI-Powered Detection
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1a3a2a] leading-tight text-balance mb-3">
          Diagnose Your<br />
          <span className="text-[#c4622d]">Crop Disease</span>
        </h1>
        <p className="text-[#5a7060] text-lg leading-relaxed max-w-md mx-auto">
          Take or upload a photo of any leaf. Get instant diagnosis, severity rating, and treatment advice.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop zone for leaf image upload. Click to select a file."
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative overflow-hidden rounded-3xl border-2 border-dashed cursor-pointer',
          'transition-all duration-300 ease-out',
          'min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center gap-5 p-8',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1a3a2a]/30',
          isDragging
            ? 'border-[#1a3a2a] bg-[#1a3a2a]/10 scale-[1.01]'
            : 'border-[#d4c9b5] bg-[#faf7f2] hover:border-[#1a3a2a]/50 hover:bg-[#1a3a2a]/5'
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaf-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0 Q25 10 20 20 Q15 10 20 0Z" fill="#1a3a2a" fillOpacity="0.04" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaf-grid)" />
          </svg>
        </div>

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-[#1a3a2a]/8 rounded-3xl flex items-center justify-center z-10">
            <div className="text-[#1a3a2a] text-2xl font-bold font-display">Drop your leaf image here</div>
          </div>
        )}

        {/* Icon */}
        <div
          className={cn(
            'w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all duration-300',
            isDragging
              ? 'bg-[#1a3a2a] scale-110'
              : 'bg-[#1a3a2a]/10 group-hover:bg-[#1a3a2a]/15'
          )}
        >
          {isDragging ? (
            <Upload className="w-10 h-10 text-[#f5f0e8]" strokeWidth={1.5} />
          ) : (
            <ImageIcon className="w-10 h-10 text-[#1a3a2a]" strokeWidth={1.5} />
          )}
        </div>

        <div className="text-center z-10">
          <p className="text-[#1a3a2a] font-bold text-xl md:text-2xl mb-1">
            {isDragging ? 'Release to Upload' : 'Drop Leaf Photo Here'}
          </p>
          <p className="text-[#5a7060] text-base">
            or{' '}
            <span className="text-[#1a3a2a] font-semibold underline underline-offset-2">
              tap to browse
            </span>{' '}
            your gallery
          </p>
          <p className="text-[#5a7060]/70 text-sm mt-2">
            Supports JPG, PNG, HEIC up to 20 MB
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden="true"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px bg-[#d4c9b5]" />
        <span className="text-[#5a7060] text-sm font-medium">or</span>
        <div className="flex-1 h-px bg-[#d4c9b5]" />
      </div>

      {/* Camera Button */}
      <button
        type="button"
        onClick={() => cameraInputRef.current?.click()}
        className={cn(
          'w-full flex items-center justify-center gap-3 py-5 rounded-2xl',
          'bg-[#1a3a2a] text-[#f5f0e8] font-bold text-lg',
          'transition-all duration-200 active:scale-[0.98]',
          'hover:bg-[#0f2318] shadow-lg shadow-[#1a3a2a]/20',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1a3a2a]/30',
          'min-h-[64px]' // thumb-friendly
        )}
        aria-label="Open camera to take a photo of a leaf"
      >
        <Camera className="w-6 h-6" strokeWidth={2} />
        <span>Take a Photo Now</span>
      </button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-6 mt-6 animate-fade-up delay-200">
        {[
          { label: '95%+', desc: 'Accuracy' },
          { label: '200+', desc: 'Diseases' },
          { label: '<3s', desc: 'Results' },
        ].map(({ label, desc }) => (
          <div key={desc} className="text-center">
            <div className="text-[#1a3a2a] font-bold text-lg leading-tight">{label}</div>
            <div className="text-[#5a7060] text-xs">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
