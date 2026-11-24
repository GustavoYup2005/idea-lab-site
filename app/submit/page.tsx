'use client';
import Link from 'next/link';
import { asset } from '@/lib/asset';

interface PrinterPortal {
  name: string;
  category: string;
  desc: string;
  image: string;
  formUrl: string;
}

const PRINTER_PORTALS: PrinterPortal[] = [
  {
    name: 'H2D Bambu Lab',
    category: 'Multi-Material Dual Toolhead',
    desc: 'Dual-material deposition specialized for complex soluble PVA supports and multi-material engineering parts.',
    image: '/fleet-h2d.jpg',
    formUrl: 'https://forms.gle/E8dmEgBSGeHjcXUh6',
  },
  {
    name: 'H2S Bambu Lab',
    category: 'Large Format Single Nozzle',
    desc: 'Enclosed single-nozzle deposition for larger functional parts that need a clean, uniform engineering finish.',
    image: '/fleet-h2s.jpg',
    formUrl: 'https://forms.gle/yXer8oftkrZs3EeU6',
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
    name: 'Xtool P3',
    category: 'Precision Vector & Raster',
    desc: 'Micron-accurate CO2 laser vector cutting and raster etching on acrylic, hardwoods, and structural sheets.',
    image: '/fleet-laser.jpg',
    formUrl: 'https://forms.gle/gJ5wFLiFWXpWcfsC9',
  },
];

export default function SubmitPortalPage() {
  return (
    <main className="lab-shell">
      <nav className="lab-nav" aria-label="Lab services">
        <Link className="lab-wordmark" href="/">IDEA Lab</Link>
        <div><Link href="/order">Calculator</Link><Link href="/orders">Track an order</Link></div>
      </nav>
      <section className="lab-workspace" style={{maxWidth:"78rem"}}>
        <header><p>Northern Arizona University</p><h1>Submit a job</h1></header>
        <p className="text-lg mb-8 text-zinc-600">Choose a machine to open its submission form.</p>
        <p className="mb-8">Bambu Lab A1 · Student take-home checkout only. <Link className="underline" href="/borrow">Request a loan</Link></p>
        <div className="fleet-grid">
          {PRINTER_PORTALS.map(portal => (
            <a key={portal.name} href={portal.formUrl} target="_blank" rel="noopener noreferrer" className="fleet-choice">
              <img src={asset(portal.image)} alt="" loading="lazy" />
              <div><p>{portal.category}</p><h2>{portal.name}</h2><span>Open form ↗</span></div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
