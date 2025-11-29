// components/shared/ErrorState.tsx
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ 
  message = "Failed to load data. Please try again later.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-3xl">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-zinc-500 text-lg mb-6">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline" 
          className="border-zinc-700 hover:bg-zinc-800"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}