export function RacketGraphic() {
    const verticalStrings = [-54, -36, -18, 0, 18, 36, 54]
    const horizontalStrings = [-80, -60, -40, -20, 0, 20, 40, 60, 80]

    return (
        <svg viewBox="0 0 360 520" role="img" aria-label="Raquette stylisée sous tension" className="h-full w-full overflow-visible">
            <defs>
                <clipPath id="racket-head-clip">
                    <ellipse cx="180" cy="182" rx="112" ry="150" />
                </clipPath>
                <linearGradient id="frame-light" x1="0" x2="1">
                    <stop offset="0" stopColor="currentColor" stopOpacity=".35" />
                    <stop offset=".55" stopColor="currentColor" />
                    <stop offset="1" stopColor="currentColor" stopOpacity=".55" />
                </linearGradient>
            </defs>
            <g className="racket-graphic__strings" clipPath="url(#racket-head-clip)" stroke="currentColor" strokeWidth="2">
                {verticalStrings.map((x, index) => <line key={`v-${x}`} x1={180 + x} y1="30" x2={180 + x} y2="334" style={{ animationDelay: `${index * 45}ms` }} />)}
                {horizontalStrings.map((y, index) => <line key={`h-${y}`} x1="66" y1={182 + y} x2="294" y2={182 + y} style={{ animationDelay: `${220 + index * 36}ms` }} />)}
            </g>
            <ellipse cx="180" cy="182" rx="116" ry="154" fill="none" stroke="url(#frame-light)" strokeWidth="12" />
            <path d="M128 306 166 359M232 306 194 359" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
            <path d="M180 352V470" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
            <path d="M162 397h36M162 415h36M162 433h36M162 451h36" fill="none" stroke="currentColor" strokeWidth="3" opacity=".45" />
            <path d="M160 470h40" fill="none" stroke="currentColor" strokeWidth="22" strokeLinecap="round" />
        </svg>
    )
}
