"use client"

import { useState, useEffect, useCallback } from 'react'
import { Upload, FileText, Trash2, Download, Search, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, Badge } from '@/components/ui/index'
import { formatBytes, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'
import type { Document } from '@/types'

const FOLDERS = [
  { value: 'ALL', label: 'All Files', icon: '📁' },
  { value: 'LEGAL', label: 'Legal', icon: '⚖️' },
  { value: 'TAX', label: 'Tax', icon: '🧾' },
  { value: 'CONTRACTS', label: 'Contracts', icon: '📝' },
  { value: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { value: 'GOVERNMENT', label: 'Government', icon: '🏛️' },
  { value: 'OTHER', label: 'Other', icon: '📄' },
]

const MIME_ICONS: Record<string, string> = {
  'application/pdf': '📕',
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📘',
  'application/msword': '📘',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState('ALL')
  const [search, setSearch] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('OTHER')

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (folder !== 'ALL') params.set('folder', folder)
      if (search) params.set('search', search)
      const res = await fetch(`/api/documents?${params}`)
      const data = await res.json()
      setDocuments(data.documents || [])
    } finally {
      setLoading(false)
    }
  }, [folder, search])

  useEffect(() => {
    const timer = setTimeout(fetchDocuments, 300)
    return () => clearTimeout(timer)
  }, [fetchDocuments])

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return

    setUploading(true)
    let successCount = 0

    for (const file of Array.from(files)) {
      // In production, upload to Supabase Storage or S3 first, then save metadata
      // For demo, we create a mock URL
      const mockUrl = `https://storage.complyflow.com/docs/${Date.now()}-${file.name}`

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          url: mockUrl,
          folder: selectedFolder,
          tags: [],
        }),
      })

      if (res.ok) successCount++
    }

    setUploading(false)

    if (successCount > 0) {
      toast({ title: `${successCount} file${successCount > 1 ? 's' : ''} uploaded`, variant: 'success' })
      fetchDocuments()
    }
  }

  async function deleteDocument(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ title: 'Document deleted', variant: 'success' })
      fetchDocuments()
    }
  }

  const totalSize = documents.reduce((sum, d) => sum + d.size, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-gray-500 text-sm mt-1">
            {documents.length} files · {formatBytes(totalSize)} used
          </p>
        </div>
        <label className="cursor-pointer">
          <Button variant="navy" className="flex items-center gap-2" loading={uploading} asChild>
            <span>
              <Upload className="w-4 h-4" />
              Upload files
            </span>
          </Button>
          <input
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={e => handleUpload(e.target.files)}
          />
        </label>
      </div>

      <div className="flex gap-6">
        {/* Sidebar folders */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {FOLDERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFolder(f.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                folder === f.value
                  ? 'bg-[#EEF2FF] text-[#1E3A5F] font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{f.icon}</span>
              <span className="truncate">{f.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search + folder selector */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedFolder}
              onChange={e => setSelectedFolder(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {FOLDERS.filter(f => f.value !== 'ALL').map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragOver ? 'border-[#1E3A5F] bg-[#EEF2FF]' : 'border-gray-200'
            }`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              handleUpload(e.dataTransfer.files)
            }}
          >
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Drag & drop files here</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOCX — max 50MB each</p>
          </div>

          {/* Documents list */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No documents yet</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first document to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => {
                const icon = MIME_ICONS[doc.mimeType] || '📄'
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group"
                  >
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-xs py-0">{doc.folder}</Badge>
                        <span className="text-xs text-gray-400">{formatBytes(doc.size)}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{formatDate(doc.createdAt)}</span>
                        {doc.expiresAt && (
                          <>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-amber-600">Expires {formatDate(doc.expiresAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-[#1E3A5F] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteDocument(doc.id, doc.name)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
        All documents are encrypted at rest. ComplyFlow does not review your documents.
      </p>
    </div>
  )
}
