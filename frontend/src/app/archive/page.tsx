"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function ArchivePage() {
  const archivedPages = [
    { name: "Home", path: "/archive/home" },
    { name: "About", path: "/archive/about" },
    { name: "Contact", path: "/archive/contact" },
    // Add more archived pages as needed
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon">
              <Icons.arrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Archived Pages</h1>
            <p className="text-muted-foreground">
              View and manage archived marketing pages
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {archivedPages.map((page) => (
            <div
              key={page.path}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <span className="font-medium">{page.name}</span>
              <Link href={page.path} passHref>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
