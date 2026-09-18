import * as React from "react"
import { cn } from "../lib/utils"
import { badgeStyles } from "../lib/styles"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                badgeStyles.base,
                badgeStyles.variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
