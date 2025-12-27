import * as Tone from "tone";

const base = import.meta.env.BASE_URL.endsWith("/")
	? import.meta.env.BASE_URL
	: import.meta.env.BASE_URL + "/";

type LayerOptions = {
	name: string;
	variants?: string[];
};

export class Layer {
	private players: Record<string, Tone.Player> = {};
	private _gain: Tone.Gain;
	public name: string;
	public variants: string[];
	public currentVariant: string;

	static output = new Tone.Limiter(-12).toDestination();

	constructor({ name, variants = ["a"] }: LayerOptions) {
		this.name = name;
		this.variants = variants;
		this.currentVariant = variants[0];

		this._gain = new Tone.Gain({
			gain: 0,
			units: "gain",
			convert: true,
		}).connect(Layer.output);

		for (const variant of variants) {
			this.players[variant] = new Tone.Player({
				loop: true,
				autostart: false,
			})
				.sync()
				.connect(this._gain);
		}
	}

	buildUrl(variant: string) {
		return base + `${this.name}/${variant}.opus`;
	}

	async load() {
		return Promise.all(
			this.variants.map((variant) =>
				this.players[variant].load(this.buildUrl(variant)),
			),
		);
	}

	get loaded() {
		return this.players.loaded;
	}

	get gain() {
		return this._gain.gain;
	}

	start(time: Tone.Unit.Time) {
		return this.players[this.currentVariant].start(time);
	}

	stop(time: Tone.Unit.Time) {
		for (const player of Object.values(this.players.stop)) {
			player.stop(time);
		}
	}

	get loopLength() {
		return this.players[this.currentVariant].buffer.duration;
	}
}
