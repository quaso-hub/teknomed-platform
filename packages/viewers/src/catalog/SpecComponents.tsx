// ─────────────────────────────────────────────────────────────
// @teknomed/viewers — Catalog spec components
// For the "Catalog View" toggle per product
// ─────────────────────────────────────────────────────────────

import type { ProductSpec, MaterialLayer } from '@teknomed/database';

interface SpecTableProps {
  specs: ProductSpec[];
}

export function ProductSpecTable({ specs }: SpecTableProps) {
  if (!specs.length) return null;
  return (
    <table className="w-full text-sm">
      <tbody>
        {specs.map((spec, i) => (
          <tr key={i} className="border-b border-gray-100 last:border-0">
            <td className="py-2 pr-4 font-medium text-gray-600 whitespace-nowrap">{spec.label}</td>
            <td className="py-2 text-gray-900">{spec.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface LayersProps {
  layers: MaterialLayer[];
}

export function MaterialLayers({ layers }: LayersProps) {
  if (!layers.length) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">Material Layers</h4>
      <div className="space-y-1">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-mono text-gray-500">
              {i + 1}
            </span>
            <span className="font-medium text-gray-800">{layer.name}</span>
            <span className="text-gray-500">{layer.material}</span>
            <span className="ml-auto text-gray-400 font-mono">{layer.thickness}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: GalleryProps) {
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`${productName} ${i + 1}`}
          className="w-full h-32 object-cover rounded-lg border border-gray-200"
        />
      ))}
    </div>
  );
}
