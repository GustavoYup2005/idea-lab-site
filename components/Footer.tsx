'use client';
import { useState } from 'react';
import Link from 'next/link';
import TermsModal from './TermsModal';

export default function Footer() {
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