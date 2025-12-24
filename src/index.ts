import * as Tone from "tone";

const root = document.getElementById("root")!;

class SegmentedXY extends HTMLElement {
	static observedAttributes = ["x-segments", "y-segments"];

	position = [0, 0];

	surface: HTMLDivElement;
	dot: HTMLDivElement;
	status: HTMLSpanElement;
	moving = false;

	constructor() {
		super();
		this.surface = document.createElement("div");
		this.surface.classList.add("surface");
		this.dot = document.createElement("div");
		this.status = document.createElement("span");
	}

	setPosition(event: MouseEvent) {
		if (!this.moving) return;

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

		this.surface.addEventListener("mousedown", () => (this.moving = true));
		this.surface.addEventListener("mouseup", () => (this.moving = false));
		this.surface.addEventListener("mousemove", this.setPosition.bind(this));

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

customElements.define("segmented-xy", SegmentedXY);

root.addEventListener("click", async () => {
	if (root.classList.contains("pending")) {
		await Tone.start();
		Tone.getTransport().start("0");
		root.classList.remove("pending");
	}
});
