"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 px-0 opacity-50">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  // Function to cycle through themes
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const currentThemeIcon = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Monitor className="h-5 w-5" />,
  }[theme as string] || <Sun className="h-5 w-5" />

  return (
    <Button variant="ghost" size="icon" className="w-10 px-0" onClick={toggleTheme}>
      {currentThemeIcon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}