import { jsPDF } from 'jspdf'
import { Courrier } from '../types/courrier'

const formatDate = (iso: string | undefined) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// N'oubliez pas d'importer jsPDF si ce n'est pas déjà fait en haut du fichier
// import { jsPDF } from 'jspdf'

export function generateCourrierPDF(
  courrier: Courrier, 
  action: 'download' | 'view' = 'view' // Par défaut, on affiche maintenant
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const marginX = 20
  const pageW = doc.internal.pageSize.getWidth()
  const contentW = pageW - marginX * 2
  let y = 20

  // ── En-tête ──────────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42) // dark bg
  doc.rect(0, 0, pageW, 36, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text('ESPA COURIER', marginX, 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184) // slate-400
  doc.text('École Polytechnique de Vontovorona', marginX, 23)
  doc.text('Fiche de suivi de courrier', marginX, 29)

  if (courrier.reference) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(99, 179, 254) // blue-300
    const refW = doc.getTextWidth(courrier.reference)
    doc.text(courrier.reference, pageW - marginX - refW, 16)
  }

  y = 48

  // ── Statut ────────────────────────────────────────────────────────────────
  const isFinalise = !!courrier.cloturePar
  const statutLabel = isFinalise ? 'Finalise' : 'En cours'
  
  // Couleurs : Vert si finalisé, Orange si en cours
  if (isFinalise) {
    doc.setFillColor(16, 185, 129) // emerald-500
  } else {
    doc.setFillColor(245, 158, 11) // amber-500
  }
  
  doc.roundedRect(marginX, y - 5, 28, 7, 1.5, 1.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text(statutLabel, marginX + 14, y, { align: 'center' })

  y += 8

  // ── Section helper ────────────────────────────────────────────────────────
  const drawSection = (title: string) => {
    y += 4
    doc.setFillColor(241, 245, 249) // slate-100
    doc.rect(marginX, y, contentW, 6, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105) // slate-600
    doc.text(title.toUpperCase(), marginX + 3, y + 4.2)
    y += 10
  }

  const drawRow = (label: string, value: string) => {
    const labelW = 50
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139) // slate-500
    doc.text(label, marginX, y)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 41, 59) // slate-800
    // splitTextToSize pour gérer les retours à la ligne automatiques
    const lines = doc.splitTextToSize(value, contentW - labelW - 2)
    doc.text(lines, marginX + labelW, y)
    y += Math.max(6, lines.length * 5)
  }

  // ── Informations du courrier ───────────────────────────────────────────────
  drawSection('Informations du courrier')
  if(courrier.numero){
    drawRow('Numero', String(courrier.numero))
  }
  drawRow('Objet', courrier.object || '—')
  if (courrier.description) {
    drawRow('Description', courrier.description)
  }
  
  // Utilisation d'une date sécurisée si createdAt est manquant
  const dateCreation = courrier.createdAt ? new Date(courrier.createdAt).toLocaleDateString('fr-FR') : '—'
  drawRow('Date de creation', dateCreation)
  
  if (courrier.dateFin) {
    drawRow('Date limite', new Date(courrier.dateFin).toLocaleDateString('fr-FR'))
  }

  // ── Demandeur ─────────────────────────────────────────────────────────────
  drawSection('Informations du demandeur')
  if (courrier.nom || courrier.prenom) {
    drawRow('Nom & Prenom', `${courrier.nom}${courrier.prenom ? ' ' + courrier.prenom : ''}`)
  }
  if (courrier.email) {
    drawRow('Email', courrier.email)
  }
  if (courrier.telephone) {
    drawRow('Telephone', courrier.telephone)
  }

  // ── Cloture ───────────────────────────────────────────────────────────────
  if (isFinalise) {
    drawSection('Cloture')
    if (courrier.cloturePar) {
      drawRow('Cloture par', `${courrier.cloturePar.nom} (${courrier.cloturePar.email})`)
    }
  }

  // ── Pied de page ─────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight()
  doc.setDrawColor(226, 232, 240) // slate-200
  doc.line(marginX, pageH - 14, pageW - marginX, pageH - 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(148, 163, 184)
  doc.text(
    `Document généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    marginX,
    pageH - 8
  )
  doc.text('ESPA — Confidentiel', pageW - marginX, pageH - 8, { align: 'right' })

  // ── Sortie du document ───────────────────────────────────────────────────
  if (action === 'view') {
    // Crée une URL de données et l'ouvre dans un nouvel onglet
    const blob = doc.output('bloburl');
    window.open(blob, '_blank');
  } else {
    // Comportement de téléchargement classique
    const filename = `courrier-${courrier.reference || courrier.id || 'export'}.pdf`
    doc.save(filename)
  }
}