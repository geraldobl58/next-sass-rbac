import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'

export default function Home() {
  return (
    <div>
      <Label>Home</Label>
      <Button>Home</Button>
      <Input placeholder="Type something..." className="mt-2" />
    </div>
  )
}
