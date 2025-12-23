import * as Tone from "tone";

const root = document.getElementById("root")!;

root.addEventListener("click", async () => {
	if (root.classList.contains("pending")) {
		await Tone.start();
		root.classList.remove("pending");
	}
});
