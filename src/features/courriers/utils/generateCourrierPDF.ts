import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable' // <-- Import de l'extension
import { Courrier } from '../types/courrier'

const formatDate = (iso: string | undefined) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function generateCourrierPDF(
  courrier: Courrier, 
  action: 'download' | 'view' = 'view'
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
  
  const dateCreation = courrier.createdAt ? new Date(courrier.createdAt).toLocaleDateString('fr-FR') : '—'
  drawRow('Date de creation', dateCreation)
  
  if (courrier.dateFin) {
    drawRow('Date limite', new Date(courrier.dateFin).toLocaleDateString('fr-FR'))
  }

  // ── Demandeur ─────────────────────────────────────────────────────────────
  drawSection('Informations du demandeur');

  if (courrier.detailPersonnes && courrier.detailPersonnes.length > 0) {
    
    // 1. On prépare les données sous forme de tableau (lignes / colonnes)
    const tableBody = courrier.detailPersonnes.map((personne) => {
      const nom = personne.name || '';
      const prenom = personne.prenom ? ` ${personne.prenom}` : '';
      const nomComplet = `${nom}${prenom}`.trim() || '-';
      
      const email = personne.email || '-';
      const telephone = personne.telephone || '-';

      // Retourne une ligne de données
      return [nomComplet, email, telephone];
    });

    // 2. On dessine le tableau avec autoTable
    autoTable(doc, {
      startY: y,
      head: [['Nom & Prénom', 'Email', 'Téléphone']],
      body: tableBody,
      margin: { left: marginX, right: marginX },
      theme: 'grid', // Style visuel du tableau
      headStyles: { 
        fillColor: [248, 249, 250], 
        textColor: [51, 51, 51], 
        fontStyle: 'bold' 
      },
      styles: { 
        fontSize: 9, 
        font: 'helvetica' 
      },
      alternateRowStyles: {
        fillColor: [251, 251, 251] // Effet zébré
      }
    });

    // 3. Mise à jour indispensable de la position Y après le tableau
    // doc.lastAutoTable contient les infos de hauteur du tableau qui vient d'être dessiné
    y = (doc as any).lastAutoTable.finalY + 10;
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
    const blob = doc.output('bloburl');
    window.open(blob, '_blank');
  } else {
    const filename = `courrier-${courrier.reference || courrier.id || 'export'}.pdf`
    doc.save(filename)
  }
}