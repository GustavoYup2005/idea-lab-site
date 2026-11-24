import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { unzipSync, strFromU8 } from 'fflate';

const run = promisify(execFile);
const studio = process.env.BAMBU_STUDIO_EXE || 'C:/Program Files/Bambu Studio/bambu-studio.exe';
const profiles = path.join(path.dirname(studio), 'resources/profiles/BBL');

async function preset(kind, name) {
  const source = JSON.parse(await readFile(path.join(profiles, kind, name + '.json'), 'utf8'));
  const settings = source.inherits ? await preset(kind, source.inherits) : {};
  for (const include of source.include || []) Object.assign(settings, await preset(kind, include));
  Object.assign(settings, source);
  delete settings.inherits;
  delete settings.include;
  return settings;
}

export async function sliceSTL(buffer) {
  const work = await mkdtemp(path.join(os.tmpdir(), 'idea-slice-'));
  try {
    const names = { machine: 'Bambu Lab X1 Carbon 0.4 nozzle', process: '0.20mm Standard @BBL X1C', filament: 'Bambu PLA Basic @BBL X1C' };
    for (const [kind, name] of Object.entries(names)) {
      await writeFile(path.join(work, kind + '.json'), JSON.stringify(await preset(kind, name)));
    }
    await writeFile(path.join(work, 'model.stl'), buffer);
    await run(studio, ['--load-settings', 'machine.json;process.json', '--load-filaments', 'filament.json',
      '--arrange', '1', '--slice', '1', '--export-3mf', 'plate.3mf', 'model.stl'],
      { cwd: work, windowsHide: true, timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
    const entry = 'Metadata/slice_info.config';
    const files = unzipSync(await readFile(path.join(work, 'plate.3mf')), { filter: file => file.name === entry });
    const xml = strFromU8(files[entry]);
    const weights = [...xml.matchAll(/<filament\b[^>]*\bused_g="([\d.]+)"/g)];
    if (weights.length !== 1 || !(Number(weights[0][1]) > 0)) throw Error('Expected one sliced filament.');
    return Number(weights[0][1]);
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}
