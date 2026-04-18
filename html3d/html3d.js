// Usage:
//   Add these CSS classes to any HTML marker in your marker config to make it 3D:
//   Use underscores for decimal seperator. Negative values are allowed.
//   Anchor is by default the middle of the html element.
//
//   "html3d"              - enable 3D rendering for this marker (required)
//   "html3d-density-64"   - CSS pixels per block, controls world-space scale (default: 64)
//   "html3d-width-15"     - width in blocks, sets explicit CSS pixel width on the element
//   "html3d-height-7_5"   - height in blocks, sets explicit CSS pixel height on the element
//   "html3d-rx-0"         - X rotation in degrees (default: 0)
//   "html3d-ry-0"         - Y rotation in degrees (default: 0)
//   "html3d-rz-0"         - Z rotation in degrees (default: 0)
//   "html3d-doublesided"  - show the marker from both sides (default: hidden when viewed from behind)

void async function() {
    const { CSS3DObject, CSS3DRenderer } = await import("./CSS3DRenderer.js");
    const { HtmlMarker, CSS2DObject } = window.BlueMap;
    const mapViewer = window.bluemap.mapViewer;

    const DEG = Math.PI / 180;

    function hijack(obj, func, override) {
        const orig = obj[func];
        obj[func] = function (...args) {
            return override(orig.bind(this)).call(this, ...args);
        };
    }

    function parseClassFloat(classes, prefix, def) {
        return parseFloat(classes.find(c => c.startsWith(prefix))?.slice(prefix.length).replace(/_/g, ".") ?? def);
    }

    function htmlToElement(html) {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    function createElementObject(id, type, is3d) {
        const div = htmlToElement(`<div id="bm-marker-${id}" class="bm-marker-${type}"></div>`);
        return is3d ? new CSS3DObject(div) : new CSS2DObject(div);
    }

    const css3dRenderer = new CSS3DRenderer({ events: mapViewer.events });
    css3dRenderer.domElement.style.position = "absolute";
    css3dRenderer.domElement.style.top = "0";
    css3dRenderer.domElement.style.left = "0";
    css3dRenderer.domElement.style.pointerEvents = "none";

    const outerDiv = mapViewer.rootElement.childNodes[0];
    outerDiv.appendChild(css3dRenderer.domElement);

    window.removeEventListener("resize", mapViewer.handleContainerResize);
    hijack(mapViewer, "handleContainerResize", (original) => function() {
        css3dRenderer.setSize(this.rootElement.clientWidth, this.rootElement.clientHeight);
        original();
    })
    window.addEventListener("resize", mapViewer.handleContainerResize.bind(mapViewer));

    hijack(mapViewer, "render", (original) => function(delta) {
        original(delta);
        css3dRenderer.render(this.markers, this.camera);
    })

    hijack(HtmlMarker.prototype, "updateFromData", (original) => function (markerData) {
        const classes = markerData.classes ?? [];

        const is3d = classes.includes("html3d");
        const doublesided = classes.includes("html3d-doublesided");
        const density = parseClassFloat(classes, "html3d-density-", 64);
        const width = classes.find(c => c.startsWith("html3d-width-"))
            ? parseClassFloat(classes, "html3d-width-", null) : null;
        const height = classes.find(c => c.startsWith("html3d-height-"))
            ? parseClassFloat(classes, "html3d-height-", null) : null;
        const rx = parseClassFloat(classes, "html3d-rx-", 0) * DEG;
        const ry = parseClassFloat(classes, "html3d-ry-", 0) * DEG;
        const rz = parseClassFloat(classes, "html3d-rz-", 0) * DEG;

        markerData = { ...markerData, classes: classes.filter(c => !c.startsWith("html3d")) };

        if (this.data.is3d !== is3d) {
            this.data.is3d = is3d;
            this.remove(this.elementObject);
            this.elementObject = createElementObject(this.data.id, this.data.type, is3d);
            this.elementObject.onBeforeRender = (r, s, c) => this.onBeforeRender(r, s, c);
            this.add(this.elementObject);
        }

        if (is3d) {
            const scale = 1 / Math.max(1, density);
            this.elementObject.scale.setScalar(scale);
            this.elementObject.rotation.order = "YXZ";
            this.elementObject.rotation.set(rx, ry, rz, "YXZ");
            this.elementObject.element.style.backfaceVisibility = doublesided ? "visible" : "hidden";
        }

        original(markerData);
        
        if (is3d) {
            const el = this.element;
            el.style.width  = width  !== null ? (width  * density) + "px" : "";
            el.style.height = height !== null ? (height * density) + "px" : "";
            el.style.overflow = (width !== null || height !== null) ? "hidden" : "";
        }
    });

    mapViewer.handleContainerResize();
    window.bluemap.markerFileManager.clear();
    window.bluemap.markerFileManager.update().catch(console.error);

    console.log("[html3d] Loaded");
}();
