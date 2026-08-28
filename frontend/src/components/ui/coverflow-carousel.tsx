import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CoverflowSlide {
  src: string
  alt: string
  title?: string
  subtitle?: string
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[]
  rotate?: number
  depth?: number
  perspective?: number
  fade?: number
  cardWidth?: string
  gap?: number
  loop?: boolean
  showCaption?: boolean
  showPagination?: boolean
  showNavigation?: boolean
  label?: string
  className?: string
  cardClassName?: string
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  fade = 0.1,
  cardWidth = 'clamp(148px, 22vw, 260px)',
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = 'Cover carousel',
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([])
  const widthRef = React.useRef(0)
  const positionRef = React.useRef(0)
  const animationRef = React.useRef<number | null>(null)
  const dragRef = React.useRef<{ x: number; position: number; id: number } | null>(null)
  const [selected, setSelected] = React.useState(0)
  const count = slides.length

  const normalize = React.useCallback((value: number) => {
    if (loop) return ((value % count) + count) % count
    return Math.max(0, Math.min(count - 1, value))
  }, [count, loop])

  const paint = React.useCallback(() => {
    const width = widthRef.current
    if (!width || !count) return
    const pitch = width * (1 + gap)
    cardsRef.current.forEach((card, index) => {
      if (!card) return
      let offset = index - positionRef.current
      if (loop) {
        offset = ((offset % count) + count) % count
        if (offset > count / 2) offset -= count
      }
      const distance = Math.abs(offset)
      const ramp = Math.pow(distance, 0.56)
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset)
      card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`
      card.style.opacity = String(Math.max(0, 1 - fade * distance))
      card.style.zIndex = String(100 - Math.round(distance))
    })
  }, [count, depth, fade, gap, loop, rotate])

  const settle = React.useCallback((target: number) => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    const destination = loop ? target : normalize(target)
    setSelected(normalize(destination))
    const step = () => {
      const remaining = destination - positionRef.current
      if (Math.abs(remaining) < 0.001) {
        positionRef.current = destination
        paint()
        animationRef.current = null
        return
      }
      positionRef.current += remaining * 0.16
      paint()
      animationRef.current = requestAnimationFrame(step)
    }
    animationRef.current = requestAnimationFrame(step)
  }, [loop, normalize, paint])

  React.useEffect(() => {
    const frame = frameRef.current
    const card = cardsRef.current[0]
    if (!frame || !card) return
    const measure = () => { widthRef.current = card.offsetWidth; paint() }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [paint])

  React.useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
  }, [])

  if (!count) return null
  const active = slides[selected]

  return (
    <div className={cn('w-full', className)} style={{ '--cf-card': cardWidth } as React.CSSProperties} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          className="cursor-grab overflow-hidden py-10 outline-none focus-visible:ring-2 focus-visible:ring-[#e46b45] active:cursor-grabbing"
          style={{ perspective: `calc(var(--cf-card) * ${perspective})`, touchAction: 'pan-y' }}
          onPointerDown={(event) => {
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
            event.currentTarget.setPointerCapture(event.pointerId)
            dragRef.current = { x: event.clientX, position: positionRef.current, id: event.pointerId }
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current
            const pitch = widthRef.current * (1 + gap)
            if (!drag || drag.id !== event.pointerId || !pitch) return
            positionRef.current = normalize(drag.position - (event.clientX - drag.x) / pitch)
            setSelected(normalize(positionRef.current))
            paint()
          }}
          onPointerUp={(event) => {
            if (!dragRef.current || dragRef.current.id !== event.pointerId) return
            const position = positionRef.current
            dragRef.current = null
            settle(Math.round(position))
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); settle(Math.round(positionRef.current) - 1) }
            if (event.key === 'ArrowRight') { event.preventDefault(); settle(Math.round(positionRef.current) + 1) }
          }}
        >
          <div className="relative select-none" style={{ height: 'var(--cf-card)', transformStyle: 'preserve-3d' }}>
            {slides.map((slide, index) => (
              <div key={`${slide.src}-${index}`} ref={(node) => { cardsRef.current[index] = node }} className={cn('absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl bg-[#352523] shadow-2xl will-change-transform', cardClassName)} style={{ width: 'var(--cf-card)' }}>
                <img src={slide.src} alt={slide.alt} draggable={false} className="h-full w-full select-none object-cover" />
              </div>
            ))}
          </div>
        </div>
        {showNavigation && <>
          <button type="button" aria-label="Previous slide" onClick={() => settle(Math.round(positionRef.current) - 1)} className="absolute left-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#f6ead8]/80 p-2 text-[#171313] backdrop-blur hover:bg-[#f6ead8]"><ChevronLeft className="size-5" /></button>
          <button type="button" aria-label="Next slide" onClick={() => settle(Math.round(positionRef.current) + 1)} className="absolute right-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#f6ead8]/80 p-2 text-[#171313] backdrop-blur hover:bg-[#f6ead8]"><ChevronRight className="size-5" /></button>
        </>}
      </div>
      {showCaption && active?.title && <div className="mt-2 text-center"><p className="font-semibold">{active.title}</p>{active.subtitle && <p className="text-sm text-[#c6aa91]">{active.subtitle}</p>}</div>}
      {showPagination && <div className="mt-5 flex justify-center gap-2">{slides.map((_, index) => <button key={index} type="button" aria-label={`Go to slide ${index + 1}`} onClick={() => settle(index)} className={cn('size-2 rounded-full bg-[#e46b45] transition-opacity', index === selected ? 'opacity-100' : 'opacity-30')} />)}</div>}
    </div>
  )
}