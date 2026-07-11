'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ChevronLeft, RotateCcw, History, CheckCircle2, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DiseaseResult {
  id: string
  name: string
  confidence: number
  severity: 'Low' | 'Medium' | 'High' | 'None'
  affectedCrop: string
  description: string
  treatments: {
    step: number
    title: string
    detail: string
    icon: string
  }[]
  timestamp: Date
  imagePreview: string
}

interface ResultsPanelProps {
  result: DiseaseResult
  imagePreview: string
  onReset: () => void
  onOpenHistory: () => void
}

const SEVERITY_CONFIG = {
  None: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Healthy Plant ✓',
  },
  Low: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Low Risk',
  },
  Medium: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    label: 'Moderate Risk',
  },
  High: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
    label: 'High Risk — Act Now',
  },
}

function CircularProgress({ confidence }: { confidence: number }) {
  const [animated, setAnimated] = useState(0)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animated / 100) * circumference

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0
      const end = confidence
      const duration = 1200
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        start = eased * end
        setAnimated(Math.round(start))
        if (progress < 1) requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    }, 400)

    return () => clearTimeout(timeout)
  }, [confidence])

  const color =
    animated >= 85 ? '#1a3a2a' : animated >= 65 ? '#c4622d' : '#e07840'

  return (
    <div className="relative flex items-center justify-center" aria-label={`Confidence: ${confidence}%`}>
      <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
        {/* Track */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#e8e0d0"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-bold text-3xl text-[#1a3a2a] leading-none tabular-nums">
          {animated}%
        </span>
        <span className="text-[#5a7060] text-xs mt-0.5 font-medium">Confident</span>
      </div>
    </div>
  )
}

export function ResultsPanel({ result, imagePreview, onReset, onOpenHistory }: ResultsPanelProps) {
  const severity = SEVERITY_CONFIG[result.severity]
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [result])

  return (
    <div className="min-h-screen w-full bg-[#f5f0e8] leaf-texture">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#f5f0e8]/90 backdrop-blur-md border-b border-[#d4c9b5]">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-[#1a3a2a] font-semibold text-sm hover:text-[#c4622d] transition-colors"
          aria-label="Scan another leaf"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>New Scan</span>
        </button>

        <div className="flex items-center gap-1.5 text-[#1a3a2a]">
          <Leaf className="w-4 h-4" />
          <span className="font-display text-base font-semibold">CropDoc</span>
        </div>

        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 text-[#1a3a2a] font-semibold text-sm hover:text-[#c4622d] transition-colors"
          aria-label="View scan history"
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>

      <div
        ref={panelRef}
        className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left: Image */}
        <div className="animate-result-appear">
          <div className="rounded-3xl overflow-hidden shadow-xl shadow-[#1a3a2a]/15 aspect-square relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt={`Leaf diagnosed with ${result.name}`}
              className="w-full h-full object-cover"
            />

            {/* Severity overlay badge */}
            <div
              className={cn(
                'absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border',
                severity.bg,
                severity.text,
                severity.border
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', severity.dot)} aria-hidden="true" />
              {severity.label}
            </div>

            {/* Crop tag */}
            <div className="absolute bottom-4 left-4 bg-[#1a3a2a]/80 backdrop-blur-sm text-[#f5f0e8] text-xs font-semibold px-3 py-1 rounded-full">
              {result.affectedCrop}
            </div>
          </div>

          {/* Action buttons below image */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1a3a2a] text-[#f5f0e8] font-bold text-sm hover:bg-[#0f2318] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Scan Another
            </button>
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#e8e0d0] text-[#1a3a2a] font-bold text-sm hover:bg-[#d4c9b5] transition-colors"
            >
              <History className="w-4 h-4" />
              View History
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* Disease name card */}
          <div className="animate-result-appear bg-[#1a3a2a] rounded-3xl p-6 text-[#f5f0e8]" style={{ animationDelay: '100ms' }}>
            <p className="text-[#f5f0e8]/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Detected Disease
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-balance leading-tight mb-2">
              {result.name}
            </h2>
            <p className="text-[#f5f0e8]/75 text-sm leading-relaxed">
              {result.description}
            </p>
          </div>

          {/* Confidence + Severity row */}
          <div className="grid grid-cols-2 gap-4 animate-result-appear" style={{ animationDelay: '200ms' }}>
            {/* Confidence */}
            <div className="bg-[#faf7f2] rounded-2xl p-4 flex flex-col items-center border border-[#d4c9b5]">
              <p className="text-[#5a7060] text-xs font-semibold uppercase tracking-widest mb-2">
                Confidence
              </p>
              <CircularProgress confidence={result.confidence} />
            </div>

            {/* Severity */}
            <div className="bg-[#faf7f2] rounded-2xl p-4 flex flex-col items-center justify-center border border-[#d4c9b5]">
              <p className="text-[#5a7060] text-xs font-semibold uppercase tracking-widest mb-3">
                Severity
              </p>
              <div
                className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center mb-2',
                  result.severity === 'High'
                    ? 'bg-red-100'
                    : result.severity === 'Medium'
                    ? 'bg-amber-100'
                    : 'bg-emerald-100'
                )}
                aria-hidden="true"
              >
                <AlertTriangle
                  className={cn(
                    'w-8 h-8',
                    result.severity === 'High'
                      ? 'text-red-600'
                      : result.severity === 'Medium'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-lg font-bold',
                  result.severity === 'High'
                    ? 'text-red-700'
                    : result.severity === 'Medium'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                )}
              >
                {result.severity}
              </span>
              <span className="text-[#5a7060] text-xs mt-0.5">Risk Level</span>
            </div>
          </div>

          {/* Treatment steps */}
          <div className="animate-result-appear" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#1a3a2a]" />
              <h3 className="font-bold text-[#1a3a2a] text-base uppercase tracking-wide">
                Treatment Plan
              </h3>
            </div>
            <div className="space-y-3">
              {result.treatments.map((treatment, idx) => (
                <div
                  key={treatment.step}
                  className="bg-[#faf7f2] border border-[#d4c9b5] rounded-2xl p-4 flex gap-4 items-start animate-fade-up"
                  style={{ animationDelay: `${300 + idx * 100}ms`, opacity: 0 }}
                >
                  {/* Number bubble */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#c4622d] text-[#f5f0e8] font-bold text-base flex items-center justify-center shadow-sm shadow-[#c4622d]/30">
                    {treatment.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1a3a2a] text-base leading-tight mb-0.5">
                      {treatment.title}
                    </p>
                    <p className="text-[#5a7060] text-sm leading-relaxed">
                      {treatment.detail}
                    </p>
                  </div>
                  <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">
                    {treatment.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[#5a7060]/60 text-xs text-center px-2 pb-4 animate-fade-up delay-500">
            AI diagnosis is for guidance only. Consult a local agronomist for confirmed treatment.
          </p>
        </div>
      </div>
    </div>
  )
}
