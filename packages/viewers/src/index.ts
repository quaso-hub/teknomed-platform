// ─────────────────────────────────────────────────────────────
// @teknomed/viewers — Barrel export
//
// NOTE: 3D viewer components (Assembled3D, Exploded3D) are large
// and will be migrated from 3dproductcatalog in Phase 3.
// This package currently exports catalog spec components.
// ─────────────────────────────────────────────────────────────

// Catalog spec components
export { ProductSpecTable, MaterialLayers, ProductGallery } from './catalog/SpecComponents';

// 3D viewer components (placeholder — will be populated in Phase 3)
// export { PacsCabinetAssembled3D } from './assembled/PacsCabinetAssembled3D';
// export { ScrubSinkAssembled3D } from './assembled/ScrubSinkAssembled3D';
// export { HermeticDoorAssembled3D } from './assembled/HermeticDoorAssembled3D';
// ... (17 products)

// Hooks (placeholder — will be migrated in Phase 3)
// export { useThreeScene } from './hooks/useThreeScene';
// export { useHighlightController } from './hooks/useHighlightController';

// Lib (placeholder — will be migrated in Phase 3)
// export { applyCameraPreset, downloadPNG, placeAnnotations } from './lib/three-scene';
