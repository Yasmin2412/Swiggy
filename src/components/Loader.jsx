export function CardSkeleton({ className }) {
    return (
      <div className={`rounded-lg bg-white p-4 shadow ${className || ''}`}>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  export function TwoColumnCardSkeleton() {
    return (
      <div className="w-full max-w-md mx-auto space-y-4 overflow-hidden">
        <CardSkeleton className="animate-shimmer" />
        <CardSkeleton className="animate-shimmer [animation-delay:200ms]" />
      </div>
    );
  }
  
  export default function LoadingPage() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <TwoColumnCardSkeleton />
      </div>
    );
  }
  