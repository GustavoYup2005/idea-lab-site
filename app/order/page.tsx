'use client';
import React, { useState, useEffect, useRef, useId, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const DEFAULT_DENSITY = 1.24;
const MM3_TO_CM3 = 1000;

type RateTier = {
  materials: Record<string, number>;
  support: number;
  job: { assisted: number; unassisted: number; other: number };
};

interface MachineConfig {
  name: string;
  unit: string;
  image: string;
  printLabel: string;
  supportLabel: string;
  printDesc: string;
  supportDesc: string;
  slicerName: string;
  rates: {
    internal: RateTier;
    external: RateTier;
  };
  digitalMaterials?: Record<string, { rigid: number; flexible: number; desc: string }>;
}

const COST_DATA: Record<string, MachineConfig> = {
  BAMBU_A1: {
    name: 'Bambu Lab A1',
    unit: 'g',
    image: '/fleet-bambu-a1.jpg',
    printLabel: 'Print Material Mass',
    supportLabel: 'Support Material Mass',
    printDesc: 'Mass of the printed part (g).',
    supportDesc: 'Mass of support material or interface (g).',
    slicerName: 'Bambu Studio Overhead',
    rates: {
      internal: {
        materials: { 'PLA Basic / Matte': 0.03, 'PETG': 0.04, 'TPU 95A': 0.06 },
        support: 0.03,
        job: { assisted: 3.17, unassisted: 2.00, other: 2.50 },
      },
      external: {
        materials: { 'PLA Basic / Matte': 0.05, 'PETG': 0.06, 'TPU 95A': 0.09 },
        support: 0.05,
        job: { assisted: 6.89, unassisted: 4.59, other: 4.00 },
      },
    },
  },
  BAMBU_H2D: {
    name: 'H2D Bambu Lab',
    unit: 'g',
    image: '/fleet-h2d.jpg',
    printLabel: 'Model Material Mass',
    supportLabel: 'Soluble Support Mass',
    printDesc: 'Mass of primary structural body (g).',
    supportDesc: 'Mass of PVA / water-soluble filament (g).',
    slicerName: 'Dual-Toolhead Setup Overhead',
    rates: {
      internal: {
        materials: { 'PLA': 0.03, 'PETG': 0.04, 'ABS': 0.04 },
        support: 0.14,
        job: { assisted: 3.50, unassisted: 2.20, other: 3.00 },
      },
      external: {
        materials: { 'PLA': 0.05, 'PETG': 0.06, 'ABS': 0.06 },
        support: 0.21,
        job: { assisted: 7.00, unassisted: 4.80, other: 5.00 },
      },
    },
  },
  BAMBU_X1C: {
    name: 'X1C Bambu Lab',
    unit: 'g',
    image: '/fleet-x1c.jpg',
    printLabel: 'Print Material Mass',
    supportLabel: 'Support Material Mass',
    printDesc: 'Mass of final reinforced model (g).',
    supportDesc: 'Mass of support structure (g).',
    slicerName: 'Bambu Slicer/Job Overhead',
    rates: {
      internal: {
        materials: { 'PLA': 0.03, 'PETG HF': 0.04, 'ABS': 0.04, 'TPU': 0.06, 'PA-CF (Carbon Fiber)': 0.08, 'ASA GF': 0.05 },
        support: 0.14,
        job: { assisted: 3.17, unassisted: 2.00, other: 3.50 },
      },
      external: {
        materials: { 'PLA': 0.05, 'PETG HF': 0.06, 'ABS': 0.06, 'TPU': 0.09, 'PA-CF (Carbon Fiber)': 0.12, 'ASA GF': 0.08 },
        support: 0.21,
        job: { assisted: 6.89, unassisted: 4.59, other: 5.00 },
      },
    },
  },
  MARKFORGED: {
    name: 'Markforged II',
    unit: 'cm³',
    image: '/fleet-markforged.jpg',
    printLabel: 'Onyx Matrix Volume',
    supportLabel: 'Continuous Fiber Volume',
    printDesc: 'Volume of micro-carbon filled nylon base (cm³).',
    supportDesc: 'Volume of continuous carbon fiber routing (cm³).',
    slicerName: 'Eiger Slicer Overhead',
    rates: {
      internal: {
        materials: { 'Onyx (Micro-Carbon Nylon)': 0.28, 'White Nylon': 0.24 },
        support: 1.45,
        job: { assisted: 8.50, unassisted: 4.00, other: 6.00 },
      },
      external: {
        materials: { 'Onyx (Micro-Carbon Nylon)': 0.42, 'White Nylon': 0.38 },
        support: 2.20,
        job: { assisted: 14.00, unassisted: 8.00, other: 12.00 },
      },
    },
  },
  J35: {
    name: 'Stratasys J35',
    unit: 'g',
    image: '/fleet-j35.jpg',
    printLabel: 'Total Print Material Mass',
    supportLabel: 'Support Material Mass',
    printDesc: 'Total mass of final part (g).',
    supportDesc: 'Mass of SUP706 support structure (g).',
    slicerName: 'GrabCAD Print Overhead',
    rates: {
      internal: {
        materials: {
          'VeroUltra Clear (RGD821)': 0.26,
          'VeroUltra White (RGD824)': 0.26,
          'VeroUltra Black (RGD864)': 0.26,
          'Vero Contact Clear (CTT610)': 0.29,
          'Elastico Clear (FLX934)': 0.26,
          'Elastico Black (FLX984)': 0.26,
          'Draft Grey (RGD750)': 0.26,
          'Digital ABS (RGD531)': 0.26,
          'Digital ABS (RGD515)': 0.26,
        },
        support: 0.26,
        job: { assisted: 5.48, unassisted: 2.74, other: 23.22 },
      },
      external: {
        materials: {
          'VeroUltra Clear (RGD821)': 0.40,
          'VeroUltra White (RGD824)': 0.40,
          'VeroUltra Black (RGD864)': 0.40,
          'Vero Contact Clear (CTT610)': 0.44,
          'Elastico Clear (FLX934)': 0.40,
          'Elastico Black (FLX984)': 0.40,
          'Draft Grey (RGD750)': 0.40,
          'Digital ABS (RGD531)': 0.40,
          'Digital ABS (RGD515)': 0.40,
        },
        support: 0.40,
        job: { assisted: 8.25, unassisted: 4.13, other: 61.38 },
      },
    },
    digitalMaterials: {
      'N/A (Single Material)': { rigid: 100, flexible: 0, desc: 'Prints using only the selected base material.' },
      'Shore A-85': { rigid: 80, flexible: 20, desc: 'Hard rubber-like material (80% Vero, 20% Elastico).' },
      'Shore A-50': { rigid: 50, flexible: 50, desc: 'Medium rubber-like material (50% Vero, 50% Elastico).' },
      'Shore A-30': { rigid: 20, flexible: 80, desc: 'Soft, highly flexible rubber-like material (20% Vero, 80% Elastico).' },
    },
  },
  FORMLABS: {
    name: 'Formlabs',
    unit: 'g',
    image: '/fleet-formlabs.jpg',
    printLabel: 'Print Resin Mass',
    supportLabel: 'Support Structure Mass',
    printDesc: 'Mass of cured SLA resin part (g).',
    supportDesc: 'Mass of support struts (g).',
    slicerName: 'Formlabs PreForm Overhead',
    rates: {
      internal: {
        materials: { 'Standard Resin (Black/Clear/Grey)': 0.15, 'Tough 2000 Resin': 0.25, 'Flexible 80A Resin': 0.40 },
        support: 0.15,
        job: { assisted: 5.17, unassisted: 5.00, other: 31.67 },
      },
      external: {
        materials: { 'Standard Resin (Black/Clear/Grey)': 0.23, 'Tough 2000 Resin': 0.38, 'Flexible 80A Resin': 0.60 },
        support: 0.23,
        job: { assisted: 6.89, unassisted: 6.67, other: 45.05 },
      },
    },
  },
  FORTUS450: {
    name: 'Fortus 450mc',
    unit: 'in³',
    image: '/fleet-fortus.jpg',
    printLabel: 'Print Material Volume',
    supportLabel: 'Support Material Volume',
    printDesc: 'Volume of the final part (in³).',
    supportDesc: 'Volume of the support structure (in³).',
    slicerName: 'Insight/Fortus Overhead',
    rates: {
      internal: {
        materials: { 'ABS-M30': 2.33, 'ULTEM 9085': 5.65 },
        support: 4.65,
        job: { assisted: 18.08, unassisted: 9.04, other: 27.48 },
      },
      external: {
        materials: { 'ABS-M30': 3.50, 'ULTEM 9085': 8.48 },
        support: 6.98,
        job: { assisted: 27.48, unassisted: 27.48, other: 41.22 },
      },
    },
  },
  BOSSLASER: {
    name: 'Laser cutter',
    unit: 'in²',
    image: '/fleet-laser.jpg',
    printLabel: 'Material Sheet Area Used',
    supportLabel: 'Cut Path Length',
    printDesc: 'Approximate area of stock consumed (in²).',
    supportDesc: 'Total vector cut distance (in). (Reference only, adds no material fee).',
    slicerName: 'Laser Bed Calibration Fee',
    rates: {
      internal: {
        materials: { 'Acrylic Plastic Sheet': 0.05, 'Balsa / Birch Plywood': 0.02 },
        support: 0.00,
        job: { assisted: 4.50, unassisted: 4.50, other: 16.55 },
      },
      external: {
        materials: { 'Acrylic Plastic Sheet': 0.08, 'Balsa / Birch Plywood': 0.03 },
        support: 0.00,
        job: { assisted: 6.82, unassisted: 6.82, other: 30.93 },
      },
    },
  },
};

function calculateGeometryVolume(geometry: THREE.BufferGeometry): number {
  const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
  const position = nonIndexed.attributes.position;
  if (!position) return 0;

  let volume = 0;
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 3) {
    p1.fromBufferAttribute(position, i);
    p2.fromBufferAttribute(position, i + 1);
    p3.fromBufferAttribute(position, i + 2);
    volume += p1.dot(p2.cross(p3));
  }

  return Math.abs(volume) / 6.0;
}

