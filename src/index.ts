import * as Tone from "tone";

const root = document.getElementById("root")!;

class SegmentedSlider extends HTMLElement {
	static observedAttributes = ["segments"];

	connectedCallback() {
		const segments = this.getAttribute("segments").split(" ");
		const shadow = this.attachShadow({ mode: "open" });

		const wrapper = document.createElement("span");
		const status = document.createElement("span");
		status.innerText = segments[0];

		const input = document.createElement("input");
		input.type = "range";
		input.value = 0;
		input.max = 1;
		input.step = 0.001;

		input.addEventListener("input", (event) => {
			const value = input.valueAsNumber;
			const progress = (segments.length - 1) * value;
			const firstSegment = segments[Math.floor(progress)];
			const nextSegment = segments[Math.ceil(progress)];
			const segmentProgress = progress - Math.floor(progress);

			status.innerText =
				segmentProgress === 0
					? firstSegment
					: `${(segmentProgress * 100).toFixed(0)}% ${firstSegment} / ${((1 - segmentProgress) * 100).toFixed(0)}% ${nextSegment}`;
		});

		wrapper.appendChild(input);
		wrapper.appendChild(status);

		shadow.appendChild(wrapper);
	}
}

class SegmentedXY extends HTMLElement {
	static observedAttributes = ["x-segments", "y-segments"];

	connectedCallback() {
		const wrapper = document.createElement("div");
		const x = document.createElement("segmented-slider");
		x.setAttribute("segments", this.getAttribute("x-segments"));

		const y = document.createElement("segmented-slider");
		y.setAttribute("segments", this.getAttribute("y-segments"));

		const shadow = this.attachShadow({ mode: "open" });

		wrapper.appendChild(x);
		wrapper.appendChild(y);
		shadow.appendChild(wrapper);
	}
}

customElements.define("segmented-slider", SegmentedSlider);
customElements.define("segmented-xy", SegmentedXY);

root.addEventListener("click", async () => {
	if (root.classList.contains("pending")) {
		await Tone.start();
		root.classList.remove("pending");
	}
});
