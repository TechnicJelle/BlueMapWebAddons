// Sources:
//   https://github.com/mataaj/BlueMap/blob/feat/html-marker-3d-flag/common/webapp/src/js/util/CSS3DRenderer.js
//   https://github.com/mrdoob/three.js/blob/dev/examples/jsm/renderers/CSS3DRenderer.js
//   http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
//   MIT License
//   Adapted for usage here

const { Matrix4, Object3D, Quaternion, Vector2, Vector3 } = window.BlueMap.Three;
const { dispatchEvent } = window.BlueMap;

export class CSS3DObject extends Object3D {
    constructor(element) {
        super();
        this.isCSS3DObject = true;

        this.element = document.createElement("div");
        this.element.style.position = "absolute";
        this.element.style.transformOrigin = "0 0 0";
        this.element.style.willChange = "transform";

        if (element.parentNode) element.parentNode.replaceChild(this.element, element);
        this.element.appendChild(element);

        this.element.setAttribute("draggable", false);

        this.anchor = new Vector2();
        this.events = null;

        this.addEventListener("removed", function () {
            this.traverse((object) => {
                if (object.element instanceof Element && object.element.parentNode !== null) {
                    object.element.parentNode.removeChild(object.element);
                }
            });
        });

        let lastClick = -1;
        const handleClick = (event) => {
            const now = Date.now();
            const doubleTap = now - lastClick < 500;
            lastClick = now;
            const data = { doubleTap };
            if (!this.onClick({ event, data })) {
                dispatchEvent(this.events, "bluemapMapInteraction", { data, object: this });
            } else {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        this.element.addEventListener("click", handleClick);
        this.element.addEventListener("touchend", handleClick);
    }

    copy(source, recursive) {
        super.copy(source, recursive);
        this.element = source.element.cloneNode(true);
        this.anchor.copy(source.anchor);
        return this;
    }
}

export class CSS3DRenderer {
    constructor(parameters = {}) {
        this.events = parameters.events ?? null;

        let _width, _height, _widthHalf, _heightHalf;

        const cache = {
            camera: { style: "" },
            objects: new WeakMap(),
        };

        const domElement =
            parameters.element !== undefined ? parameters.element : document.createElement("div");
        domElement.style.overflow = "hidden";
        this.domElement = domElement;

        const viewElement = document.createElement("div");
        viewElement.style.transformOrigin = "0 0";
        viewElement.style.pointerEvents = "none";
        domElement.appendChild(viewElement);

        const cameraElement = document.createElement("div");
        cameraElement.style.transformStyle = "preserve-3d";
        viewElement.appendChild(cameraElement);

        this.getSize = () => ({ width: _width, height: _height });

        this.setSize = (width, height) => {
            _width = width;
            _height = height;
            _widthHalf = width / 2;
            _heightHalf = height / 2;
            domElement.style.width = width + "px";
            domElement.style.height = height + "px";
            viewElement.style.width = width + "px";
            viewElement.style.height = height + "px";
            cameraElement.style.width = width + "px";
            cameraElement.style.height = height + "px";
        };

        function epsilon(v) {
            return Math.abs(v) < 1e-10 ? 0 : v;
        }

        function getCameraCSSMatrix(m) {
            const e = m.elements;
            return (
                "matrix3d(" +
                epsilon(e[0]) + "," +
                epsilon(-e[1]) + "," +
                epsilon(e[2]) + "," +
                epsilon(e[3]) + "," +
                epsilon(e[4]) + "," +
                epsilon(-e[5]) + "," +
                epsilon(e[6]) + "," +
                epsilon(e[7]) + "," +
                epsilon(e[8]) + "," +
                epsilon(-e[9]) + "," +
                epsilon(e[10]) + "," +
                epsilon(e[11]) + "," +
                epsilon(e[12]) + "," +
                epsilon(-e[13]) + "," +
                epsilon(e[14]) + "," +
                epsilon(e[15]) +
                ")"
            );
        }

        function getObjectCSSMatrix(m, anchor = new Vector2()) {
            const e = m.elements;
            const mat =
                "matrix3d(" +
                epsilon(e[0]) + "," +
                epsilon(e[1]) + "," +
                epsilon(e[2]) + "," +
                epsilon(e[3]) + "," +
                epsilon(-e[4]) + "," +
                epsilon(-e[5]) + "," +
                epsilon(-e[6]) + "," +
                epsilon(-e[7]) + "," +
                epsilon(e[8]) + "," +
                epsilon(e[9]) + "," +
                epsilon(e[10]) + "," +
                epsilon(e[11]) + "," +
                epsilon(e[12]) + "," +
                epsilon(e[13]) + "," +
                epsilon(e[14]) + "," +
                epsilon(e[15]) +
                ")";
            return mat + ` translate(-50%,-50%) translate(${-anchor.x}px,${-anchor.y}px)`;
        }

        function hideObject(object) {
            if (object.isCSS3DObject) object.element.style.display = "none";
            for (let i = 0; i < object.children.length; i++) hideObject(object.children[i]);
        }

        const _matrix = new Matrix4();
        const _matrix2 = new Matrix4();
        const _position = new Vector3();
        const _quaternion = new Quaternion();
        const _scale = new Vector3();

        const _this = this;

        function renderObject(object, scene, camera) {
            if (object.visible === false) {
                hideObject(object);
                return;
            }

            if (object.isCSS3DObject) {
                object.events = _this.events;

                const visible = object.layers.test(camera.layers);
                const el = object.element;
                el.style.display = visible && el.style.opacity !== "0" ? "" : "none";

                if (visible) {
                    object.onBeforeRender(_this, scene, camera);

                    let style;
                    if (object.isCSS3DSprite) {
                        _matrix.copy(camera.matrixWorldInverse).transpose();
                        if (object.rotation2D !== 0) {
                            _matrix.multiply(_matrix2.makeRotationZ(object.rotation2D));
                        }
                        object.matrixWorld.decompose(_position, _quaternion, _scale);
                        _matrix.setPosition(_position);
                        _matrix.scale(_scale);
                        _matrix.elements[3] = 0;
                        _matrix.elements[7] = 0;
                        _matrix.elements[11] = 0;
                        _matrix.elements[15] = 1;
                        style = getObjectCSSMatrix(_matrix, object.anchor);
                    } else {
                        style = getObjectCSSMatrix(object.matrixWorld, object.anchor);
                    }

                    const cached = cache.objects.get(object);
                    if (cached === undefined || cached.style !== style) {
                        el.style.transform = style;
                        cache.objects.set(object, { style });
                    }

                    if (el.parentNode !== cameraElement) {
                        cameraElement.appendChild(el);
                    }

                    object.onAfterRender(_this, scene, camera);
                }
            }

            for (let i = 0; i < object.children.length; i++) {
                renderObject(object.children[i], scene, camera);
            }
        }

        this.render = function (scene, camera) {
            if (camera.view && camera.view.enabled) {
                viewElement.style.transform =
                    `translate(${-camera.view.offsetX * (_width / camera.view.width)}px,` +
                    `${-camera.view.offsetY * (_height / camera.view.height)}px)` +
                    `scale(${camera.view.fullWidth / camera.view.width},` +
                    `${camera.view.fullHeight / camera.view.height})`;
            } else {
                viewElement.style.transform = "";
            }

            if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld();
            if (camera.parent === null && camera.matrixWorldAutoUpdate === true)
                camera.updateMatrixWorld();

            const scaleByViewOffset =
                camera.view && camera.view.enabled
                    ? camera.view.height / camera.view.fullHeight
                    : 1;

            const rawOrtho = camera.ortho ?? 0;
            const normalizedOrtho = rawOrtho <= 0 ? 0 : -Math.pow(rawOrtho - 1, 6) + 1;

            let cameraCSSMatrix, perspective;

            if (normalizedOrtho > 0.98) {
                const tanHalfFov = Math.tan((Math.PI / 180) * 0.5 * camera.fov);
                const zoom = camera.zoom || 1;
                const distance = Math.max(camera.distance, 0.0001);
                const scale = (_heightHalf * zoom) / (tanHalfFov * distance);
                cameraCSSMatrix =
                    `scale(${scaleByViewOffset}) scale(${scale})` +
                    getCameraCSSMatrix(camera.matrixWorldInverse);
                perspective = "";
            } else {
                const fov_px = camera.projectionMatrix.elements[5] * _heightHalf;
                cameraCSSMatrix =
                    `scale(${scaleByViewOffset}) translateZ(${fov_px}px)` +
                    getCameraCSSMatrix(camera.matrixWorldInverse);
                perspective = `perspective(${fov_px}px) `;
            }

            const style =
                perspective + cameraCSSMatrix + `translate(${_widthHalf}px,${_heightHalf}px)`;

            if (cache.camera.style !== style) {
                cameraElement.style.transform = style;
                cache.camera.style = style;
            }

            renderObject(scene, scene, camera);
        };
    }
}
