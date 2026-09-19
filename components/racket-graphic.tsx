const mains = Array.from({ length: 16 }, (_, index) => (index - 7.5) * 10)
const crosses = Array.from({ length: 19 }, (_, index) => (index - 9) * 12)

export function RacketGraphic() {
    return (
        <svg viewBox="0 0 420 520" role="img" aria-label="Croquis d’une raquette de tennis, cadre graphite et grip citron" className="h-full w-full">
            <g transform="translate(210 245) rotate(-30) translate(-180 -255)" strokeLinejoin="round" strokeLinecap="round">
                {/* A single sculpted yoke with a genuinely open, rounded throat. */}
                <path
                    d="M100 224C114 253 134 277 148 299C160 319 164 330 166 345H194C196 330 200 319 212 299C226 277 246 253 260 224L245 231C228 256 207 275 180 279C153 275 132 256 115 231Z
                       M146 278C155 296 166 314 174 328Q180 337 186 328C194 314 205 296 214 278Q180 296 146 278Z"
                    fill="#565c57" fillRule="evenodd" stroke="currentColor" strokeWidth="1.8" />
                <path d="M116 244C134 269 150 290 160 310C166 321 169 330 171 338M244 244C226 269 210 290 200 310C194 321 191 330 189 338"
                    fill="none" stroke="#92978e" strokeWidth="1.1" />
                <path d="M151 283C160 299 168 314 176 327M209 283C200 299 192 314 184 327"
                    fill="none" stroke="#303730" strokeWidth="1.4" />

                {/* Exact ellipse intersections attach every string to the inner rim. */}
                <g stroke="currentColor" strokeWidth=".85" opacity=".48">
                    {mains.map((x) => {
                        const halfLength = 124 * Math.sqrt(1 - (x / 89) ** 2)
                        return <line key={x} x1={180 + x} x2={180 + x} y1={150 - halfLength} y2={150 + halfLength} />
                    })}
                    {crosses.map((y) => {
                        const halfWidth = 89 * Math.sqrt(1 - (y / 124) ** 2)
                        return <line key={y} x1={180 - halfWidth} x2={180 + halfWidth} y1={150 + y} y2={150 + y} />
                    })}
                </g>

                <ellipse cx="180" cy="150" rx="96" ry="131" fill="none" stroke="currentColor" strokeWidth="12" />
                <ellipse cx="180" cy="150" rx="96" ry="131" fill="none" stroke="#565c57" strokeWidth="8" />
                <ellipse cx="180" cy="150" rx="99" ry="134" fill="none" stroke="#92978e" strokeWidth="1" />

                {/* Paint accents follow the same ellipse as the frame. */}
                <path d="M228 36.55A96 131 0 0 1 274.54 127.25M85.46 172.75A96 131 0 0 0 132 263.45"
                    fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="butt" />

                <g fill="#222923">
                    {mains.flatMap((x) => {
                        const halfLength = 128 * Math.sqrt(1 - (x / 93) ** 2)
                        return [-1, 1].map((side) => <circle key={`m-${x}-${side}`} cx={180 + x} cy={150 + side * halfLength} r="1.5" />)
                    })}
                    {crosses.flatMap((y) => {
                        const halfWidth = 93 * Math.sqrt(1 - (y / 128) ** 2)
                        return [-1, 1].map((side) => <circle key={`c-${y}-${side}`} cx={180 + side * halfWidth} cy={150 + y} r="1.5" />)
                    })}
                </g>

                <path d="M168 342H192L196 477Q180 486 164 477Z" fill="var(--accent)" stroke="#303730" strokeWidth="2.5" />
                <path d="M169 349L166 474" fill="none" stroke="#f1ffb5" strokeWidth="2" opacity=".65" />
                <g fill="none" stroke="#566728" strokeWidth="1.4">
                    {Array.from({ length: 9 }, (_, index) => {
                        const y = 355 + index * 13
                        const spread = (y - 342) * 4 / 135
                        return <path key={y} d={`M${168 - spread} ${y}Q180 ${y + 9} ${192 + spread} ${y + 6}`} />
                    })}
                </g>
                <path d="M167 339H193V351H167Z" fill="#303730" />
                <path d="M170 344H190" stroke="#92978e" strokeWidth="1" />
                <path d="M164 473Q180 480 196 473L199 485Q180 497 161 485Z" fill="#414a42" stroke="currentColor" strokeWidth="2" />
                <path d="M167 483Q180 489 193 483" fill="none" stroke="var(--accent)" strokeWidth="2" />
            </g>
        </svg>
    )
}
