// src/components/MitraLogo.tsx
import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { getMitraLogo } from '../utils/mitraLogo';
import type { Mitra } from '../data/mitra';

const getInitials = (name: string) =>
  name
    .replace(/\b(PT|CV)\.?\s/gi, '')
    .replace(/[()]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

interface MitraLogoProps {
  mitra: Pick<Mitra, 'id' | 'name' | 'logoKey'>;
  className?: string; // atur ukuran container, mis. "h-16 w-40"
  large?: boolean;
}

export default function MitraLogo({ mitra, className = '', large = false }: MitraLogoProps) {
  const [failed, setFailed] = useState(false);
  const src = getMitraLogo(mitra.logoKey, mitra.id, mitra.name);

  if (src && !failed) {
    return (
      <div className={`flex items-center justify-start ${className}`}>
        <img
          src={src}
          alt={`Logo ${mitra.name}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain object-left"
        />
      </div>
    );
  }

  // Fallback profesional: monogram + ikon, bukan broken image
  return (
    <div
      role="img"
      aria-label={`Logo ${mitra.name} (placeholder inisial)`}
      className={`flex items-center gap-3 ${className}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center border border-slate-300 bg-slate-50 font-serif font-semibold tracking-wide text-slate-800 ${
          large ? 'h-20 w-20 rounded-2xl text-3xl' : 'h-14 w-14 rounded-xl text-xl'
        }`}
      >
        {getInitials(mitra.name)}
      </span>
      <Building2
        aria-hidden="true"
        className={`text-slate-300 ${large ? 'h-8 w-8' : 'h-5 w-5'}`}
        strokeWidth={1.5}
      />
    </div>
  );
}