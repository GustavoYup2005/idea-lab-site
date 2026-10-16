/** Public-folder URL. The NAU export prefixes /me/idealab; local dev leaves the path alone. */
export function asset(src: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!src.startsWith('/') || src.startsWith('//')) return src;
  return `${base}${src}`;
}
