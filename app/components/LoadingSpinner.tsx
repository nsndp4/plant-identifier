import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 text-green-600 animate-spin mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  )
}
