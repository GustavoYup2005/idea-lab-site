'use client';
import { useState } from 'react';
import Link from 'next/link';

const IDEA_LAB_EMAIL = 'nauidealab@gmail.com';

export default function BorrowBambuPage() {
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [naUid, setNaUid] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [department, setDepartment] = useState('Mechanical Engineering');
  const [loanDuration, setLoanDuration] = useState('3 Days');
  const [materialNeeds, setMaterialNeeds] = useState('PLA (Lab Stock)');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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

  const handleDispatchReservation = () => {
    if (!borrowerName.trim() || !borrowerEmail.trim() || !naUid.trim()) {
      setStatusMessage('Please enter your name, NAU email, and Student ID.');
      return;
    }

    if (!agreedToPolicy) {
      setStatusMessage('You must agree to the checkout guidelines before submitting.');
      return;
    }

    const subject = `Bambu Lab A1 Checkout Request - ${borrowerName} (${naUid})`;
    const body = `Dear IDEA Lab Coordinators,

I am requesting to check out a Bambu Lab A1 3D printer kit.

--- Borrower Details ---
Name: ${borrowerName}
Email: ${borrowerEmail}
Student/Faculty ID: ${naUid}
Department: ${department}

--- Loan Parameters ---
Project: ${projectTitle || 'Classroom / Team Prototyping'}
Requested Duration: ${loanDuration}
Filament: ${materialNeeds}

--- Agreement ---
[X] I agree to return the hardware clean, undamaged, and on schedule to Building 69.
[X] I accept responsibility for filament jams or nozzle issues resulting from unauthorized materials.

Thank you!`;

    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${IDEA_LAB_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

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
                Take high-speed extrusion directly to your student workshop, team space, or desk. Engineered with active flow rate calibration, silent stepping, and same-day setup.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#reservation-form"
                  className="px-7 py-3 rounded-full bg-[#00ae42] hover:bg-[#009638] text-white text-sm font-semibold tracking-tight transition shadow-lg shadow-[#00ae42]/20"
                >
                  Reserve Equipment
                </a>
                <Link
                  href="/submit"
                  className="px-7 py-3 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 text-sm font-semibold tracking-tight transition border border-white/10"
                >
                  Submit Print Job Instead
                </Link>
              </div>
            </div>

            {/* Showcase Image: Clean pure white card */}
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
      {/* SECTION 2: SLOW SPONSOR-STYLE INFINITE MARQUEE TICKER        */}
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
      {/* SECTION 3: CHECKOUT RESERVATION FORM                         */}
      {/* ============================================================ */}
      <section id="reservation-form" className="relative w-full py-24 px-6 sm:px-12 bg-[#050507]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00ae42]">
              Student Equipment Loan
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
              Book Your Printer.
            </h2>
            <p className="mt-3 text-base text-zinc-400 font-normal">
              Submit your schedule. Once verified, pick up your complete Bambu A1 kit at Building 69.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form Container (7 Cols) */}
            <div className="lg:col-span-7 bg-[#111113] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">
                Borrower Identification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="borrower-name" className="block text-xs font-semibold text-zinc-400 mb-2">
                    Full Legal Name *
                  </label>
                  <input
                    id="borrower-name"
                    type="text"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00ae42] transition font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="borrower-email" className="block text-xs font-semibold text-zinc-400 mb-2">
                    NAU Student Email *
                  </label>
                  <input
                    id="borrower-email"
                    type="email"
                    value={borrowerEmail}
                    onChange={(e) => setBorrowerEmail(e.target.value)}
                    placeholder="jd123@nau.edu"
                    className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00ae42] transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="borrower-id" className="block text-xs font-semibold text-zinc-400 mb-2">
                    NAU Student / Employee ID *
                  </label>
                  <input
                    id="borrower-id"
                    type="text"
                    value={naUid}
                    onChange={(e) => setNaUid(e.target.value)}
                    placeholder="7 Digit ID"
                    className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00ae42] transition font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="borrower-dept" className="block text-xs font-semibold text-zinc-400 mb-2">
                    Department / College
                  </label>
                  <select
                    id="borrower-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#00ae42] transition font-medium"
                  >
                    <option value="Mechanical Engineering" className="bg-[#111113]">Mechanical Engineering</option>
                    <option value="Civil & Environmental" className="bg-[#111113]">Civil & Environmental</option>
                    <option value="Electrical Engineering" className="bg-[#111113]">Electrical Engineering</option>
                    <option value="Informatics & CS" className="bg-[#111113]">Informatics & CS</option>
                    <option value="Other NAU Department" className="bg-[#111113]">Other NAU Department</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label htmlFor="project-title" className="block text-xs font-semibold text-zinc-400 mb-2">
                  Project or Course Scope
                </label>
                <input
                  id="project-title"
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. ME 486 Capstone Chassis Prototype"
                  className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00ae42] transition font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label htmlFor="loan-duration" className="block text-xs font-semibold text-zinc-400 mb-2">
                    Reservation Span
                  </label>
                  <select
                    id="loan-duration"
                    value={loanDuration}
                    onChange={(e) => setLoanDuration(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#00ae42] transition font-medium"
                  >
                    <option value="2 Days (Express)" className="bg-[#111113]">2 Days (Express Turnaround)</option>
                    <option value="3 Days (Standard)" className="bg-[#111113]">3 Days (Standard Loan)</option>
                    <option value="5 Days (Capstone Extended)" className="bg-[#111113]">5 Days (Capstone Extended)</option>
                    <option value="Weekend Pass (Fri-Mon)" className="bg-[#111113]">Weekend Pass (Fri - Mon)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="material-needs" className="block text-xs font-semibold text-zinc-400 mb-2">
                    Filament Provision
                  </label>
                  <select
                    id="material-needs"
                    value={materialNeeds}
                    onChange={(e) => setMaterialNeeds(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#00ae42] transition font-medium"
                  >
                    <option value="Supplying Own Spool (Verified PLA/PETG)" className="bg-[#111113]">Supplying Own Spool</option>
                    <option value="Requesting Lab PLA Spool ($18.00)" className="bg-[#111113]">Lab PLA Spool ($18.00)</option>
                    <option value="Research Grant / Club Account" className="bg-[#111113]">Club / Grant Account</option>
                  </select>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#00ae42] border-white/20 bg-white/10 focus:ring-[#00ae42]"
                  />
                  <span className="text-xs text-zinc-400 leading-relaxed font-normal">
                    I agree to return the Bambu A1 clean, unblocked, and on schedule, adhering to all NAU IDEA Lab safety rules.
                  </span>
                </label>
              </div>

              {statusMessage && (
                <p className="text-xs font-semibold text-amber-400 pt-1">
                  {statusMessage}
                </p>
              )}

              <button
                onClick={handleDispatchReservation}
                className="w-full py-4 rounded-full bg-[#00ae42] hover:bg-[#009638] text-white text-sm font-bold tracking-tight transition duration-200 shadow-xl shadow-[#00ae42]/20"
              >
                Submit Checkout Request (Opens Gmail)
              </button>
            </div>

            {/* Kit Package Overview (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-[#111113] border border-white/15 space-y-4">
                <h3 className="text-base font-bold text-white">
                  Included in the Kit
                </h3>
                <ul className="space-y-3 text-xs text-zinc-300 font-normal">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Bambu Lab A1 Printer (Calibrated & Verified)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Textured PEI Spring Steel Build Plate
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    AC Grounded Power Cable
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Tool Pack (Bed Scraper, Hex Wrenches, Unclog Pin)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                    Bambu Studio Quick-Start Profile Guide
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400 space-y-1">
                <p className="font-semibold text-white">Pickup Location</p>
                <p>Building 69, 2112 S Huffer Ln, Flagstaff, AZ</p>
                <p className="text-zinc-500 pt-1">Bring your student badge during operating hours.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}