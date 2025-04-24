const template = document.createElement("template");
export default template;

template.innerHTML = /* css */ `
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""
/>

<style>
:host {
  display: block;
}

#map {
  width: 100%;
  height: 100%;
}

@media (prefers-color-scheme: dark) { 
  .leaflet-layer,
  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out,
  .leaflet-control-attribution {
    filter: invert(100%) hue-rotate(180deg) brightness(100%) contrast(90%);
  }

  .leaflet-container {
    background-color: rgb(49, 49, 49);
  }
}
</style>
`;
