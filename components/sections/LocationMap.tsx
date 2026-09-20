"use client";

import { CrosshairSimpleIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const STUDIO: [number, number] = [site.coordinates.lng, site.coordinates.lat];
const STREET_ZOOM = 14.6;

// Palette-matched overrides applied over Mapbox's light style.
function restyle(map: import("mapbox-gl").Map) {
  for (const layer of map.getStyle()?.layers ?? []) {
    try {
      if (layer.type === "background") map.setPaintProperty(layer.id, "background-color", "#F3F2F0");
      else if (layer.type === "fill" && layer.id.includes("water")) map.setPaintProperty(layer.id, "fill-color", "#C9D5E0");
      else if (layer.type === "fill" && /land|park|building/.test(layer.id))
        map.setPaintProperty(layer.id, "fill-color", layer.id.includes("building") ? "#E6E4E1" : "#ECEAE7");
      else if (layer.type === "line" && layer.id.includes("road")) map.setPaintProperty(layer.id, "line-color", "#FFFFFF");
      else if (layer.type === "symbol") map.setPaintProperty(layer.id, "text-color", "#43586B");
    } catch {
      // A layer that does not support the property is left as Mapbox styled it.
    }
  }
  // Light atmosphere around the globe: no dark space, the page stays light.
  map.setFog({
    color: "#F3F2F0",
    "high-color": "#E4E9EE",
    "space-color": "#E4E9EE",
    "horizon-blend": 0.06,
    "star-intensity": 0,
  });
}

/** The OpenStreetMap image: used when there is no token, or JavaScript is off. */
function StaticMap() {
  return (
    <>
      <Image
        src="/images/map-fallback.webp"
        alt={`Street map of the West Town area of Chicago, centred on ${site.address.line1}`}
        width={1400}
        height={934}
        sizes="(min-width: 1024px) 760px, 100vw"
        className="absolute inset-0 size-full rounded-(--radius-panel) object-cover"
      />
      <span className="lq-map-marker absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full" aria-hidden />
    </>
  );
}

/**
 * With a Mapbox token the section opens on the globe and flies in to the
 * workshop once it is in view; "Back to the workshop" flies there again after
 * the visitor wanders off. Mapbox GL (heavy) is imported only as the section
 * approaches the viewport. Without a token, the static map stands in.
 */
export function LocationMap() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const [live, setLive] = useState(false);

  const flyHome = (instant = false) => {
    const map = mapRef.current;
    if (!map) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (instant || reduce) map.jumpTo({ center: STUDIO, zoom: STREET_ZOOM, bearing: 0, pitch: 0 });
    else map.flyTo({ center: STUDIO, zoom: STREET_ZOOM, bearing: 0, pitch: 0, duration: 3200, essential: false });
  };

  useEffect(() => {
    if (!TOKEN || !wrap.current) return;
    const el = wrap.current;
    let cancelled = false;
    let loaded = false;
    let inView = false;
    let flown = false;

    // First fly-in only once the globe has loaded AND the panel is on screen.
    const maybeFlyIn = () => {
      if (flown || !loaded || !inView) return;
      flown = true;
      setTimeout(() => !cancelled && flyHome(), 1800);
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.4;
        maybeFlyIn();
      },
      { threshold: [0, 0.4] },
    );

    // Start loading a little before the section arrives.
    const loader = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        loader.disconnect();
        const [{ default: mapboxgl }] = await Promise.all([
          import("mapbox-gl"),
          import("mapbox-gl/dist/mapbox-gl.css"),
        ]);
        if (cancelled || !canvas.current) return;
        mapboxgl.accessToken = TOKEN;
        const map = new mapboxgl.Map({
          container: canvas.current,
          style: "mapbox://styles/mapbox/light-v11",
          projection: "globe",
          center: [STUDIO[0] + 25, STUDIO[1] - 5],
          zoom: 1.4,
          // Page scroll is never hijacked: ctrl/cmd + scroll or two fingers to
          // zoom, plus the +/- buttons and double-click.
          cooperativeGestures: true,
        });
        mapRef.current = map;
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false }), "top-right");
        const marker = document.createElement("div");
        marker.className = "lq-map-marker";
        marker.setAttribute("aria-hidden", "true");
        new mapboxgl.Marker({ element: marker, anchor: "bottom" }).setLngLat(STUDIO).addTo(map);
        map.on("style.load", () => restyle(map));
        map.on("load", () => {
          if (cancelled) return;
          map.resize();
          setLive(true);
          loaded = true;
          maybeFlyIn();
        });
      },
      { rootMargin: "400px 0px" },
    );

    loader.observe(el);
    visibility.observe(el);
    return () => {
      cancelled = true;
      loader.disconnect();
      visibility.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (!TOKEN) {
    return (
      <figure>
        <div className="relative h-[22rem] overflow-hidden rounded-(--radius-panel) bg-surface-alt ring-1 ring-line sm:h-[28rem] lg:h-[40rem]">
          <StaticMap />
        </div>
        <figcaption className="mt-2 text-caption text-ink-faint">
          Map data &copy;{" "}
          <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-ink">
            OpenStreetMap contributors
          </a>
        </figcaption>
      </figure>
    );
  }

  return (
    <div ref={wrap} className="lq-map relative h-[22rem] sm:h-[28rem] lg:h-[40rem]">
      {/* Globe-tinted panel while Mapbox loads. */}
      <div
        aria-hidden
        className={`absolute inset-0 rounded-(--radius-panel) bg-steel-soft transition-opacity duration-700 ${live ? "opacity-0" : ""}`}
      />
      <noscript>
        <div className="absolute inset-0">
          <StaticMap />
        </div>
      </noscript>

      {/* Mapbox sets position: relative on its container, so it gets its own
          full-size element inside the absolutely positioned layer. */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "pointer-events-none opacity-0"}`}
        role={live ? "region" : undefined}
        aria-label={live ? `Interactive map of ${site.address.line1}, ${site.address.line2}` : undefined}
      >
        <div ref={canvas} className="size-full" />
      </div>

      {/* Soft edges: a frosted blur that fades in toward the rim. Below the
          Mapbox controls and attribution, which stay crisp. */}
      <div aria-hidden className="lq-map-edge pointer-events-none absolute inset-0" />

      {live && (
        <button
          type="button"
          onClick={() => flyHome()}
          className="absolute bottom-10 left-1/2 z-[3] inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-surface px-5 text-[0.9375rem] font-semibold text-ink shadow-(--shadow-raised) ring-1 ring-line transition-colors hover:bg-accent-soft hover:text-accent-ink"
        >
          <CrosshairSimpleIcon size={18} weight="bold" aria-hidden className="text-accent" />
          Back to the workshop
        </button>
      )}
    </div>
  );
}
