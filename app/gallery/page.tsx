import Link from 'next/link';

const PHOTOS = [
  '/1.jpeg',
  '/2.jpeg',
  '/3.jpeg',
  '/4.jpeg',
  '/5.jpeg',
  '/6.jpeg',
  '/7.jpeg',
  '/8.jpeg',
  '/9.jpeg',
  '/10.jpeg',
  '/11.jpeg',
  '/12.jpeg',
  '/13.jpeg',
  '/14.jpeg',
  '/15.jpeg',
  '/17.jpeg',
  '/18.jpeg',
  '/19.jpeg',
  '/20.jpeg',
  '/21.jpeg',
  '/22.jpeg',
];

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

function Canvas({ columns, className }: { columns: number; className: string }) {
  const placed = pack(PHOTOS.length, columns);

  return (
    <div
      className={className}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: `calc((100vw - 1.5rem - ${(columns - 1) * 12}px) / ${columns})`,
        gap: '12px',
      }}
    >
      {placed.map((item) => (
        <figure
          key={PHOTOS[item.index]}
          className="m-0 overflow-hidden rounded-2xl bg-[#121214]"
          style={{
            gridColumn: `${item.col + 1} / span ${item.w}`,
            gridRow: `${item.row + 1} / span ${item.h}`,
          }}
        >
          <img
            src={PHOTOS[item.index]}
            alt={`IDEA Lab ${item.index + 1}`}
            className="h-full w-full object-cover"
          />
        </figure>
      ))}
    </div>
  );
}

export default function GalleryPage() {
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

      <section className="relative w-full p-3">
        <Canvas columns={2} className="grid md:hidden" />
        <Canvas columns={6} className="hidden md:grid" />
      </section>
    </main>
  );
}
