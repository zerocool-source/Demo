"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandCard } from "@/components/brands/brand-card";
import { mockBrands } from "@/lib/mock-data";

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground mt-1">
            Manage your creator brands and their settings.
          </p>
        </div>
        <Button asChild>
          <Link href="/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Brand
          </Link>
        </Button>
      </div>

      {mockBrands.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <p className="text-muted-foreground mb-4">No brands yet. Create your first brand to get started.</p>
          <Button asChild>
            <Link href="/brands/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Brand
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
}
