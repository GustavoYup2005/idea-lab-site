'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SubmissionGuideModal from '@/components/SubmissionGuideModal';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

/* ============================================================ */
/* TERMS OF SERVICE MODAL COMPONENT                             */
/* ============================================================ */
function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#161617] text-zinc-100 rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-10 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
              Operational Policy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Terms of Service & 3D Printing Policy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-zinc-300 font-normal">
          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              1. Eligibility & Content Restrictions
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>Available to current Northern Arizona University students, faculty, and staff.</li>
              <li>Strict prohibition on weapons, weapon components, or realistic firearm replicas.</li>
              <li>Prohibits obscene, offensive material, or objects infringing upon intellectual property.</li>
              <li>IDEA Lab staff retains full discretion to refuse any print deemed unsafe or unsuitable.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              2. Print Quality, Variations, and Expectations
            </h3>
            <p className="text-zinc-400">
              Additive manufacturing is subject to cosmetic variations, structural tolerances, and hardware failures. The IDEA Lab does not guarantee cosmetic perfection. Users are responsible for supplying verified watertight geometry (.STL or .OBJ). Turnaround timeframes are operational estimates based on queue density.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              3. Liability & Material Integrity
            </h3>
            <p className="text-zinc-400">
              Parts produced in this facility are intended for prototyping, proof-of-concept modeling, and educational validation. They are not rated for commercial safety-critical deployments, sustained load-bearing stress, or high-temperature structural assemblies. NAU and IDEA Lab personnel bear no liability for structural failure resulting from use.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              4. Abandoned Prints & Pickup Window
            </h3>
            <p className="text-zinc-400">
              Completed jobs must be retrieved from Building 69 within <strong className="text-white">14 calendar days</strong> of completion notification. Unclaimed prints past this window are deemed abandoned and will be recycled or discarded.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              5. Institutional Compliance
            </h3>
            <p className="text-zinc-400">
              All interactions and submissions must adhere to the overarching NAU Student Code of Conduct and Information Technology Acceptable Use Policies.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition shadow"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* FOOTER COMPONENT                                             */
/* ============================================================ */
function FooterSection() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="relative w-full bg-[#111113] text-zinc-300 z-20 pt-16 pb-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-8 border-b border-white/10 text-center sm:text-left">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Contact
              </h4>
              <p className="text-sm text-zinc-400">Steve Sanghi College of Engineering</p>
              <p className="text-sm">
                <a href="mailto:nauidealab@gmail.com" className="text-zinc-300 hover:text-white underline underline-offset-4">
                  nauidealab@gmail.com
                </a>
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Location
              </h4>
              <p className="text-sm text-zinc-400">Building 69</p>
              <p className="text-sm text-zinc-400">2112 S Huffer Ln</p>
              <p className="text-sm text-zinc-400">Flagstaff, AZ 86011</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                NAU
              </h4>
              <p className="text-sm text-zinc-400">SCE Deans Office</p>
              <p className="text-sm text-zinc-400">928-523-2704</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Socials
              </h4>
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                Instagram
              </p>
              <a
                href="https://instagram.com/idea_lab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#0071e3] hover:underline block"
              >
                @idea_lab
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <p>&copy; {new Date().getFullYear()} Northern Arizona University IDEA Lab. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-zinc-400 hover:text-white underline underline-offset-4 transition"
              >
                Terms of Service & 3D Printing Policy
              </button>
              <Link href="/order" className="text-zinc-400 hover:text-white transition">
                Order Calculator
              </Link>
            </div>
          </div>

        </div>
      </footer>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}

