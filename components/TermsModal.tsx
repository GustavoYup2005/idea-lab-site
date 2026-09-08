'use client';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
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
              <li>Available to current Northern Arizona University students, faculty, and staff[cite: 1].</li>
              <li>Strict prohibition on weapons, weapon components, or realistic firearm replicas[cite: 1].</li>
              <li>Prohibits obscene, offensive material, or objects infringing upon intellectual property[cite: 1].</li>
              <li>IDEA Lab staff retains full discretion to refuse any print deemed unsafe or unsuitable[cite: 1].</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              2. Print Quality, Variations, and Expectations
            </h3>
            <p className="text-zinc-400">
              Additive manufacturing is subject to cosmetic variations, structural tolerances, and hardware failures[cite: 1]. The IDEA Lab does not guarantee cosmetic perfection[cite: 1]. Users are responsible for supplying verified watertight geometry (.STL or .OBJ)[cite: 1]. Turnaround timeframes are operational estimates based on queue density[cite: 1].
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              3. Liability & Material Integrity
            </h3>
            <p className="text-zinc-400">
              Parts produced in this facility are intended for prototyping, proof-of-concept modeling, and educational validation[cite: 1]. They are not rated for commercial safety-critical deployments, sustained load-bearing stress, or high-temperature structural assemblies[cite: 1]. NAU and IDEA Lab personnel bear no liability for structural failure resulting from use[cite: 1].
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              4. Abandoned Prints & Pickup Window
            </h3>
            <p className="text-zinc-400">
              Completed jobs must be retrieved from Building 69 within <strong className="text-white">14 calendar days</strong> of completion notification[cite: 1]. Unclaimed prints past this window are deemed abandoned and will be recycled or discarded[cite: 1].
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              5. Institutional Compliance
            </h3>
            <p className="text-zinc-400">
              All interactions and submissions must adhere to the overarching NAU Student Code of Conduct and Information Technology Acceptable Use Policies[cite: 1].
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