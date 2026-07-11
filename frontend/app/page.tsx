'use client'

import { useState, useCallback } from 'react'
import { Leaf } from 'lucide-react'
import { ImageUploader } from '@/components/image-uploader'
import { LoadingState } from '@/components/loading-state'
import { ResultsPanel, type DiseaseResult } from '@/components/results-panel'
import { HistoryDrawer } from '@/components/history-drawer'
import { detectDisease } from '@/lib/api'

type AppState = 'upload' | 'loading' | 'results'

const MAX_HISTORY = 5

export default function CropDoctorPage() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [currentResult, setCurrentResult] = useState<DiseaseResult | null>(null)
  const [history, setHistory] = useState<DiseaseResult[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const handleImageSelected = useCallback(async (file: File, preview: string) => {
    setCurrentImage(preview)
    setAppState('loading')

    try {
      const data = await detectDisease(file)
      const result: DiseaseResult = {
        id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date(),
        imagePreview: preview,
        name: data.disease,
        affectedCrop: data.crop,
        confidence: data.confidence,
        severity: (data.severity || 'None') as 'Low' | 'Medium' | 'High' | 'None',
        description: data.is_healthy
          ? 'Your plant appears healthy! No disease detected.'
          : `Detected ${data.disease} in your ${data.crop} plant.`,
        treatments: data.treatment.map((t: string, i: number) => ({
          step: i + 1,
          title: t.split(' ').slice(0, 4).join(' '),
          detail: t,
          icon: i === 0 ? '🌿' : i === 1 ? '🧪' : '💧',
        })),
      }

      setCurrentResult(result)
      setHistory((prev) => [result, ...prev].slice(0, MAX_HISTORY))
      setAppState('results')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setAppState('upload')
    }
  }, [])

  const handleReset = useCallback(() => {
    setCurrentImage(null)
    setCurrentResult(null)
    setAppState('upload')
  }, [])

  const handleSelectHistoryScan = useCallback((result: DiseaseResult) => {
    setCurrentImage(result.imagePreview)
    setCurrentResult(result)
    setAppState('results')
  }, [])

  return (
    <main className="relative min-h-screen">
      {/* ── Upload Screen ─────────────────────────────────────── */}
      {appState === 'upload' && (
        <div className="min-h-screen leaf-texture flex flex-col">
          {/* Minimal header */}
          <header className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a3a2a] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#f5f0e8]" />
              </div>
              <span className="font-display text-[#1a3a2a] text-lg font-semibold tracking-tight">
                CropDoc
              </span>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#1a3a2a] hover:text-[#c4622d] transition-colors"
                aria-label={`View ${history.length} previous scan${history.length === 1 ? '' : 's'}`}
              >
                <span className="w-5 h-5 rounded-full bg-[#c4622d] text-[#f5f0e8] text-xs flex items-center justify-center font-bold">
                  {history.length}
                </span>
                History
              </button>
            )}
          </header>

          {/* Main upload content */}
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>

          {/* Decorative bottom wave */}
          <div className="relative h-24 overflow-hidden pointer-events-none" aria-hidden="true">
            <svg
              viewBox="0 0 1440 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 96L60 85C120 75 240 53 360 48C480 43 600 53 720 58C840 64 960 64 1080 58C1200 53 1320 43 1380 37L1440 32V96H1380C1320 96 1200 96 1080 96C960 96 840 96 720 96C600 96 480 96 360 96C240 96 120 96 60 96H0Z"
                fill="#1a3a2a"
                fillOpacity="0.07"
              />
              <path
                d="M0 96L60 90C120 85 240 74 360 69C480 64 600 64 720 69C840 74 960 85 1080 88C1200 90 1320 85 1380 82L1440 80V96H1380C1320 96 1200 96 1080 96C960 96 840 96 720 96C600 96 480 96 360 96C240 96 120 96 60 96H0Z"
                fill="#1a3a2a"
                fillOpacity="0.05"
              />
            </svg>
          </div>
        </div>
      )}

      {/* ── Loading Screen ────────────────────────────────────── */}
      {appState === 'loading' && currentImage && (
        <LoadingState imagePreview={currentImage} />
      )}

      {/* ── Results Screen ────────────────────────────────────── */}
      {appState === 'results' && currentResult && currentImage && (
        <ResultsPanel
          result={currentResult}
          imagePreview={currentImage}
          onReset={handleReset}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />
      )}

      {/* ── History Drawer (all screens) ──────────────────────── */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectScan={handleSelectHistoryScan}
      />
    </main>
  )
}
