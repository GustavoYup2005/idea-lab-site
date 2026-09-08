'use client';
import Link from 'next/link';

interface PrinterPortal {
  name: string;
  category: string;
  desc: string;
  image: string;
  formUrl: string;
}

const PRINTER_PORTALS: PrinterPortal[] = [
  {
    name: 'Bambu Lab A1',
    category: 'Rapid Iteration',
    desc: 'High-speed active flow-rate compensation for fast draft fits, student coursework, and daily functional prints.',
    image: '/fleet-bambu-a1.jpg',
    formUrl: 'https://forms.gle/5cKABFRj7YHdy2pF7',
  },
  {
    name: 'H2D Bambu Lab',
    category: 'Multi-Material Dual Toolhead',
    desc: 'Dual-material deposition specialized for complex soluble PVA supports and multi-material engineering parts.',
    image: '/fleet-h2d.jpg',
    formUrl: 'https://forms.gle/E8dmEgBSGeHjcXUh6',
  },
  {
    name: 'X1C Bambu Lab',
    category: 'Carbon Composite Core',
    desc: 'Micro-lidar first layer inspection tuned for abrasive PA-CF, PETG, and rigid engineering filaments.',
    image: '/fleet-x1c.jpg',
    formUrl: 'https://forms.gle/zVPWTBdpShMN6XQS6',
  },
  {
    name: 'Markforged II',
    category: 'Continuous Fiber Reinforcement',
    desc: 'Lays unbroken strands of continuous carbon fiber inside an Onyx matrix for aluminum-strength mechanical parts.',
    image: '/fleet-markforged.jpg',
    formUrl: 'https://forms.gle/BASzCXPT4b1hPLxL7',
  },
  {
    name: 'Stratasys J35',
    category: 'PolyJet Multi-Material',
    desc: 'Cures microscopic photopolymer droplets to blend rigid models and elastomeric Shore-A rubber components.',
    image: '/fleet-j35.jpg',
    formUrl: 'https://forms.gle/PKZxvrUFxPxiTHB29',
  },
  {
    name: 'Formlabs',
    category: 'Precision SLA Photopolymer',
    desc: 'Laser stereolithography delivering micro-resolution, isotropic mechanical strength, and flawless surface finishes.',
    image: '/fleet-formlabs.jpg',
    formUrl: 'https://forms.gle/ATZrZJd8VdGKmoRV8',
  },
  {
    name: 'Fortus 450mc',
    category: 'Industrial Production FDM',
    desc: 'Large-scale heated chamber extrusion using aerospace-grade ULTEM 9085 and production thermoplastics.',
    image: '/fleet-fortus.jpg',
    formUrl: 'https://forms.gle/rk629fguHBq6cuTh6',
  },
  {
    name: 'Laser Cutter',
    category: 'Precision Vector & Raster',
    desc: 'Micron-accurate CO2 laser vector cutting and raster etching on acrylic, hardwoods, and structural sheets.',
    image: '/fleet-laser.jpg',
    formUrl: 'https://forms.gle/gJ5wFLiFWXpWcfsC9',
  },
];

export default function SubmitPortalPage() {
  return (
    <main className="relative w-full bg-[#050507] text-white font-sans selection:bg-[#0071e3] selection:text-white">
      
      {/* Header Banner */}
      <section className="relative z-20 w-full px-6 sm:px-12 pt-10 pb-16 border-b border-white/10 bg-[#09090b]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              IDEA Lab Overview
            </Link>
            <Link
              href="/order"
              className="text-xs font-medium text-[#0071e3] hover:underline"
            >
              Open Cost Calculator &rarr;
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0071e3]">
              Submission Queues
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mt-2">
              Select Your Machine.
            </h1>
            <p className="text-base text-zinc-400 mt-3 font-normal leading-relaxed">
              Choose your target platform below to launch its dedicated Google Form job submission queue.
            </p>
          </div>
        </div>
      </section>

      {/* Stacked Vertical Fleet Layers */}
      <section className="relative w-full flex flex-col">
        {PRINTER_PORTALS.map((portal, index) => (
          <div
            key={index}
            className="relative w-full min-h-[360px] sm:min-h-[420px] flex items-center px-6 sm:px-12 py-16 overflow-hidden border-b border-white/10 group"
          >
            {/* Background Layer with Dark Vignette */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={portal.image}
                alt={portal.name}
                className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.05] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/90 via-[#050507]/40 to-[#050507]/90 pointer-events-none" />
            </div>

            {/* Content Info */}
            <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              
              <div className="max-w-2xl space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-zinc-300">
                  {portal.category}
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                  {portal.name}
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
                  {portal.desc}
                </p>
              </div>

              {/* Direct Form Trigger */}
              <div className="shrink-0">
                <a
                  href={portal.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black text-sm font-bold tracking-tight transition duration-200 shadow-2xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                >
                  <span>Submit via Google Form</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* Calculator Link Banner */}
      <section className="relative w-full py-16 px-6 sm:px-12 bg-[#09090b] text-center border-t border-white/10">
        <p className="text-sm text-zinc-400">
          Need an exact material and labor calculation before submitting?{' '}
          <Link href="/order" className="text-white underline underline-offset-4 hover:text-[#0071e3] transition">
            Launch our 3D Mesh Cost Calculator
          </Link>
        </p>
      </section>

    </main>
  );
}