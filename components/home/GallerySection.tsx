'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

interface GalleryImage {
  id: string
  image_url: string
  caption?: string
  link_url?: string
}

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  if (!images.length) return null

  return (
    <>
      <section className="gallery-section">
        <div className="page-inner">
          <div className="section-head" style={{ marginBottom: 40 }}>
            <div>
              <div className="section-label">OUR COLLECTION</div>
              <h2 className="section-title section-title-white">Gallery</h2>
            </div>
          </div>
          <div className="gallery-grid">
            {images.map(img => (
              <div
                key={img.id}
                className="gallery-item"
                style={{ position: 'relative' }}
                onClick={() => setLightbox(img)}
              >
                <img src={img.image_url} alt={img.caption || 'Gallery image'} />
                <div className="gallery-item-overlay">
                  {img.caption && <span className="gallery-caption">{img.caption}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <img className="lightbox-img" src={lightbox.image_url} alt={lightbox.caption || ''} />
            {lightbox.caption && (
              <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 14, fontSize: 14 }}>{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}