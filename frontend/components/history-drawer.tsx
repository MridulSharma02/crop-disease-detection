'use client'

import { useEffect } from 'react'
import { X, Clock, AlertTriangle, ChevronRight, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DiseaseResult } from './results-panel'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  history: DiseaseResult[]
  onSelectScan: (result: DiseaseResult) => void
}

const SEVERITY_CONFIG = {
  Low: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  High: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function HistoryDrawer({ isOpen, onClose, history, onSelectScan }: HistoryDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1a3a2a]/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Scan History"
        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#f5f0e8] z-50 flex flex-col shadow-2xl shadow-[#1a3a2a]/30 animate-drawer-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4c9b5] bg-[#1a3a2a]">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#f5f0e8]" />
            <h2 className="font-display text-xl text-[#f5f0e8]">Scan History</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#f5f0e8]/80 hover:text-[#f5f0e8] hover:bg-[#f5f0e8]/10 transition-colors"
            aria-label="Close history panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-5 py-3 bg-[#1a3a2a]/5 border-b border-[#d4c9b5]">
          <p className="text-[#5a7060] text-sm">
            {history.length === 0
              ? 'No scans yet'
              : `${history.length} scan${history.length === 1 ? '' : 's'} — last 5 kept`}
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#1a3a2a]/10 flex items-center justify-center">
                <Clock className="w-10 h-10 text-[#1a3a2a]/40" />
              </div>
              <div>
                <p className="text-[#1a3a2a] font-bold text-lg mb-1">No History Yet</p>
                <p className="text-[#5a7060] text-sm leading-relaxed">
                  Your last 5 scans will appear here for quick reference.
                </p>
              </div>
            </div>
          ) : (
            <ul className="p-4 space-y-3">
              {history.map((scan, idx) => {
                const sev = SEVERITY_CONFIG[scan.severity]
                return (
                  <li key={scan.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectScan(scan)
                        onClose()
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-2xl text-left',
                        'bg-[#faf7f2] border border-[#d4c9b5]',
                        'hover:border-[#1a3a2a]/30 hover:shadow-md transition-all duration-200',
                        'active:scale-[0.98]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3a2a]/30'
                      )}
                      aria-label={`View scan: ${scan.name}, ${scan.severity} severity`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#d4c9b5]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={scan.imagePreview}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {/* Latest badge */}
                        {idx === 0 && (
                          <span className="inline-block bg-[#1a3a2a] text-[#f5f0e8] text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide">
                            Latest
                          </span>
                        )}
                        <p className="font-bold text-[#1a3a2a] text-sm leading-tight truncate">
                          {scan.name}
                        </p>
                        <p className="text-[#5a7060] text-xs truncate">{scan.affectedCrop}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={cn(
                              'flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md',
                              sev.bg,
                              sev.text
                            )}
                          >
                            <span className={cn('w-1.5 h-1.5 rounded-full', sev.dot)} aria-hidden="true" />
                            {scan.severity}
                          </span>
                          <span className="text-[#5a7060]/60 text-[10px] flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                            {formatTimeAgo(scan.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Confidence + chevron */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[#1a3a2a] font-bold text-base tabular-nums">
                          {scan.confidence}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#5a7060]" aria-hidden="true" />
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#d4c9b5] bg-[#1a3a2a]/5">
          <p className="text-[#5a7060] text-xs text-center">
            History is stored locally on your device
          </p>
        </div>
      </aside>
    </>
  )
}
