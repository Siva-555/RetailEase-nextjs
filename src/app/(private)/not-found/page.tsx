import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center ">
      <div className="flex items-center justify-center bg-red-100 text-red-600 rounded-full w-20 h-20 mb-6">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-gray-800">404 - Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you&#39;re looking for does&#39;t exist or has been moved.
      </p>

      <Button asChild variant="outline" className="shadow-md">
        <Link href="/">Return Home</Link>
      </Button>     
    </div>
  );
}
