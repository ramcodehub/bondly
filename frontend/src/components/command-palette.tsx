"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, User, Briefcase, FileText, Settings, Calendar, Plus, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

// Define types
interface NavigationItem {
  id: string
  name: string
  icon: string
  path: string
  shortcut?: string
}

interface GroupedNavigationItems {
  pages: NavigationItem[]
  actions: NavigationItem[]
  preferences: NavigationItem[]
}

// Map icon names to actual components
const iconMap = {
  Search: Search,
  User: User,
  Briefcase: Briefcase,
  FileText: FileText,
  Settings: Settings,
  Calendar: Calendar,
  Plus: Plus,
  Sun: Sun,
  Moon: Moon
}

const Command = CommandPrimitive

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={[
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={["max-h-[300px] overflow-y-auto overflow-x-hidden", className].join(" ")}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-muted-foreground"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={[
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    ].join(" ")}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={[
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    ].join(" ")}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={[
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      ].join(" ")}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [navigationItems, setNavigationItems] = useState<GroupedNavigationItems>({
    pages: [],
    actions: [],
    preferences: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch navigation items from backend
  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/navigation/items')
        const result = await response.json()
        
        if (result.success) {
          setNavigationItems(result.data)
        } else {
          throw new Error(result.message || 'Failed to fetch navigation items')
        }
      } catch (error) {
        console.error('Error fetching navigation items:', error)
        setError(error instanceof Error ? error.message : 'Failed to load navigation items')
      } finally {
        setLoading(false)
      }
    }

    fetchNavigationItems()
  }, [])

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  if (loading) {
    return null // Don't show anything while loading
  }

  if (error) {
    return null // Don't show anything if there's an error
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {navigationItems.pages.length > 0 && (
              <CommandGroup heading="Pages">
                {navigationItems.pages.map((page) => {
                  const IconComponent = iconMap[page.icon as keyof typeof iconMap] || Search
                  return (
                    <CommandItem key={page.id} onSelect={() => handleSelect(page.path)}>
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{page.name}</span>
                      {page.shortcut && <CommandShortcut>{page.shortcut}</CommandShortcut>}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {navigationItems.actions.length > 0 && (
              <CommandGroup heading="Actions">
                {navigationItems.actions.map((action) => {
                  const IconComponent = iconMap[action.icon as keyof typeof iconMap] || Plus
                  return (
                    <CommandItem key={action.id} onSelect={() => handleSelect(action.path)}>
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{action.name}</span>
                      {action.shortcut && <CommandShortcut>{action.shortcut}</CommandShortcut>}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {navigationItems.preferences.length > 0 && (
              <CommandGroup heading="Preferences">
                {navigationItems.preferences.map((preference) => {
                  // Special handling for theme toggle
                  if (preference.name === "Toggle Theme") {
                    return (
                      <CommandItem 
                        key={preference.id} 
                        onSelect={() => {
                          setTheme(theme === "dark" ? "light" : "dark")
                          setOpen(false)
                        }}
                      >
                        {theme === "dark" ? (
                          <Sun className="mr-2 h-4 w-4" />
                        ) : (
                          <Moon className="mr-2 h-4 w-4" />
                        )}
                        <span>{preference.name}</span>
                        {preference.shortcut && <CommandShortcut>{preference.shortcut}</CommandShortcut>}
                      </CommandItem>
                    )
                  }
                  
                  const IconComponent = iconMap[preference.icon as keyof typeof iconMap] || Settings
                  return (
                    <CommandItem key={preference.id} onSelect={() => handleSelect(preference.path)}>
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{preference.name}</span>
                      {preference.shortcut && <CommandShortcut>{preference.shortcut}</CommandShortcut>}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}