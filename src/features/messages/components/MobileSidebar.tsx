'use client'

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import Sidebar from './sidebar'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MobileSidebar({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-72 gap-0">
        <VisuallyHidden>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden>
        <Sidebar onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
