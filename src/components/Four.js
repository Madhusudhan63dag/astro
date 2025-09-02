import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';

import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import one from '../assets/review/1.svg'
import two from '../assets/review/2.svg'
import three from '../assets/review/3.svg'
import four from '../assets/review/4.svg'
import five from '../assets/review/5.svg'
import six from '../assets/review/1.svg'
import seven from '../assets/review/2.svg'
import eight from '../assets/review/3.svg'
import nine from '../assets/review/4.svg'
import ten from '../assets/review/5.svg'

const testimonials = [
  {
    name: 'Karthik R.',
    review: 'I was amazed at how accurate the predictions were. They matched my situation perfectly and really helped me plan ahead.',
    image: one
  },
  {
    name: 'Ananya P.',
    review: 'The guidance was spot on. It gave me clarity when I was confused about some big decisions in life.',
    image: two
  },
  {
    name: 'Suresh K.',
    review: 'Honestly, I didn’t expect them to be this accurate. Every prediction lined up with what actually happened.',
    image: three
  },
  {
    name: 'Rajesh M.',
    review: 'The advice has been extremely helpful for my family’s decisions. It feels like they truly understand our situation.',
    image: four
  },
  {
    name: 'Divya N.',
    review: 'I was surprised by how precise the predictions were. They gave me the confidence to move forward without hesitation.',
    image: five
  },
  {
    name: 'Prakash L.',
    review: 'Very reliable insights. They’ve helped me avoid mistakes and make better choices for my work and personal life.',
    image: six
  },
  {
    name: 'Sneha G.',
    review: 'The accuracy is incredible. I’ve already recommended this to a couple of friends because it helped me so much.',
    image: seven
  },
  {
    name: 'Vikram A.',
    review: 'These predictions aren’t just accurate, they’re practical too. I’ve been able to act on them with great results.',
    image: eight
  },
  {
    name: 'Priya R.',
    review: 'Everything matched exactly with what I was experiencing. It’s been a huge help in making important decisions.',
    image: nine
  },
  {
    name: 'Ravi T.',
    review: 'The insights provided were not only accurate but also actionable. I felt empowered to make decisions.',
    image: ten
  }
]

const Four = () => {
  const { t } = useTranslation();
  const items = useMemo(() => testimonials, [])
  const [index, setIndex] = useState(0) // starting card index
  const [paused, setPaused] = useState(false)
  const [perView, setPerView] = useState(1)

  // responsive cards per view
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w >= 1280) setPerView(4)
      else if (w >= 1024) setPerView(3)
      else if (w >= 640) setPerView(2)
      else setPerView(1)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // bound index when perView changes
  useEffect(() => {
    const maxStart = Math.max(0, items.length - perView)
    if (index > maxStart) setIndex(0)
  }, [perView, items.length, index])

  const pages = Math.max(1, items.length - perView + 1)

  const prev = () => setIndex(i => (i === 0 ? pages - 1 : i - 1))
  const next = () => setIndex(i => (i + 1) % pages)

  // auto slide
  useEffect(() => {
    if (paused || pages <= 1) return
    const id = setInterval(() => setIndex(i => (i + 1) % pages), 3000)
    return () => clearInterval(id)
  }, [paused, pages])

  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">{t('review_title')}</h2>
        </div>

        <div
          className="relative overflow-hidden group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Track */}
          <div
            className="flex -mx-2 transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${(100 / perView) * index}%)` }}
          >
            {items.map((t, idx) => (
              <div key={idx} className="px-2 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 shrink-0">
                <div className=" h-full flex flex-col">
                  <img src={t.image} alt={t.name} className="w-[90%] h-[80%] rounded-2xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          {pages > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={prev}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-gray-700/60 text-white hover:text-yellow-400 hover:border-yellow-400/70 transition-opacity opacity-0 group-hover:opacity-100"
              >
                <FaChevronLeft />
              </button>
              <button
                aria-label="Next"
                onClick={next}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-gray-700/60 text-white hover:text-yellow-400 hover:border-yellow-400/70 transition-opacity opacity-0 group-hover:opacity-100"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Dots */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${index === i ? 'w-6 bg-yellow-400' : 'w-2 bg-gray-500'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Four