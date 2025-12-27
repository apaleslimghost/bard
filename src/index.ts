import * as Tone from "tone";
import scenes, { Scene } from "./scenes";
import { Layer } from "./layer";

const root = document.getElementById("root")!;
const ouija = document.getElementById("ouija")! as SegmentedXY;
const locations = document.getElementById("locations")! as LocationSelect;

type WithLoadPromise<T extends object> = T & {
	promise: Promise<null>;
};

type Pos = [number, number];

const hasLoadPromise = <T extends object>(o: T): o is WithLoadPromise<T> =>
	"promise" in o && o.promise instanceof Promise;

class SegmentedXY extends HTMLElement {
	static observedAttributes = ["x-segments", "y-segments"];

	position: Pos = [0, 0];

	surface: HTMLDivElement;
	dot: HTMLDivElement;
	status: HTMLSpanElement;

	constructor() {
		super();
		this.surface = document.createElement("div");
		this.surface.classList.add("surface");
		this.dot = document.createElement("div");
		this.status = document.createElement("span");
	}

	setPosition(event: MouseEvent) {
		const xSegments = this.getAttribute("x-segments")?.split(" ") ?? [];
		const ySegments = this.getAttribute("y-segments")?.split(" ") ?? [];

		const { x, y, width, height } = this.surface.getBoundingClientRect();

		const posX = (event.x - x) / width;
		const posY = (event.y - y) / height;

		this.position = [posX, posY];

		const segmentX = posX * (xSegments.length - 1);
		const segmentY = posY * (ySegments.length - 1);

		const lastSegX = Math.floor(segmentX);
		const lastSegY = Math.floor(segmentY);
		const nextSegX = Math.ceil(segmentX);
		const nextSegY = Math.ceil(segmentY);
		const segProgressX = segmentX - lastSegX;
		const segProgressY = segmentY - lastSegY;

		this.status.textContent = `
			${xSegments[lastSegX]} ${((1 - segProgressX) * 100).toFixed(0)}%
			${xSegments[nextSegX]} ${(segProgressX * 100).toFixed(0)}% /
			${ySegments[lastSegY]} ${((1 - segProgressY) * 100).toFixed(0)}%
			${ySegments[nextSegY]} ${(segProgressY * 100).toFixed(0)}%
		`;

		this.dot.style.left = `${event.x - x}px`;
		this.dot.style.top = `${event.y - y}px`;

		this.dispatchEvent(
			new CustomEvent("move", {
				detail: {
					position: this.position,
				},
			}),
		);
	}

	connectedCallback() {
		const xSegments = this.getAttribute("x-segments")?.split(" ") ?? [];
		const ySegments = this.getAttribute("y-segments")?.split(" ") ?? [];
		const wrapper = document.createElement("div");

		const xLabels = document.createElement("div");
		xLabels.classList.add("labels", "x");

		const yLabels = document.createElement("div");
		yLabels.classList.add("labels", "y");

		for (const seg of xSegments) {
			const label = document.createElement("span");
			label.textContent = seg;
			xLabels.appendChild(label);
		}

		for (const seg of ySegments) {
			const label = document.createElement("span");
			label.textContent = seg;
			yLabels.appendChild(label);
		}

		this.status.style.color = "black";
		this.dot.classList.add("dot");

		this.surface.addEventListener("mousedown", this.setPosition.bind(this));

		const shadow = this.attachShadow({ mode: "open" });

		const style = document.createElement("style");
		style.textContent = `
			.surface {
				user-select: none;
				background-color: white;
				width: 600px;
				height: 600px;
				margin: 1rem;
				border-radius: 1ex;
				position: relative;
			}

			.dot {
				position: absolute;
				width: 1ex;
				height: 1ex;
				background: black;
				border-radius: 0.5ex;
				margin-left: -0.5ex;
				margin-top: -0.5ex;
			}

			.labels {
				position: absolute;
				display: flex;
				justify-content: space-between;
			}

			.labels.x {
				width: 100%;
				top: -1rem;
			}

			.labels.y {
				height: 100%;
				writing-mode: vertical-rl;
				left: -1rem;
			}
		`;

		wrapper.appendChild(this.surface);
		this.surface.appendChild(this.dot);
		this.surface.appendChild(xLabels);
		this.surface.appendChild(yLabels);
		this.surface.appendChild(this.status);
		shadow.appendChild(wrapper);
		shadow.appendChild(style);
	}
}

