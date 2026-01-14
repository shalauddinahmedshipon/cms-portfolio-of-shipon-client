import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <div className="mb-6 text-center text-2xl font-bold">
        This is the public landing page.
      </div>
  <Link href="/dashboard">
    <Button size="lg">Go to Dashboard</Button>
  </Link>
      </div>
    </div>
  );
}
