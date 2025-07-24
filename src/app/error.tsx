"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg shadow-xl border border-red-200">
        <CardHeader className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <CardTitle className="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{error.message || "An unexpected error occurred."}</p>
            {error.digest && (
              <p className="text-xs text-gray-500">
                Error Digest: {error.digest}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => reset()}
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
