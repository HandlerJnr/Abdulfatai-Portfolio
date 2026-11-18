# Desktop Portfolio

A responsive, desktop-inspired portfolio starter built with plain HTML, CSS, and JavaScript. The interface includes movable project windows, a project dock, category filters, an About carousel, a collapsible hamburger menu, Liquid Glass controls, and a source information panel.

## Run locally

Open `index.html` in a browser. No build step or package installation is needed. The typeface loads from Google Fonts when a network connection is available; system fonts are used as a fallback.

## Personalize it

- Update the name, introduction, and social links in `index.html`.
- Replace the sample project data and copy in `app.js`.
- Replace the CSS landscape and project preview styles with imagery you own or have permission to use.
- Edit the eight About cards in `app.js`.
- Change colors, layout, and responsive behavior in `styles.css`.

All included portfolio copy and interface artwork are original sample content for this starter. Replace it with accurate information about your own work before publishing.

## Motion

All animation lives in `motion.js` and `motion.css`; `app.js` only calls `Motion.*` hooks.

- **Intro:** the wallpaper settles, the floating menu, toolbar and dock spring in, and windows cascade.
- **Dock:** macOS-style magnification follows the pointer; a launch bounce plays when an app opens.
- **Windows:** they open from their dock icon, minimise into it, close with a quick scale-out, and maximise with a FLIP transition. Dragging adds a slight velocity tilt and lift.
- **Filters:** the current set animates out, then the filtered set cascades in.
- **Popovers and overlays:** these scale and fade from their origin. The About carousel slides in the direction of travel.
- **Ambient:** a pill slides behind the sidebar nav, and the wallpaper has gentle pointer parallax.
- **Accessibility:** `prefers-reduced-motion` collapses all durations and disables tilt, parallax and magnification.


Floating navigation and controls use a Liquid Glass treatment, while project windows remain opaque for readability. Menu, sound controls, Control Center tiles, and Now Playing are local interface simulations. They do not change device settings or play audio.

## Desktop structure

- **Dock** = navigation: Home, About, Projects, Gallery (`apps` in `app.js`). Home minimises every window to reveal the wallpaper.
- **Projects** opens one Finder-style window listing every project (filters, cards, detail view with back button). Projects come from the `projects` array.
- **Gallery** is a Photos-style window. Add images to the `gallery` array, e.g. `{ src: 'assets/gallery/01.jpg', caption: 'Brighton' }`; placeholders show until then.
- **Menu bar**: hamburger menu (left), clock and a macOS-style Control Center (right) with Wi-Fi/Bluetooth/AirDrop, Focus, Stage Manager (tidies windows), Dark Mode, Display, Sound and Now Playing.

## Content and wallpaper

- **`data.js`** holds all content: About details, the 12 projects (role, problem, decisions, result, metrics with source notes, images, links) and the gallery list. Copy mirrors the published portfolio; edit here, not in `app.js`.
- **Wallpaper** is an inline SVG of the Seven Sisters cliffs near Brighton, in layers (`ridge-back`, `ridge-front`, `ground`) so the pointer parallax still works. Its colours are CSS variables: golden hour by default, night (moon and stars) in Dark Mode.
- Images use root paths (`/assets/...`), so preview the folder from the repository root, not by opening the file directly.
