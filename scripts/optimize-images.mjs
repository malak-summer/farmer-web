import sharp from 'sharp'
import { readFile, writeFile, stat } from 'node:fs/promises'
const source = 'public/media/farmer.jpg'
const target = 'public/media/farmer.webp'
await sharp(source).webp({ lossless: true, effort: 6 }).toFile(target)
const before = await sharp(source).removeAlpha().raw().toBuffer()
const after = await sharp(target).removeAlpha().raw().toBuffer()
if (!before.equals(after)) throw new Error('Lossless pixel comparison failed')
process.stdout.write(JSON.stringify({ originalBytes: (await stat(source)).size, webpBytes: (await stat(target)).size, decodedPixelsIdentical: true }))
const logo = await readFile('public/brand/fresh-farm-light.svg')
const resized = await sharp(logo).resize(980).png().toBuffer()
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#f8f5ed' } }).composite([{ input: resized, gravity: 'centre' }]).png().toFile('public/brand/social-card.png')
await writeFile('image-optimization.json', JSON.stringify({ source, target, originalBytes: (await stat(source)).size, optimizedBytes: (await stat(target)).size, decodedPixelsIdentical: true }, null, 2))
