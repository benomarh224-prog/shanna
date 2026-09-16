# SHANNA

A complete luxury perfume concept store with a procedural real-time 3D scroll narrative. No external models, fonts, images, video, API keys, or paid services are required.

## Run

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000 (this avoids any unrelated service already bound to IPv6 localhost).

```sh
npm run typecheck
npm run build
npm start
```

## Architecture

- Hero art direction is available in [Figma — SHANNA Cinematic 3D Hero](https://www.figma.com/design/dWuUiDceatbJ12TxncfnFg?node-id=2-2). Figma contains the editable composition reference; the live website renders real procedural geometry, not the Figma bottle illustration. `app/hero.css` implements the layout and locally bundled Cormorant Garamond/Inter typography. The hero includes a subtle shader glow, elliptical 3D surround, improved glass/liquid lighting, damped pointer response, and a separate mobile composition. Desktop 1440 × 900 and mobile 390 × 844 were visually inspected; discovery CTA and reverse scrolling were checked, with no browser console errors.

- `components/CollectionBottle.tsx`: individual procedural 3D collection bottles, fragrance-specific labels and liquid colors, smooth scroll-linked reveal/rotation, pointer tilt, and keyboard-focus lift. Canvases load near the viewport and pause rendering offscreen; reduced motion uses demand rendering. Includes rendering-error/context-loss fallbacks. The collection update was verified on desktop and 390px mobile, including opening a product and adding/removing it from the bag; browser console showed no errors.

- Next.js App Router, TypeScript, React Three Fiber, Three.js, Drei, GSAP ScrollTrigger, Lenis, and Tailwind CSS 4.
- `components/BottleScene.tsx`: procedural rounded glass, transmissive berry liquid, metallic removable cap, atomizer, dip tube, canvas-generated label, studio lightformers, and note sculptures. No remote environment maps or models.
- `components/Storefront.tsx`: one scrubbed timeline coordinates bottle transforms, camera distance, cap separation, scene color, lighting, note elements, and five text chapters. The sticky scene occupies 550vh. Scrolling backwards reverses the same timeline. Mutable refs are consumed in the render loop; animation does not set React state per frame.
- Reduced motion removes floating particles, rotation, camera travel, cap movement, and smooth scrolling. Chapter visibility and gentle positioning still track scroll.
- DPR is capped at 1.5; environment resolution is 128; no real-time shadows. WebGL availability is tested after hydration. A CSS bottle replaces the scene when unavailable or context is lost.
- Native modal dialogs provide focus trapping, Escape dismissal, and focus restoration. Cart operations persist validated data to `localStorage`; storage failures are handled without breaking the store.

## Commerce scope

Products, descriptions, and MAD prices are illustrative. Sizes are 30, 50, and 100 ml. Cart quantities are limited to 99 per variant. Checkout is visibly disabled until a real payment provider is integrated. No order or payment success is simulated. Connect a backend, inventory, tax/shipping calculations, and payment provider before commercial use.

## Manual verification

Scroll through all five chapters and back to the start; check cap lift and return. Resize to a narrow viewport. Open each product, choose each size, add variants, change quantities, remove items, and reload to confirm persistence. Tab through dialogs, close with Escape, test reduced motion and a browser without WebGL.

## Completed verification

- Production build and TypeScript check pass.
- npm audit reports zero vulnerabilities; PostCSS is overridden to the patched compatible 8.5 series.
- Browser-verified forward/reverse scene animation and fully visible lifted cap.
- Inspected desktop and 390 × 844 mobile layouts, mobile navigation, and product dialog layout.
- Verified all three product dialogs, 30/50/100 ml selection, quantity increases/decreases, removal, empty state, and Escape dismissal/focus restoration.
- Verified reload persistence and totals: Night Bloom 100 ml × 2 = 2,580 MAD; Silver Skin 30 ml + Velvet Rose 50 ml = 1,470 MAD.
- Final browser console error check was empty. Test cart was cleared.
- Reduced-motion and WebGL-unavailable branches are implemented but were not device-emulated during the browser checks. Physical-device performance remains hardware dependent.
