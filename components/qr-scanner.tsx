"use client"

import { useEffect, useRef, useState } from "react"
import QrScanner from "qr-scanner"
import { Camera, ImageIcon, X, Zap, ZapOff } from "lucide-react"

export type ScannedPayment = { merchant: string; vpa: string; amount?: number }

function parsePayment(value: string): ScannedPayment | null {
  try {
    const url = new URL(value)
    if (url.protocol !== "upi:") return null
    const params = new URLSearchParams(url.search)
    const vpa = params.get("pa")?.trim()
    if (!vpa) return null
    const merchant = params.get("pn")?.trim() || vpa
    const amountValue = Number(params.get("am"))
    return { merchant, vpa, amount: Number.isFinite(amountValue) && amountValue > 0 ? amountValue : undefined }
  } catch {
    return null
  }
}

export function QrScannerSheet({ onClose, onScanned }: { onClose: () => void; onScanned: (payment: ScannedPayment) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<QrScanner | null>(null)
  const [error, setError] = useState("")
  const [torch, setTorch] = useState(false)
  const [scanningImage, setScanningImage] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const scanner = new QrScanner(video, (result) => {
      const payment = parsePayment(result.data)
      if (!payment) {
        setError("This is not a valid UPI payment QR")
        return
      }
      scanner.stop()
      onScanned(payment)
    }, { preferredCamera: "environment", highlightScanRegion: true, highlightCodeOutline: true })
    scannerRef.current = scanner
    scanner.start().catch(() => setError("Camera access is blocked. Allow camera access and try again."))
    return () => { scanner.stop(); scanner.destroy(); scannerRef.current = null }
  }, [onScanned])

  async function toggleTorch() {
    const scanner = scannerRef.current
    if (!scanner?.hasFlash()) return
    const next = !torch
    await scanner.toggleFlash()
    setTorch(next)
  }

  async function scanImage(file: File) {
    setScanningImage(true)
    setError("")
    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true })
      const payment = parsePayment(result.data)
      if (!payment) {
        setError("This is not a valid UPI payment QR")
        return
      }
      scannerRef.current?.stop()
      onScanned(payment)
    } catch {
      setError("Could not find a QR code in that image")
    } finally {
      setScanningImage(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <section className="w-full max-w-md overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl" aria-label="Scan UPI QR code">
        <div className="flex items-center justify-between px-5 py-4 text-card-foreground">
          <div><p className="font-semibold">Scan & Pay</p><p className="text-xs text-muted-foreground">Point your camera at a UPI QR code</p></div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-accent" aria-label="Close scanner"><X className="size-5" /></button>
        </div>
        <div className="relative aspect-square bg-black">
          <video ref={videoRef} className="size-full object-cover" muted playsInline aria-label="Camera preview" />
          <div className="pointer-events-none absolute inset-12 rounded-3xl border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,.3)]" />
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
            <button onClick={toggleTorch} className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm text-white" aria-label={torch ? "Turn flash off" : "Turn flash on"}>
              {torch ? <ZapOff className="size-4" /> : <Zap className="size-4" />} {torch ? "Flash off" : "Flash"}
            </button>
            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
              <ImageIcon className="size-4" />
              {scanningImage ? "Scanning..." : "Upload QR"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={scanningImage}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void scanImage(file)
                  event.currentTarget.value = ""
                }}
              />
            </label>
          </div>
        </div>
        <div className="px-5 py-4 text-center text-sm text-muted-foreground">
          {error ? <p className="text-destructive">{error}</p> : <p className="flex items-center justify-center gap-2"><Camera className="size-4" /> Keep the QR code inside the frame</p>}
        </div>
      </section>
    </div>
  )
}
