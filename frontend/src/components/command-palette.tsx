"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, User, Briefcase, FileText, Settings, Calendar, Plus } from "lucide-react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Button } from "@/components/ui/button"

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

type Page = {
  name: string
  icon: React.ReactNode
  shortcut?: string
  onSelect: () => void
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

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

  const pages: Page[] = [
    {
      name: "Dashboard",
      icon: <Search className="mr-2 h-4 w-4" />,
      shortcut: "⌘1",
      onSelect: () => router.push("/dashboard"),
    },
    {
      name: "Contacts",
      icon: <User className="mr-2 h-4 w-4" />,
      shortcut: "⌘2",
      onSelect: () => router.push("/contacts"),
    },
    {
      name: "Companies",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      shortcut: "⌘3",
      onSelect: () => router.push("/companies"),
    },
    {
      name: "Deals",
      icon: <FileText className="mr-2 h-4 w-4" />,
      shortcut: "⌘4",
      onSelect: () => router.push("/deals"),
    },
    {
      name: "Tasks",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      shortcut: "⌘5",
      onSelect: () => router.push("/tasks"),
    },
    {
      name: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      shortcut: "⌘,",
      onSelect: () => router.push("/settings"),
    },
  ]

  const actions = [
    {
      name: "New Contact",
      icon: <Plus className="mr-2 h-4 w-4" />,
      shortcut: "⌘N C",
      onSelect: () => router.push("/contacts/new"),
    },
    {
      name: "New Company",
      icon: <Plus className="mr-2 h-4 w-4" />,
      shortcut: "⌘N B",
      onSelect: () => router.push("/companies/new"),
    },
    {
      name: "New Task",
      icon: <Plus className="mr-2 h-4 w-4" />,
      shortcut: "⌘N T",
      onSelect: () => router.push("/tasks/new"),
    },
  ]

  const themeActions = [
    {
      name: "Toggle Theme",
      icon: theme === "dark" ? (
        <Sun className="mr-2 h-4 w-4" />
      ) : (
        <Moon className="mr-2 h-4 w-4" />
      ),
      shortcut: "⌘J",
      onSelect: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Pages">
              {pages.map((page) => (
                <CommandItem key={page.name} onSelect={page.onSelect}>
                  {page.icon}
                  <span>{page.name}</span>
                  <CommandShortcut>{page.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Actions">
              {actions.map((action) => (
                <CommandItem key={action.name} onSelect={action.onSelect}>
                  {action.icon}
                  <span>{action.name}</span>
                  <CommandShortcut>{action.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Preferences">
              {themeActions.map((action) => (
                <CommandItem key={action.name} onSelect={action.onSelect}>
                  {action.icon}
                  <span>{action.name}</span>
                  <CommandShortcut>{action.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
