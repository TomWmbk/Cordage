"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/button"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative h-10 w-10 rounded-sm border border-line bg-surface-strong"
            aria-label="Changer de thème"
        >
            <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 text-amber-600 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 text-acid transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}