class LocationSelect extends HTMLElement {
	static observedAttributes = ["locations"];

	location: string;

	constructor() {
		super();
		const locations = this.getAttribute("locations")?.split(" ") ?? [];
		this.location = locations[0];
	}

	connectedCallback() {
		const locations = this.getAttribute("locations")?.split(" ") ?? [];
		this.location = locations[0];

		const shadow = this.attachShadow({ mode: "open" });

		for (const location of locations) {
			const label = document.createElement("label");
			const input = document.createElement("input");
			input.type = "radio";
			input.name = "location";
			input.value = location;
			input.checked = location === this.location;

			input.addEventListener("input", () => {
				this.location = location;
				this.dispatchEvent(
					new CustomEvent("change", { detail: { location } }),
				);
			});

			label.appendChild(input);
			label.appendChild(document.createTextNode(location));
			shadow.appendChild(label);
		}
	}
}

class LayerDebug extends HTMLElement {
	layerBars: Record<string, HTMLElement> = {};

	connectedCallback() {
		const shadow = this.attachShadow({ mode: "open" });
		const wrapper = document.createElement("div");
		wrapper.style.display = "grid";
		wrapper.style.gridTemplateColumns = "20rem auto";
		shadow.appendChild(wrapper);

		for (const scene of scenes) {
			for (const layer of scene.layers) {
				const bar = (this.layerBars[
					scene.position[0] +
						"," +
						scene.position[1] +
						scene.location +
						layer.name
				] = document.createElement("div"));
				bar.style.height = "1rem";
				bar.style.background = "white";
				this.drawBar(scene, layer);

				const text = document.createTextNode(layer.name);
				wrapper.appendChild(text);
				wrapper.appendChild(bar);
			}
		}

		requestAnimationFrame(() => this.draw());
	}

	drawBar(scene: Scene, layer: Layer) {
		this.layerBars[
			scene.position[0] +
				"," +
				scene.position[1] +
				scene.location +
				layer.name
		].style.width = 100 * layer.gain.value + "px";
	}

	draw() {
		for (const scene of scenes) {
			for (const layer of scene.layers) {
				this.drawBar(scene, layer);
			}
		}

		requestAnimationFrame(() => this.draw());
	}
}

customElements.define("segmented-xy", SegmentedXY);
customElements.define("location-select", LocationSelect);
customElements.define("layer-debug", LayerDebug);

ouija.addEventListener("move", () => buildScene(false));
locations.addEventListener("change", () => buildScene(false));

const chebyshev = (p1: Pos, p2: Pos) =>
	Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1]));

/*
TODO
- track currently/previously playing location/scene and fade out
*/

function buildScene(initial: boolean) {
	for (const scene of scenes) {
		const gain =
			scene.location === locations.location
				? Math.sin(
						((1 -
							Math.max(
								0,
								Math.min(1, chebyshev(scene.position, ouija.position)),
							)) *
							Math.PI) /
							2,
					)
				: 0;

		for (const layer of scene.layers) {
			layer.start("@1m");

			if (initial) {
				layer.gain.value = gain;
			} else {
				layer.gain.rampTo(gain, layer.loopLength, "@1m");
			}
		}
	}
}

const loadPromise = Promise.all(
	scenes.flatMap((scene) => scene.layers.map((layer) => layer.load())),
);

root.addEventListener("click", async () => {
	if (
		root.classList.contains("pending") &&
		!root.classList.contains("loading")
	) {
		try {
			root.classList.add("loading");
			await Tone.start();
			Tone.getTransport().bpm.value = 106;
			Tone.getTransport().start(0);

			console.log("waiting for layers to load");

			await loadPromise;

			console.log("done");

			buildScene(true);

			root.classList.remove("pending", "loading");
		} catch {
			root.classList.remove("loading");
		}
	}
});
