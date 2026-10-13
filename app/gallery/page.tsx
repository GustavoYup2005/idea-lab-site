import fs from 'fs';
import path from 'path';
import Link from 'next/link';

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

const SHAPES: Array<[number, number]> = [
  [4, 2],
  [2, 2],
  [2, 2],
  [1, 1],
  [1, 1],
  [2, 1],
  [2, 1],
  [1, 1],
];

type Placement = { index: number; col: number; row: number; w: number; h: number };

function galleryPhotos() {
  const dir = path.join(process.cwd(), 'public');
  const found = new Map<number, string>();

  for (const file of fs.readdirSync(dir)) {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, path.extname(file));
    if (!IMAGE_EXT.has(ext)) continue;
    if (!/^(?:[1-9]|1\d|2[0-2])$/.test(base)) continue;
    found.set(Number(base), `/${file}`);
  }

  return Array.from({ length: 22 }, (_, index) => found.get(index + 1)).filter(
    (src): src is string => Boolean(src)
  );
}

function pack(count: number, columns: number): Placement[] {
  const grid: boolean[][] = [];
  const placed: Placement[] = [];

  const fits = (col: number, row: number, w: number, h: number) => {
    if (col + w > columns) return false;
    for (let y = row; y < row + h; y += 1) {
      for (let x = col; x < col + w; x += 1) {
        if (grid[y]?.[x]) return false;
      }
    }
    return true;
  };

  const occupy = (col: number, row: number, w: number, h: number) => {
    for (let y = row; y < row + h; y += 1) {
      if (!grid[y]) grid[y] = Array(columns).fill(false);
      for (let x = col; x < col + w; x += 1) grid[y][x] = true;
    }
  };

  for (let index = 0; index < count; index += 1) {
    const [rawW, h] = SHAPES[index % SHAPES.length];
    const w = Math.min(rawW, columns);
    let placedThis = false;
    for (let row = 0; row < 80 && !placedThis; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        if (!fits(col, row, w, h)) continue;
        occupy(col, row, w, h);
        placed.push({ index, col, row, w, h });
        placedThis = true;
        break;
      }
    }
  }

  return placed;
}

function Canvas({
  photos,
  columns,
  className,
}: {
  photos: string[];
  columns: number;
  className: string;
}) {
  const placed = pack(photos.length, columns);

  return (
    <div
      className={className}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: '148px',
        gap: '12px',
      }}
    >
      {placed.map((item) => (
        <figure
          key={photos[item.index]}
          className="m-0 overflow-hidden rounded-2xl bg-[#121214]"
          style={{
            gridColumn: `${item.col + 1} / span ${item.w}`,
            gridRow: `${item.row + 1} / span ${item.h}`,
          }}
        >
          <img
            src={photos[item.index]}
            alt={`IDEA Lab ${item.index + 1}`}
            className="h-full w-full object-cover"
          />
        </figure>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const photos = galleryPhotos();

  return (
    <main className="relative w-full min-h-screen bg-[#050507] text-white font-sans selection:bg-[#0071e3] selection:text-white">
      <section className="relative z-20 w-full px-6 sm:px-12 pt-10 pb-12 border-b border-white/10 bg-[#09090b]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center pb-6 border-b border-white/10 mb-8">
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
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mt-2">
              Gallery
            </h1>
          </div>
        </div>
      </section>

      <section className="relative w-full px-6 sm:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          <Canvas photos={photos} columns={2} className="grid md:hidden" />
          <Canvas photos={photos} columns={6} className="hidden md:grid" />
        </div>
      </section>
    </main>
  );
}
