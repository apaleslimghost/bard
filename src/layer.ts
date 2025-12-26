import * as Tone from "tone";

const base = import.meta.env.BASE_URL.endsWith("/")
	? import.meta.env.BASE_URL
	: import.meta.env.BASE_URL + "/";

export class Layer {
	private player: Tone.Player;
	private _gain: Tone.Gain;

	constructor(public name: string) {
		this._gain = new Tone.Gain({
			gain: 0,
			units: "gain",
			convert: true,
		}).toDestination();

		this.player = new Tone.Player({
			loop: true,
			autostart: false,
		})
			.sync()
			.connect(this._gain);
	}

	async load() {
		return this.player.load(base + `${this.name}.opus`);
	}

	get loaded() {
		return this.player.loaded;
	}

	get gain() {
		return this._gain.gain;
	}

	start(time: Tone.Unit.Time) {
		if (this.player.state === "stopped") {
			return this.player.start(time);
		}
	}
}
