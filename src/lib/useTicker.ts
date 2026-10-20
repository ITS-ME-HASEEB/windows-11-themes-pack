import { useEffect, useState } from 'react'

export function useTicker(ms = 1400) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), ms)
    return () => clearInterval(id)
  }, [ms])
  return tick
}

export function wave(base: number, amp: number, tick: number, phase = 0, min = 0, max = 100) {
  const v = base + Math.sin(tick * 0.7 + phase) * amp + Math.sin(tick * 1.9 + phase * 2.3) * amp * 0.35
  return Math.min(max, Math.max(min, v))
}

export function useHistory(value: number, len = 30) {
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: len }, (_, i) => Math.max(0, Math.min(100, value + Math.sin(i * 0.5) * value * 0.25))),
  )
  useEffect(() => {
    setHistory((h) => [...h.slice(1), value])
  }, [value])
  return history
}
