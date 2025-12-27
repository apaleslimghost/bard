import * as Tone from "tone";

const base = import.meta.env.BASE_URL.endsWith("/")
	? import.meta.env.BASE_URL
	: import.meta.env.BASE_URL + "/";

export class Layer {
	private player: Tone.Player;
	private _gain: Tone.Gain;

	static output = new Tone.Limiter(-12).toDestination();

	constructor(public name: string) {
		this._gain = new Tone.Gain({
			gain: 0,
			units: "gain",
			convert: true,
		}).connect(Layer.output);

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

	get progress() {
		if (this.player.state === "stopped") {
			return 0;
		}

		return (
			(Tone.getTransport().toSeconds() % this.player.buffer.duration) /
			this.player.buffer.duration
		);
	}

	start(time: Tone.Unit.Time) {
		if (this.player.state === "stopped") {
			return this.player.start(time);
		}
	}

	stop(time: Tone.Unit.Time) {
		this.player.stop(time);
	}

	get loopLength() {
		return this.player.buffer.duration;
	}
}
