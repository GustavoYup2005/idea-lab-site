'use client';
import Link from 'next/link';

const BAMBU_A1_BORROW_FORM_URL = 'https://forms.gle/CVyLwhGUkyHjeYTg6';

export default function BorrowBambuPage() {
  const tickerSpecs = [
    '256 × 256 × 256 mm Build Volume',
    '300°C All-Metal Hotend',
    'Active Flow Rate Compensation',
    'Fully Automated Bed Leveling',
    'Direct-Drive Extruder',
    'High-Speed Multi-Color Compatible',
    'Silent Stepper Motors',
    'Quick-Swap Nozzle Assembly',
  ];

  return (
    <main className="min-h-screen bg-[#050507] text-white font-sans selection:bg-[#00ae42] selection:text-white">
      
      {/* ============================================================ */}
      {/* SECTION 1: HERO VIEWPORT                                     */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden px-6 sm:px-12 pt-10 pb-20 border-b border-white/10">
        
        {/* Bambu Green Ambient Glow */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-b from-[#00ae42]/15 via-emerald-500/5 to-transparent blur-[130px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto">
          
          {/* Top Breadcrumb */}
          <div className="flex items-center pb-8 mb-10 border-b border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              IDEA Lab Overview
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                Borrow a<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  Bambu Lab A1.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl">
                Take high-speed extrusion directly to your student workshop, team space, or desk. Complete the checkout intake form to stage your unit for pickup at Building 69.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={BAMBU_A1_BORROW_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#00ae42] hover:bg-[#009638] text-white text-sm font-semibold tracking-tight transition shadow-lg shadow-[#00ae42]/20"
                >
                  <span>Open Checkout Google Form</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
                <a
                  href="#form-embed"
                  className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 text-sm font-semibold tracking-tight transition border border-white/10"
                >
                  Fill Out Below
                </a>
              </div>
            </div>

            {/* Showcase Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-6 sm:p-8 flex items-center justify-center border border-white/20">
                <img
                  src="/bambu-a1-borrow.png"
                  alt="Bambu Lab A1 Fleet Unit"
                  className="w-full h-80 sm:h-[420px] object-contain object-center transition-transform duration-700 hover:scale-[1.02]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fleet-bambu-a1.jpg';
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: SLOW INFINITE MARQUEE TICKER                      */}
      {/* ============================================================ */}
      <section className="relative w-full py-7 bg-[#09090b] border-b border-white/10 overflow-hidden z-10">
        <div className="animate-marquee items-center gap-4">
          {tickerSpecs.map((item, idx) => (
            <div
              key={`a-${idx}`}
              className="px-6 py-3 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-semibold text-zinc-200 tracking-tight whitespace-nowrap flex items-center gap-3 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ae42]" />
              {item}
            </div>
          ))}
          {tickerSpecs.map((item, idx) => (
            <div
              key={`b-${idx}`}
              className="px-6 py-3 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-semibold text-zinc-200 tracking-tight whitespace-nowrap flex items-center gap-3 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ae42]" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: INTAKE OVERVIEW & EMBEDDED FORM                   */}
      {/* ============================================================ */}
      <section id="form-embed" className="relative w-full py-24 px-6 sm:px-12 bg-[#050507]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00ae42]">
              Student Equipment Loan
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
              Bambu Lab A1 Reservation.
            </h2>
            <p className="mt-3 text-base text-zinc-400 font-normal">
              Submit your loan details through the official Google Form below or launch it in a separate tab.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Embedded Google Form Container (8 Cols) */}
            <div className="lg:col-span-8 bg-[#111113] border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-2 sm:p-4">
              <iframe
                src={`${BAMBU_A1_BORROW_FORM_URL}?embedded=true`}
                className="w-full h-[850px] rounded-2xl bg-white border-0"
                title="Bambu Lab A1 Checkout Form"
              >
                Loading checkout form…
              </iframe>
            </div>

            {/* Logistics & Kit Contents (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-8 rounded-3xl bg-[#111113] border border-white/15 space-y-4">
                <h3 className="text-base font-bold text-white">
                  Included in the Kit
                </h3>
                <ul className="space-y-3 text-xs text-zinc-300 font-normal">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Bambu Lab A1 Printer (Calibrated)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Textured PEI Spring Steel Build Plate
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    AC Grounded Heavy-Duty Power Cable
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Maintenance Pack (Scraper, Hex Keys, Pin)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Bambu Studio Quick-Start Profile Guide
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-[#111113] border border-white/15 space-y-4">
                <h3 className="text-base font-bold text-white">
                  Pickup Protocol
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  Once your reservation has been reviewed by lab staff, your unit will be staged at Building 69 (Steve Sanghi College of Engineering). Bring your active NAU student badge during operating hours to sign out the hardware.
                </p>
                <div className="pt-2">
                  <a
                    href={BAMBU_A1_BORROW_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#00ae42] hover:underline"
                  >
                    Open form in fullscreen tab &rarr;
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400 space-y-1">
                <p className="font-semibold text-white">Location</p>
                <p>Building 69, 2112 S Huffer Ln, Flagstaff, AZ</p>
                <p className="text-zinc-500 pt-1">Contact: nauidealab@gmail.com</p>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}