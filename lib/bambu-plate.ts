import { unzipSync, strFromU8 } from "fflate";

export async function readBambuPlate(file: File) {
  if (file.size > 128 * 1024 * 1024) throw Error("Choose an export smaller than 128 MB.");
  const entry = "Metadata/slice_info.config";
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter: item => item.name === entry && item.originalSize <= 2 * 1024 * 1024,
  });
  if (!archive[entry]) throw Error("Slice the plate in Bambu Studio, then export the sliced plate as .gcode.3mf.");
  const xml = new DOMParser().parseFromString(strFromU8(archive[entry]), "application/xml");
  const plates = xml.querySelectorAll("plate");
  if (xml.querySelector("parsererror") || plates.length !== 1) throw Error("Export one sliced plate at a time.");
  const filaments = Array.from(plates[0].querySelectorAll("filament"));
  const weights = filaments.map(f => Number(f.getAttribute("used_g") ?? NaN));
  if (!weights.length || weights.some(g => !Number.isFinite(g) || g < 0))
    throw Error("The plate has incomplete filament weights. Export it again after slicing.");
  const used = weights.filter(g => g > 0);
  if (!used.length) throw Error("The plate contains no printable filament.");
  return { grams: Number(used.reduce((a,b) => a+b, 0).toFixed(2)), multiple: used.length > 1 };
}
