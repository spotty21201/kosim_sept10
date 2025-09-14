import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="pt-10 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-6xl mb-6">
            Plan Your Kost Project
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Simulate financial feasibility, calculate returns, and optimize your boarding house project with our comprehensive planning tool.
          </p>

          <Link href="/wizard">
            <Button size="lg" className="gap-2">
              Start New Project
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Land & Rules</h3>
              <p className="text-muted-foreground">
                Input your site details and check building regulations for your location.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Room Planning</h3>
              <p className="text-muted-foreground">
                Design your room mix and optimize space utilization.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Financial Analysis</h3>
              <p className="text-muted-foreground">
                Get detailed ROI calculations and investment projections.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
