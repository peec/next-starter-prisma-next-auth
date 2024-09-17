import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-2">
            <span>Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="">{children}</CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
