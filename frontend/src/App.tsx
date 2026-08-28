import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel'

const slides: CoverflowSlide[] = [
  { src: '/images/foto 1.jpeg', alt: 'Foto Uzi 1', title: 'Uzi', subtitle: 'Portfolio pribadi' },
  { src: '/images/foto 2.jpeg', alt: 'Foto Uzi 2', title: 'Eksplorasi', subtitle: 'Teknologi dan kreativitas' },
  { src: '/images/foto 3.jpeg', alt: 'Foto Uzi 3', title: 'Perjalanan', subtitle: 'Belajar, membuat, berkembang' },
  { src: '/images/foto 4.jpeg', alt: 'Foto Uzi 4', title: 'Masa depan', subtitle: 'Web, data, dan machine learning' },
]

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#171313] px-5 py-8 text-[#f6ead8] sm:px-10 sm:py-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-[#705044]/60 pb-5">
        <p className="text-2xl font-bold tracking-tight">Uzi.</p>
        <nav className="flex gap-4 text-sm text-[#c6aa91] sm:gap-7"><a href="#profil" className="hover:text-[#e46b45]">Profil</a><a href="#galeri" className="hover:text-[#e46b45]">Galeri</a></nav>
      </header>
      <section id="profil" className="mx-auto grid max-w-6xl items-center gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
        <div><p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#e46b45]">Portfolio pribadi</p><h1 className="max-w-xl text-5xl leading-[0.95] sm:text-7xl">Be style,<br /><em>be you.</em></h1><p className="mt-7 max-w-md text-lg leading-relaxed text-[#c6aa91]">Mahasiswa Teknik Informatika yang mengeksplorasi pengembangan web, data science, dan machine learning.</p></div>
        <div id="galeri" className="min-w-0"><CoverflowCarousel slides={slides} showCaption showPagination showNavigation label="Galeri foto Uzi" /></div>
      </section>
    </main>
  )
}

export default App