'use client'
import { useState, useRef } from 'react'
import type { Product } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

const EMOJIS = ['🧺','🍍','🥦','🥭','🌽','🍅','🥬','🍋','🍊','🍇','🥕','🧅','🫑','🍆','🥑','🌿','🍌','🍓']
const CATEGORIES = [
  { key: 'fruits',   label: '🍍 Fruits' },
  { key: 'legumes',  label: '🥦 Légumes' },
  { key: 'mix',      label: '🔀 Mix' },
  { key: 'bio',      label: '🌿 Bio' },
  { key: 'solo',     label: '👤 Solo' },
  { key: 'smoothie', label: '🥤 Smoothie' },
]

export function ProductFormSheet({ product, onClose, onSave }: {
  product: Product | null
  onClose: () => void
  onSave: (p: Product) => void
}) {
  const isEdit = !!product
  const [name, setName] = useState(product?.name || '')
  const [shortDesc, setShortDesc] = useState(product?.short_description || '')
  const [desc, setDesc] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [stock, setStock] = useState(product?.stock?.toString() || '')
  const [category, setCategory] = useState<Product['category']>(product?.category || 'mix')
  const [emoji, setEmoji] = useState(product?.emoji || '🧺')
  const [isPromo, setIsPromo] = useState(product?.is_promo || false)
  const [imgPreview, setImgPreview] = useState<string | null>(product?.image_url || null)
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image trop lourde · Max 5 MB'); return }
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!name || !price) { setError('Nom et prix sont obligatoires'); return }
    setLoading(true); setError('')
    const supabase = createClient()

    let image_url = product?.image_url || null

    // Upload image to Supabase Storage if new file selected
    if (imgFile) {
      const ext = imgFile.name.split('.').pop()
      const path = `products/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('product-images').upload(path, imgFile)
      if (uploadErr) { setError('Erreur upload image'); setLoading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      image_url = publicUrl
    }

    const payload = {
      name, description: desc, short_description: shortDesc,
      price: parseFloat(price), stock: parseInt(stock) || 0,
      category, emoji, is_promo: isPromo, image_url,
      tags: [CATEGORIES.find(c => c.key === category)?.label.split(' ')[1] || 'Local'],
      is_active: true,
    }

    if (isEdit && product) {
      const { data, error: err } = await supabase.from('products').update(payload).eq('id', product.id).select().single()
      if (err) { setError(err.message); setLoading(false); return }
      onSave(data as Product)
    } else {
      const { data, error: err } = await supabase.from('products').insert(payload).select().single()
      if (err) { setError(err.message); setLoading(false); return }
      onSave(data as Product)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(15,46,23,0.5)', backdropFilter: 'blur(4px)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-3xl overflow-y-auto"
           style={{ maxHeight: '92vh', borderTop: '2px solid var(--green-border)', padding: '20px 22px 44px' }}>
        <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }}/>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
            {isEdit ? 'Modifier le panier' : 'Ajouter un panier'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2.5} className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Image upload */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Photo</p>
        <div onClick={() => fileRef.current?.click()}
             className="rounded-xl mb-2 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
             style={{ border: '2px dashed var(--green-border)', background: 'var(--green-pale)', height: imgPreview ? 'auto' : '120px' }}>
          {imgPreview ? (
            <img src={imgPreview} alt="aperçu" className="w-full object-cover rounded-xl" style={{ maxHeight: '160px' }}/>
          ) : (
            <div className="text-center p-4">
              <div className="text-3xl mb-1">📷</div>
              <p className="text-sm font-semibold" style={{ color: 'var(--green)' }}>Appuyer pour ajouter une photo</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>JPG, PNG · Max 5 MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} className="hidden"/>
        </div>
        {imgPreview && (
          <button onClick={() => { setImgPreview(null); setImgFile(null) }}
                  className="w-full text-xs font-semibold py-2 rounded-full mb-3"
                  style={{ color: '#c0392b', border: '1px solid rgba(192,57,43,0.3)' }}>
            ✕ Supprimer la photo
          </button>
        )}

        {/* Emoji fallback */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>
          Ou choisir une icône
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all"
                    style={{ border: `1.5px solid ${emoji === e ? 'var(--green)' : 'var(--border)'}`,
                             background: emoji === e ? 'var(--green-pale)' : 'var(--cream)' }}>
              {e}
            </button>
          ))}
        </div>

        {/* Fields */}
        {[
          { label: 'Nom du panier *', value: name, set: setName, placeholder: 'ex: Panier Tropical' },
          { label: 'Description courte', value: shortDesc, set: setShortDesc, placeholder: 'ex: Fruits de saison · 5 kg' },
        ].map(f => (
          <div key={f.label} className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-sub)' }}>{f.label}</p>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                   className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                   style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', fontFamily: 'inherit', color: 'var(--text)' }}/>
          </div>
        ))}

        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-sub)' }}>Description complète</p>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Décrivez le contenu du panier…"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', fontFamily: 'inherit', color: 'var(--text)' }}/>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: 'Prix (€) *', value: price, set: setPrice, type: 'number', placeholder: '0.00' },
            { label: 'Stock', value: stock, set: setStock, type: 'number', placeholder: '0' },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-sub)' }}>{f.label}</p>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                     className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                     style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', fontFamily: 'inherit', color: 'var(--text)' }}/>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-sub)' }}>Catégorie</p>
          <select value={category} onChange={e => setCategory(e.target.value as Product['category'])}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', fontFamily: 'inherit', color: 'var(--text)' }}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
             style={{ background: 'var(--cream)', border: '1.5px solid var(--border)' }}>
          <span className="text-sm font-medium">En promotion</span>
          <div className={`toggle ${isPromo ? 'on' : ''}`} onClick={() => setIsPromo(!isPromo)}/>
        </div>

        {error && <p className="text-xs font-medium mb-3 text-center" style={{ color: '#c0392b' }}>⚠ {error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose}
                  className="px-5 py-3 rounded-full text-sm font-medium"
                  style={{ background: 'var(--cream)', color: 'var(--text-muted)', border: '1.5px solid var(--border)' }}>
            Annuler
          </button>
          <button onClick={handleSave} disabled={loading}
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: 'var(--green)', boxShadow: '0 4px 14px rgba(26,107,47,0.25)' }}>
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
