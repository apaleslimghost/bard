import * as Tone from "tone";

export default Object.fromEntries(
	[
		"amen",
		"apprehensive",
		"bansuri",
		"barrels",
		"bells",
		"bonks",
		"cello-foley",
		"cello",
		"clarinet",
		"cyclical",
		"cyclical2",
		"discord",
		"ethereal",
		"foley",
		"gloaming",
		"hats",
		"impending",
		"metallic",
		"pads",
		"piano-foley",
		"poly",
		"pulse",
		"pulse2",
		"spooky",
		"stacc",
		"string-chords",
		"tension",
		"trepidation",
		"wood",
	].map((name) => {
		const { promise, resolve, reject } = Promise.withResolvers();

		return [
			name,
			() =>
				Object.assign(
					new Tone.Player({
						url: `/${name}.mp3`,
						loop: true,
						autostart: false,
						volume: -140,
						onload: () => resolve(null),
						onerror: reject,
					})
						.sync()
						.toDestination(),
					{ name, promise },
				),
		];
	}),
);
