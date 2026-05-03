import React, { useState } from 'react'

function PlaceholderImage({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-50 ${className ?? ''}`}
      style={style}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-30"
      >
        <rect x="4" y="8" width="40" height="32" rx="4" stroke="#6b7280" strokeWidth="2.5" />
        <circle cx="16" cy="19" r="4" stroke="#6b7280" strokeWidth="2.5" />
        <path d="M4 32 L14 22 L22 30 L30 22 L44 34" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Photo bientôt</span>
    </div>
  )
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, ...rest } = props

  if (!src || didError) {
    return <PlaceholderImage className={className} style={style} />
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  )
}
