const MAX_DIMENSION = 1600
const MAX_BYTES = 600 * 1024
const MIN_QUALITY = 0.5
const QUALITY_STEP = 0.12

export interface CompressImageOptions {
  /** Longest edge of the result, in pixels. */
  maxDimension?: number
  /** Target weight. Quality steps down until the blob fits (or hits MIN_QUALITY). */
  maxBytes?: number
  /** Starting encoder quality. */
  quality?: number
}

/**
 * Downscale and re-encode a camera photo before upload.
 *
 * Phone originals are 8-12 MP and several MB — far beyond the 112-390px tiles
 * we ever render, and enough to trip the API's 8 MB rule (or PHP's own
 * post_max_size) on a mobile connection, which failed silently. We resize the
 * long edge to `maxDimension` and step quality down until the blob fits.
 *
 * Never throws: if anything in the pipeline is unsupported, the original file
 * is returned so the upload still goes through.
 */
export async function compressImage(file: File, options: CompressImageOptions = {}): Promise<File> {
  const maxDimension = options.maxDimension ?? MAX_DIMENSION
  const maxBytes = options.maxBytes ?? MAX_BYTES

  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file

  try {
    const source = await loadImage(file)
    const { width, height } = scaleToFit(source.width, source.height, maxDimension)

    // Already small enough on both axes and on disk — don't re-encode for nothing.
    if (width === source.width && height === source.height && file.size <= maxBytes) {
      release(source)
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      release(source)
      return file
    }

    // JPEG has no alpha: without this, transparent PNGs come out black.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(source, 0, 0, width, height)
    release(source)

    const mimeType = preferredMimeType()
    let quality = options.quality ?? 0.8
    let blob = await toBlob(canvas, mimeType, quality)

    while (blob && blob.size > maxBytes && quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP)
      blob = await toBlob(canvas, mimeType, quality)
    }

    if (!blob || blob.size >= file.size) return file

    return new File([blob], renameExtension(file.name, mimeType), {
      type: mimeType,
      lastModified: Date.now(),
    })
  } catch {
    return file
  }
}

type ImageSource = ImageBitmap | HTMLImageElement

async function loadImage(file: File): Promise<ImageSource> {
  if (typeof createImageBitmap === 'function') {
    try {
      // `from-image` bakes in the EXIF orientation, so portrait phone shots
      // don't land sideways on the canvas.
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Older Safari rejects the options bag — fall through to the <img> path,
      // which applies EXIF orientation on its own.
    }
  }

  const url = URL.createObjectURL(file)
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('decode failed'))
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

function release(source: ImageSource) {
  if ('close' in source) source.close()
}

function scaleToFit(width: number, height: number, max: number) {
  const longest = Math.max(width, height)
  if (longest <= max) return { width, height }

  const ratio = max / longest
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) }
}

function toBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality))
}

function preferredMimeType(): 'image/webp' | 'image/jpeg' {
  const probe = document.createElement('canvas')
  probe.width = probe.height = 1

  // WebP is ~25-30% smaller than JPEG at equal quality and is accepted by the
  // API's `image` validation rule.
  return probe.toDataURL('image/webp').startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg'
}

function renameExtension(name: string, mimeType: string) {
  const extension = mimeType === 'image/webp' ? 'webp' : 'jpg'

  return `${name.replace(/\.[^.]+$/, '') || 'photo'}.${extension}`
}