function OrderCalculator() {
  const fileInputId = useId();
  const searchParams = useSearchParams();
  const initialPrinter = searchParams.get('printer') || 'BAMBU_A1';

  const [selectedMachine, setSelectedMachine] = useState(
    COST_DATA[initialPrinter] ? initialPrinter : 'BAMBU_A1'
  );
  const [userType, setUserType] = useState<'internal' | 'external'>('internal');
  const [materialKey, setMaterialKey] = useState('');
  const [digitalMaterialKey, setDigitalMaterialKey] = useState('N/A (Single Material)');
  const [laborType, setLaborType] = useState<'assisted' | 'unassisted' | 'none'>('assisted');
  const [includeOverhead, setIncludeOverhead] = useState(true);

  const [printMass, setPrintMass] = useState(0);
  const [supportMass, setSupportMass] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileMessage, setFileMessage] = useState('');
  const [fileMessageType, setFileMessageType] = useState<'neutral' | 'success' | 'warning' | 'error'>('neutral');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentConfig = COST_DATA[selectedMachine];
  const activeRates = currentConfig.rates[userType];

  useEffect(() => {
    const available = Object.keys(activeRates.materials);
    if (!available.includes(materialKey)) {
      setMaterialKey(available[0]);
    }
  }, [selectedMachine, userType, activeRates.materials, materialKey]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    setFileName(file.name);

    if (lowerName.endsWith('.sldprt')) {
      setFileMessageType('warning');
      setFileMessage('Cannot directly calculate native .sldprt files. In SolidWorks, click File -> Save As, and export as .STL or .OBJ.');
      return;
    }

    setFileMessageType('neutral');
    setFileMessage(`Analyzing 3D geometry from ${file.name}...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let totalVolumeMm3 = 0;
        const result = event.target?.result;

        if (lowerName.endsWith('.stl') && result instanceof ArrayBuffer) {
          const geometry = new STLLoader().parse(result);
          totalVolumeMm3 = calculateGeometryVolume(geometry);
        } else if (lowerName.endsWith('.obj') && typeof result === 'string') {
          const obj = new OBJLoader().parse(result);
          obj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.updateMatrixWorld(true);
              const clonedGeometry = mesh.geometry.clone();
              clonedGeometry.applyMatrix4(mesh.matrixWorld);
              totalVolumeMm3 += calculateGeometryVolume(clonedGeometry);
            }
          });
        }

        if (totalVolumeMm3 <= 0) {
          throw new Error('No valid watertight 3D geometry detected.');
        }

        const volumeCm3 = totalVolumeMm3 / MM3_TO_CM3;
        
        let calculatedValue = 0;
        if (currentConfig.unit === 'in³') {
          calculatedValue = parseFloat((volumeCm3 * 0.0610237).toFixed(2));
        } else if (currentConfig.unit === 'in²') {
          calculatedValue = parseFloat((volumeCm3 * 0.15).toFixed(2));
        } else {
          calculatedValue = parseFloat((volumeCm3 * DEFAULT_DENSITY).toFixed(2));
        }

        if (calculatedValue > 0.05) {
          setPrintMass(calculatedValue);
          setSupportMass(0);
          setFileMessageType('success');
          setFileMessage(`Estimated model requirement: ~${calculatedValue} ${currentConfig.unit}. Slicer support will be finalized by lab staff.`);
        } else {
          throw new Error('Geometry volume is zero or invalid.');
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
        setFileMessageType('error');
        setFileMessage(`Failed to parse file. Please verify it is a valid STL or OBJ mesh. (${errorMsg})`);
      }
    };

    if (lowerName.endsWith('.stl')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const printUnitRate = activeRates.materials[materialKey] || 0;
  const printCost = printMass * printUnitRate;
  const supportCost = supportMass * activeRates.support;
  const laborCost = laborType === 'none' ? 0 : activeRates.job[laborType];
  const overheadCost = includeOverhead ? activeRates.job.other : 0;
  const totalCost = printCost + supportCost + laborCost + overheadCost;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition"
        >
          <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          Back to Overview
        </Link>
        <Link
          href="/submit"
          className="text-xs font-semibold text-[#0071e3] hover:underline"
        >
          Go to Official Order Form Queues &rarr;
        </Link>
      </div>

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111113]">
          Print Volume & Cost Estimator
        </h1>
        <p className="text-base text-[#59595e] mt-2 font-normal">
          Upload your 3D mesh to preview estimated material mass, volume dimensions, and baseline manufacturing metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Controls (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Geometry Upload Card */}
          <div className="apple-card p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-[#111113]">3D CAD Geometry Analysis</h2>
            <label
              htmlFor={fileInputId}
              className="w-full border-2 border-dashed border-black/10 hover:border-[#0071e3] bg-[#fbfbfd] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center"
            >
              <svg className="w-8 h-8 text-[#0071e3] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm font-semibold text-[#111113]">
                {fileName || 'Drop your .STL or .OBJ file here'}
              </span>
              <span className="text-xs text-[#86868b] mt-1">
                Automatic volume & mass calculation enabled
              </span>
            </label>
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              accept=".stl,.obj,.sldprt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {fileMessage && (
              <p
                className={`text-xs font-medium mt-2 leading-relaxed ${
                  fileMessageType === 'success'
                    ? 'text-emerald-600'
                    : fileMessageType === 'error'
                    ? 'text-red-600'
                    : fileMessageType === 'warning'
                    ? 'text-amber-600'
                    : 'text-[#59595e]'
                }`}
              >
                {fileMessage}
              </p>
            )}
          </div>

          {/* Hardware & Material Selection */}
          <div className="apple-card p-6 sm:p-7 space-y-4">
            <h2 className="text-base font-bold text-[#111113]">Hardware & Material Parameters</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="machine-select" className="block text-xs font-semibold text-[#59595e] mb-1.5">Target Machine</label>
                <select
                  id="machine-select"
                  value={selectedMachine}
                  onChange={(e) => {
                    setSelectedMachine(e.target.value);
                    setPrintMass(0);
                    setSupportMass(0);
                    setFileName('');
                    setFileMessage('');
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-[#fbfbfd] border border-black/10 rounded-xl focus:outline-none focus:border-[#0071e3] transition font-medium text-[#111113]"
                >
                  {Object.entries(COST_DATA).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rate-tier-select" className="block text-xs font-semibold text-[#59595e] mb-1.5">Rate Tier</label>
                <select
                  id="rate-tier-select"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as 'internal' | 'external')}
                  className="w-full px-3.5 py-2 text-sm bg-[#fbfbfd] border border-black/10 rounded-xl focus:outline-none focus:border-[#0071e3] transition font-medium text-[#111113]"
                >
                  <option value="internal">Internal NAU Rate</option>
                  <option value="external">External / Industry Rate</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="material-select" className="block text-xs font-semibold text-[#59595e] mb-1.5">
                Print Material ({currentConfig.unit})
              </label>
              <select
                id="material-select"
                value={materialKey}
                onChange={(e) => setMaterialKey(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#fbfbfd] border border-black/10 rounded-xl focus:outline-none focus:border-[#0071e3] transition font-medium text-[#111113]"
              >
                {Object.entries(activeRates.materials).map(([mat, rate]) => (
                  <option key={mat} value={mat}>
                    {mat} (${rate.toFixed(2)} / {currentConfig.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* J35 Shore Hardness Section */}
            {selectedMachine === 'J35' && currentConfig.digitalMaterials && (
              <div className="p-4 bg-zinc-50 border border-black/5 rounded-2xl space-y-2">
                <label htmlFor="digital-hardness-select" className="block text-xs font-bold text-[#111113]">
                  PolyJet Shore Hardness Blending
                </label>
                <select
                  id="digital-hardness-select"
                  value={digitalMaterialKey}
                  onChange={(e) => setDigitalMaterialKey(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-black/10 rounded-lg text-[#111113]"
                >
                  {Object.keys(currentConfig.digitalMaterials).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#59595e]">
                  {currentConfig.digitalMaterials[digitalMaterialKey].desc}
                </p>
              </div>
            )}

            {/* Mass / Volume Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="model-consumption" className="block text-xs font-semibold text-[#59595e] mb-1.5">
                  {currentConfig.printLabel}
                </label>
                <div className="relative">
                  <input
                    id="model-consumption"
                    type="number"
                    min="0"
                    step="0.01"
                    value={printMass || ''}
                    onChange={(e) => setPrintMass(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-sm bg-[#fbfbfd] border border-black/10 rounded-xl focus:outline-none focus:border-[#0071e3] font-medium text-[#111113]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#86868b] font-medium pointer-events-none">
                    {currentConfig.unit}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="support-consumption" className="block text-xs font-semibold text-[#59595e] mb-1.5">
                  {currentConfig.supportLabel}
                </label>
                <div className="relative">
                  <input
                    id="support-consumption"
                    type="number"
                    min="0"
                    step="0.01"
                    value={supportMass || ''}
                    onChange={(e) => setSupportMass(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-sm bg-[#fbfbfd] border border-black/10 rounded-xl focus:outline-none focus:border-[#0071e3] font-medium text-[#111113]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#86868b] font-medium pointer-events-none">
                    {currentConfig.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Labor & Overhead */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="labor-tier-select" className="block text-xs font-semibold text-[#59595e] mb-1.5">Labor Type</label>
                <select
                  id="labor-tier-select"
                  value={laborType}
                  onChange={(e) => setLaborType(e.target.value as 'assisted' | 'unassisted' | 'none')}
                  className="w-full px-3.5 py-2 text-sm bg-[#fbfbfd] border border-black/10 rounded-xl focus:outline-none focus:border-[#0071e3] transition font-medium text-[#111113]"
                >
                  <option value="assisted">Assisted Lab Staff</option>
                  <option value="unassisted">Un-assisted User Run</option>
                  <option value="none">No Labor Charge</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#fbfbfd] border border-black/10 rounded-xl mt-6 sm:mt-0">
                <label htmlFor="overhead-toggle" className="text-xs font-semibold text-[#59595e] cursor-pointer">
                  {currentConfig.slicerName}
                </label>
                <input
                  id="overhead-toggle"
                  type="checkbox"
                  checked={includeOverhead}
                  onChange={(e) => setIncludeOverhead(e.target.checked)}
                  className="w-4 h-4 text-[#0071e3] rounded cursor-pointer"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Cost Breakdown & Disclaimer (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Machine Preview Card */}
          <div className="apple-card overflow-hidden p-0 border border-black/10 shadow-lg">
            <div className="relative w-full h-44 bg-[#09090b]">
              <img
                src={currentConfig.image}
                alt={currentConfig.name}
                className="w-full h-full object-cover object-center filter brightness-[0.88]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/fleet-fortus.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-sm font-bold">{currentConfig.name}</span>
                <span className="text-xs text-zinc-300 font-medium">Standard Lab Profile</span>
              </div>
            </div>
          </div>

          <div className="apple-card p-6 sm:p-8 space-y-6 sticky top-8">
            <h2 className="text-lg font-bold text-[#111113] border-b border-black/5 pb-3">
              Cost Breakdown (Guide Only)
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#59595e]">Model Material:</span>
                <span className="font-semibold text-[#111113]">${printCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59595e]">Support Material:</span>
                <span className="font-semibold text-[#111113]">${supportCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59595e]">Labor Fee:</span>
                <span className="font-semibold text-[#111113]">${laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59595e]">{currentConfig.slicerName}:</span>
                <span className="font-semibold text-[#111113]">${overheadCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-black/10 pt-4 flex items-baseline justify-between">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                  Estimated Price
                </span>
                <span className="text-3xl font-extrabold text-[#111113]">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <span className="text-xs text-[#86868b]">Excl. Taxes/Fees</span>
            </div>

            {/* Disclaimer Box */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-700">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Price Accuracy Notice</span>
              </div>
              <p className="leading-relaxed text-[#59595e]">
                The prices reflected here are <strong>not final</strong> and may only be used as a general guide for print sizes and approximate material usage. If prices are doubted, please submit your file through the official Google Form or contact the IDEA Lab, and wait for staff to slice and confirm the exact verified price of your print.
              </p>
            </div>

            <Link href="/submit" className="w-full block">
              <button className="w-full py-3.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-semibold rounded-2xl shadow-lg transition duration-200">
                Go to Official Submission Forms
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] px-6 sm:px-12 py-12">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading order configuration...</div>}>
        <OrderCalculator />
      </Suspense>
    </main>
  );
}