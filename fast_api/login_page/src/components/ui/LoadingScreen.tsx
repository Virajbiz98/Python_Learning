import { Loader2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <h2 className="mt-4 text-2xl font-display font-bold">Loading...</h2>
    </div>
  );
}

export default LoadingScreen;