/* ============================================================ */
/* MAIN PAGE                                                    */
/* ============================================================ */
export default function Home() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const printers = [
    {
      id: 'BAMBU_A1',
      title: 'Bambu Lab A1.',
      desc: 'Fast and versatile. Ideal for rapid concept iterations, draft fits, and everyday classroom projects ready the same day.',
      category: 'Rapid Iteration',
      highlight: 'Same-day completion',
      image: '/fleet-bambu-a1.jpg',
    },
    {
      id: 'BAMBU_H2D',
      title: 'H2D Bambu Lab.',
      desc: 'Dual-material freedom. Prints intricate internal geometries cleanly using dedicated breakaway support plastics.',
      category: 'Multi-Material',
      highlight: 'Soluble geometries',
      image: '/fleet-h2d.jpg',
    },
    {
      id: 'BAMBU_X1C',
      title: 'X1C Bambu Lab.',
      desc: 'Reinforced reliability. Tuned for composite filaments that need high rigidity and a clean, uniform outer finish.',
      category: 'Carbon Composite',
      highlight: 'Rigid structure',
      image: '/fleet-x1c.jpg',
    },
    {
      id: 'MARKFORGED',
      title: 'Markforged II.',
      desc: 'Unmatched strength. Lays continuous fibers inside the print to create parts strong enough to replace machined aluminum.',
      category: 'Continuous Fiber',
      highlight: 'Aluminum-strength core',
      image: '/fleet-markforged.jpg',
    },
    {
      id: 'J35',
      title: 'J35 PolyJet.',
      desc: 'True product realism. Blends rigid components and rubber-like textures in a single job to match consumer products.',
      category: 'Multi-Texture',
      highlight: 'Full tactile realism',
      image: '/fleet-j35.jpg',
    },
    {
      id: 'FORMLABS',
      title: 'Formlabs.',
      desc: 'Mirror-smooth surfaces. Liquid resin curing delivers crisp presentation models with virtually invisible layer lines.',
      category: 'Precision Resin',
      highlight: 'Flawless finish',
      image: '/fleet-formlabs.jpg',
    },
    {
      id: 'FORTUS450',
      title: 'Fortus 450mc.',
      desc: 'Production-grade plastics. Large-scale structural parts made with aerospace-certified engineering polymers.',
      category: 'Industrial FDM',
      highlight: 'Certified polymers',
      image: '/fleet-fortus.jpg',
    },
    {
      id: 'BOSSLASER',
      title: 'Laser Cutter.',
      desc: 'Crisp two-dimensional cutting. Cleanly cuts, scores, and engraves acrylic, wood, and structural sheet materials in minutes.',
      category: 'Precision Vector',
      highlight: 'Accurate profiles',
      image: '/fleet-laser.jpg',
    },
  ];

  const SLIDE_DURATION = 5000;
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 50;
    const increment = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((current) => (current + 1) % printers.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, printers.length]);

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
    setProgress(0);
  };

  return (
    <main className="relative w-full bg-[#050507]">
      {/* 3D Global Canvas Background */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-25">
        <Scene />
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: HERO VIEWPORT                                     */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-screen bg-[#050507] flex flex-col justify-between px-6 sm:px-12 pt-8 pb-10 overflow-hidden z-20">
        
        <div className="absolute inset-x-0 top-0 h-[88vh] min-h-[620px] z-0 overflow-hidden pointer-events-none">
          <img
            src="/sanghi-college.jpg"
            alt="Northern Arizona University Engineering"
            className="w-full h-full object-cover object-top filter brightness-[0.78] contrast-[1.04]"
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#050507] via-[#050507]/90 to-transparent" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 w-full flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">IDEA Lab</span>
            <span className="hidden sm:inline-block text-xs font-medium px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-zinc-200 border border-white/15">
              Northern Arizona University
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm tracking-normal text-zinc-200 font-medium drop-shadow-sm">
            <a href="#machines" className="hover:text-white transition">Machines</a>
            <a href="#how-to-order" className="hover:text-white transition">How to Order</a>
            <a href="#showcase" className="hover:text-white transition">Fleet Showcase</a>
          </nav>

          <Link
            href="/borrow"
            className="px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium tracking-tight border border-white/20 backdrop-blur-md transition shadow"
          >
            Borrow Bambu A1
          </Link>
        </header>

        {/* Center Title */}
        <div className="relative z-10 text-center my-auto py-16">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight text-white leading-none drop-shadow-lg">
            IDEA LAB
          </h1>
          <p className="mt-6 text-base sm:text-xl text-zinc-100 font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Northern Arizona University &bull; Fast, accessible prototyping for your classes, research, and student competition teams.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-7 py-3 rounded-full bg-black/40 hover:bg-black/60 text-white text-sm font-semibold tracking-tight transition border border-white/20 backdrop-blur-md shadow cursor-pointer"
            >
              Submission Guide
            </button>
          </div>
        </div>

        {/* 8 Side-by-Side Fleet Cards */}
        <div id="machines" className="relative z-10 w-full max-w-[1400px] mx-auto pt-4">
          <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar">
            {printers.map((item, index) => (
              <div
                key={index}
                className="dock-card rounded-2xl p-6 w-72 sm:w-80 shrink-0 flex flex-col justify-start"
              >
                <p className="text-[14px] text-zinc-300 font-normal leading-relaxed">
                  <strong className="font-bold text-white mr-1.5">{item.title}</strong>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition 1 */}
      <div className="relative w-full h-36 sm:h-52 bg-gradient-to-b from-[#050507] via-[#242429] to-[#f5f5f7] z-20 pointer-events-none" />

      {/* ============================================================ */}
      {/* SECTION 2: PRODUCTION FLOOR & KIOSK                         */}
      {/* ============================================================ */}
      <section id="order-stage" className="relative w-full bg-[#f5f5f7] text-[#1d1d1f] pt-12 pb-28 px-6 sm:px-12 z-20">
        
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#111113] leading-[1.08]">
            From your CAD file.<br />
            <span className="text-[#6e6e73]">Direct to your hands.</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-[#59595e] max-w-2xl mx-auto font-normal leading-relaxed">
            Upload your geometry, pick your plastic, and our lab technicians will handle the slicing, printing, and post-processing for you.
          </p>
        </div>

        <div id="how-to-order" className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
            <div className="apple-card p-8 sm:p-9">
              <p className="apple-caption">
                <strong className="mr-1.5">Export your 3D model.</strong>
                Save your completed assembly or part from your favorite CAD software as a standard file, ensuring your geometries are solid and ready to slice.
              </p>
            </div>

            <div className="apple-card p-8 sm:p-9">
              <p className="apple-caption">
                <strong className="mr-1.5">Choose your plastic.</strong>
                Select from fast lightweight filaments for simple fit checks, continuous carbon fiber for load-bearing parts, or smooth resin for high-detail presentation pieces.
              </p>
            </div>
          </div>

          {/* Center Stage: Interactive Kiosk */}
          <div className="lg:col-span-4 flex justify-center order-1 lg:order-2">
            <div className="relative siri-glow-wrapper w-full max-w-[390px] shadow-2xl">
              <div className="relative w-full h-full bg-[#121215] rounded-[26px] overflow-hidden flex flex-col justify-between p-9 text-white shadow-2xl border border-white/10 z-10">
                
                <div className="space-y-4 my-auto text-left py-6">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    Submit your print request.
                  </h3>
                  <p className="text-sm text-zinc-300 font-normal leading-relaxed">
                    Have a part ready to manufacture? Send your files straight to the IDEA Lab queue for review by our student team.
                  </p>

                  <Link href="/order" className="block">
                    <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-white/30 text-left space-y-1.5 mt-4 transition cursor-pointer">
                      <p className="text-sm font-semibold text-white tracking-tight flex items-center justify-between">
                        <span>Launch Order Calculator</span>
                        <span className="text-[#0071e3]">&rarr;</span>
                      </p>
                      <p className="text-xs text-zinc-400 font-normal">
                        Calculate exact mass, support, and material pricing.
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="w-full pt-4">
                  <Link href="/submit" className="w-full block">
                    <button className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition shadow text-sm">
                      Submit a Job
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 order-3">
            <div className="apple-card p-8 sm:p-9">
              <p className="apple-caption">
                <strong className="mr-1.5">Technician review.</strong>
                Our student staff checks your files for printability, verifies overhangs, and sets up optimal print orientations to guarantee a successful run.
              </p>
            </div>

            <div className="apple-card p-8 sm:p-9">
              <p className="apple-caption">
                <strong className="mr-1.5">Pick up on campus.</strong>
                You receive an email confirmation as soon as the print finishes post-processing. Swing by the lab to pick up your part and inspect the results.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Transition 2 */}
      <div className="relative w-full h-36 sm:h-52 bg-gradient-to-b from-[#f5f5f7] via-[#242429] to-[#050507] z-20 pointer-events-none" />

      {/* ============================================================ */}
      {/* SECTION 3: FULL-BLEED FLEET SHOWCASE                         */}
      {/* ============================================================ */}
      <section id="showcase" className="relative w-full min-h-[95vh] py-28 px-6 sm:px-12 z-20 overflow-hidden flex flex-col justify-between">
        
        <div className="absolute inset-0 z-0 overflow-hidden">
          {printers.map((printer, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeSlide === index
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-105 translate-y-8 pointer-events-none'
              }`}
            >
              <img
                src={printer.image}
                alt={printer.title}
                className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.02]"
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/90 via-transparent to-[#050507]/90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/60 via-transparent to-[#050507]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>

        {/* Section Header */}
        <div className="relative z-10 max-w-4xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 drop-shadow">
            Lab Fleet
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mt-3 leading-[1.12] drop-shadow-md">
            Ready for your project.<br />
            <span className="text-zinc-200">Whatever the requirements.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-100 max-w-xl mx-auto font-normal leading-relaxed drop-shadow">
            Take a closer look at the equipment ready to turn your digital models into tangible hardware.
          </p>
        </div>

        {/* Frosted Glass Information Card */}
        <div className="relative z-10 max-w-3xl mx-auto w-full">
          <div className="bg-[#121214]/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-white">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {printers.map((printer, index) => (
                  <div key={index} className="w-full shrink-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-[#0071e3]">
                          {printer.category}
                        </span>
                        <span className="text-xs font-medium text-zinc-300">
                          {printer.highlight}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                        {printer.title}
                      </h3>
                      <p className="text-base sm:text-lg text-zinc-200 font-normal leading-relaxed max-w-2xl">
                        {printer.desc}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-sm font-semibold">
                      <span className="text-zinc-400 text-xs font-medium">
                        Machine {index + 1} of {printers.length}
                      </span>
                      <Link 
                        href={`/order?printer=${printer.id}`}
                        className="text-[#0071e3] hover:underline inline-flex items-center gap-1.5"
                      >
                        Calculate price for this printer
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Capsule Bar */}
          <div className="flex items-center justify-center mt-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-xl shadow-2xl border border-white/15">
              {printers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectSlide(i)}
                  className={`relative h-2.5 rounded-full overflow-hidden transition-all duration-300 ${
                    activeSlide === i
                      ? 'w-12 bg-white/25'
                      : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  {activeSlide === i && (
                    <div
                      className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}

              <div className="w-[1px] h-4 bg-white/20 mx-1.5" />

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-5 h-5 flex items-center justify-center text-white hover:opacity-70 transition"
                aria-label={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
              >
                {isPlaying ? (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Transition 3 */}
      <div className="relative w-full h-36 sm:h-52 bg-gradient-to-b from-[#050507] via-[#242429] to-white z-20 pointer-events-none" />

      {/* ============================================================ */}
      {/* SECTION 4: WHITE BRAND LOGO BANNER                           */}
      {/* ============================================================ */}
      <section className="relative w-full bg-white text-[#1d1d1f] pt-20 pb-24 px-6 sm:px-12 z-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <img
            src="/idea-lab-logo.png"
            alt="IDEA Lab Northern Arizona University"
            className="w-44 h-44 sm:w-56 sm:h-56 object-contain mb-8"
          />
          <p className="text-base sm:text-xl text-[#59595e] font-medium tracking-tight italic leading-relaxed max-w-2xl">
            &ldquo;We iterate not to fix what is flawed, but to discover what the idea was always meant to become.&rdquo;
          </p>
        </div>
      </section>

      {/* Transition 4 */}
      <div className="relative w-full h-32 sm:h-44 bg-gradient-to-b from-white via-[#242429] to-[#111113] z-20 pointer-events-none" />

      {/* Modals & Footer */}
      <FooterSection />
      <SubmissionGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </main>
  );
}