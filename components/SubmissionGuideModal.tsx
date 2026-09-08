'use client';

interface SubmissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionGuideModal({ isOpen, onClose }: SubmissionGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#161617] text-zinc-100 rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-10 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#0071e3]">
              Student Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Order &amp; Submission Guide
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

        {/* Content Body */}
        <div className="space-y-6 text-sm leading-relaxed text-zinc-300 font-normal">
          
          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              1. File Formats &amp; Preparation
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li><strong className="text-white">3D Printing:</strong> Standard solid models in <strong>.STL</strong> or <strong>.OBJ</strong> format are preferred. Native SolidWorks files (.sldprt) are accepted, but exporting as watertight .STL simplifies slicing and verification.</li>
              <li><strong className="text-white">Laser Cutting:</strong> Vector 2D paths must be supplied as <strong>.DXF</strong> files. Parts should not share cut edges to ensure clean geometry boundaries.</li>
              <li>Ensure units (mm or inches) match the original CAD scale.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              2. Order Types &amp; Account Information
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li><strong className="text-white">Class Projects:</strong> Typically billed internally or covered under department allocation.</li>
              <li><strong className="text-white">Capstone &amp; Research:</strong> You <em>must</em> provide your official project account / charge number on the submission form.</li>
              <li><strong className="text-white">Personal Prints:</strong> Payable via Cash or Check (addressed to NAU at ENG room #122K), or Credit Card via our electronic invoice link processed by SCE Finance.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              3. Intake, Confirmation &amp; Quoting
            </h3>
            <p className="text-zinc-400">
              Once you submit your request via Google Form or email, technicians review your geometry, slice the model, and calculate exact material mass, support, and labor fees. You will receive an email quote detailing the price. <strong>You must reply to confirm the quote</strong> before manufacturing begins.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">
              4. Pick-Up &amp; Locker Retrieval
            </h3>
            <p className="text-zinc-400">
              When production and post-processing finish, your parts are placed in the lab pick-up lockers. You will receive an automated email containing your locker number and combination code. Oversized assemblies will be staged for direct lab pickup during staffed operating hours.
            </p>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Questions? Contact nauidealab@gmail.com</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition shadow"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}