'use client'

import { useState } from 'react'
import { FileText, ExternalLink, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PieceJointe } from '../types/courrier'
import { courrierService } from '../services/courrierService'

const INLINE_TYPES = ['application/pdf', 'image/']

const isInlineType = (type: string) =>
  INLINE_TYPES.some((t) => type.startsWith(t))

export const PieceJointeCard = ({ pj }: { pj: PieceJointe }) => {
  const [loading, setLoading] = useState(false)

  const handleOpen = async () => {
    setLoading(true)
    try {
      const { blob, nom, type } = await courrierService.downloadFichier(pj.id)
      const url = URL.createObjectURL(blob)
      if (isInlineType(type)) {
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 10000)
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = nom
        a.click()
        URL.revokeObjectURL(url)
      }
    } finally {
      setLoading(false)
    }
  }

  const inline = isInlineType(pj.type)

  return (
    <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl group hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="w-4 h-4 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground/80 truncate">{pj.nom}</p>
          <p className="text-[10px] text-muted-foreground/70">{pj.type}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        disabled={loading}
        className="h-7 gap-1 text-[10px] uppercase font-bold text-primary shrink-0"
      >
        {loading
          ? <Loader2 className="w-3 h-3 animate-spin" />
          : inline
            ? <><ExternalLink className="w-3 h-3" /> Voir</>
            : <><Download className="w-3 h-3" /> Télécharger</>
        }
      </Button>
    </div>
  )
}
