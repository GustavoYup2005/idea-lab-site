import Link from 'next/link';

const TOOLS_FORM_URL = 'https://forms.gle/z3M9NZdPFYeA8sxv9';

const TOOLS = [
  'Soldering kit',
  'Screwdriver and Allen wrench set',
  '6 mm hex bit',
  'Mlab Cusing manual',
  'Ruler',
  'Locking pliers',
  'Hex key set',
  'Clamp',
  'Small clamp',
  '25 ft tape measure',
  'Calipers',
  'Duct tape',
  'Heat gun',
  'Electrical tape',
  'Black tape',
  'Tape',
  'Level',
  'Wire strippers',
  'Other',
];

export default function ToolsPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#050507] text-white font-sans selection:bg-[#0071e3] selection:text-white">
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
            <a
              href={TOOLS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[#0071e3] hover:underline"
            >
              Tool form &rarr;
            </a>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mt-2">
              Tools
            </h1>
          </div>
        </div>
      </section>

      <section className="relative w-full px-6 sm:px-12 py-16">
        <ul className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((name) => (
            <li key={name} className="dock-card rounded-2xl p-6 list-none">
              <p className="text-[14px] font-bold text-white leading-relaxed">{name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative w-full px-6 sm:px-12 pb-16">
        <div className="max-w-6xl mx-auto bg-[#111113] border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-2 sm:p-4">
          <iframe
            src={`${TOOLS_FORM_URL}?embedded=true`}
            className="w-full h-[850px] rounded-2xl bg-white border-0"
            title="Tools form"
          >
            Loading tools form…
          </iframe>
        </div>
      </section>
    </main>
  );
}
