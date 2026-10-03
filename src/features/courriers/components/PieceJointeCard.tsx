'use client'

import { useState } from 'react'
import { FileText, ExternalLink, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PieceJointe } from '../types/courrier'
import { courrierService } from '../services/courrierService'
import { courrierValidationService } from '@/features/courriersValidations/service/courriersValidationsService'

const INLINE_TYPES = ['application/pdf', 'image/']

const isInlineType = (type: string) =>
  INLINE_TYPES.some((t) => type.startsWith(t))

export const PieceJointeCard = ({ pj, isCourrierValidation }: { pj: PieceJointe; isCourrierValidation?: boolean }) => {
  // console.log('PieceJointeCard', pj, isCourrierValidation)
  const [loadingView, setLoadingView] = useState(false)
  const [loadingDownload, setLoadingDownload] = useState(false)

  const handleOpen = async () => {
    setLoadingView(true)
    try {
      const service = isCourrierValidation ? courrierValidationService : courrierService
      const { blob, nom, type } = await service.downloadFichier(pj.id)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } finally {
      setLoadingView(false)
    }
  }

  const handleDownload = async () => {
    setLoadingDownload(true)
    try {
      const service = isCourrierValidation ? courrierValidationService : courrierService
      const { blob, nom } = await service.downloadFichier(pj.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nom
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoadingDownload(false)
    }
  }

  const inline = isInlineType(pj.type)
  const getTypeLabel = (type:String) => {
    const labels = {
      planVol: "Plan de vol",
      lettreInvitation: "Lettre d'invitation",
      demande: "Demande",
    };

    return labels[type as keyof typeof labels] || type || "";
  };
  return (
    <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl group hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="w-4 h-4 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground/80 truncate">{pj.nom}</p>
          {/* <p className="text-[10px] text-muted-foreground/70">{pj.type}</p> */}
          {pj.typeFichier&&(<p className="text-[10px] text-muted-foreground/70">{getTypeLabel(pj.typeFichier)}</p>)}
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        {inline && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpen}
            disabled={loadingView}
            className="h-7 gap-1 text-[10px] uppercase font-bold text-primary"
            title="Voir"
          >
            {loadingView ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ExternalLink className="w-3 h-3" /> Voir</>}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={loadingDownload}
          className="h-7 gap-1 text-[10px] uppercase font-bold text-primary"
          title="Télécharger"
        >
          {loadingDownload ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Download className="w-3 h-3" /> Télécharger</>}
        </Button>
      </div>
    </div>
  )
}
