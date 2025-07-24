import { ProjectForm } from '@/app/(app)/org/[slug]/create-project/project-form'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export default function CreateProject() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
        </SheetHeader>

        <div className="px-4">
          <ProjectForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
