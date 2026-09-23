"use client"

import { useState } from "react"
import { Upload, CheckCircle2, AlertCircle, FileText, Loader } from "lucide-react"
import { useStore } from "@/lib/store"
import { Card, Badge } from "@/components/ui/primitives"

export interface VerificationState {
  aadhaar?: {
    fileName: string
    submittedAt: string
    status: "pending" | "verified" | "rejected"
  }
  pan?: {
    fileName: string
    submittedAt: string
    status: "pending" | "verified" | "rejected"
  }
}

export function DocumentVerification() {
  const { state, updateVerification } = useStore()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  
  const verification = state.verification

  const handleFileUpload = async (docType: "aadhaar" | "pan", file: File) => {
    setUploading(true)
    setError("")
    
    try {
      if (!file.type.includes("pdf") && !file.type.includes("image")) {
        throw new Error("Only PDF and image files are supported")
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB")
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      updateVerification(docType, {
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: "pending"
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const DocCard = ({ 
    docType, 
    label 
  }: { 
    docType: "aadhaar" | "pan"
    label: string 
  }) => {
    const doc = verification[docType]
    const statusColors = {
      pending: "bg-warning/15 text-warning",
      verified: "bg-success/15 text-success",
      rejected: "bg-destructive/15 text-destructive"
    }

    return (
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            {doc ? (
              <>
                <p className="mt-1.5 text-sm font-medium text-foreground truncate">
                  {doc.fileName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(doc.submittedAt).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="mt-1.5 text-sm text-muted-foreground">Not submitted</p>
            )}
          </div>
          {doc ? (
            doc.status === "verified" ? (
              <CheckCircle2 className="size-6 text-success" />
            ) : doc.status === "rejected" ? (
              <AlertCircle className="size-6 text-destructive" />
            ) : (
              <Loader className="size-5 text-warning animate-spin" />
            )
          ) : (
            <FileText className="size-6 text-muted-foreground" />
          )}
        </div>
        
        {doc && (
          <div className="mt-3 flex items-center gap-2">
            <Badge 
              tone={
                doc.status === "verified" 
                  ? "success" 
                  : doc.status === "rejected" 
                  ? "danger" 
                  : "warning"
              }
            >
              {doc.status === "pending" 
                ? "Under review" 
                : doc.status === "verified"
                ? "Verified"
                : "Rejected"}
            </Badge>
          </div>
        )}

        {!doc && (
          <label className="mt-4 block">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(docType, e.target.files[0])
                }
              }}
              disabled={uploading}
              className="hidden"
            />
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.parentElement?.querySelector("input")?.click()
              }}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-medium text-primary transition hover:border-primary disabled:opacity-50"
            >
              <Upload className="size-4" />
              {uploading ? "Uploading..." : "Upload document"}
            </button>
          </label>
        )}
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <DocCard docType="aadhaar" label="Aadhaar Number" />
      <DocCard docType="pan" label="PAN (Tax ID)" />
      
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Information security</p>
        Documents are validated locally. Your data stays on your device.
      </div>
    </div>
  )
}
