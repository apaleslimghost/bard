import * as Tone from "tone";

const base = import.meta.env.BASE_URL.endsWith("/")
	? import.meta.env.BASE_URL
	: import.meta.env.BASE_URL + "/";

type LayerOptions = {
	name: string;
	variants?: string[];
	tail?: boolean;
};

export class Layer {
	private players: Record<string, Tone.Player> = {};
	public _gain: Tone.Gain;
	public name: string;
	public variants: string[];
	public currentVariant: string;
	private tail: boolean;
	private tailPlayer?: Tone.Player;

	static output = new Tone.Limiter(-12).toDestination();

	constructor({ name, variants = ["a"], tail = true }: LayerOptions) {
		this.name = name;
		this.variants = variants;
		this.currentVariant = variants[0];
		this.tail = tail;

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

		if (tail) {
			this.tailPlayer = new Tone.Player({
				autostart: false,
			}).connect(this._gain);
		}
	}

	buildUrl(variant: string) {
		return base + `${this.name}/${variant}.opus`;
	}

	async load() {
		return Promise.all([
			...this.variants.map((variant) =>
				this.players[variant].load(this.buildUrl(variant)),
			),
			this.tailPlayer?.load(this.buildUrl("tail")),
		]);
	}

	get loaded() {
		return this.players.loaded;
	}

	get gain() {
		return this._gain.gain;
	}

	start() {
		if (this.players[this.currentVariant].state === "started") return;
		const start = Tone.TransportTime("@4m");
		const fadeIn = Tone.Time("4m").toSeconds();

		this.tailPlayer?.stop(start.toSeconds());
		this.players[this.currentVariant].loop = true;
		console.log(
			"starting",
			this.name,
			"at",
			Tone.TransportTime(
				Math.max(0, start.toSeconds() - fadeIn),
			).toBarsBeatsSixteenths(),
			"fading to 1 by",
			start.toBarsBeatsSixteenths(),
		);
		this.players[this.currentVariant].start(
			Math.max(0, start.toSeconds() - fadeIn),
		);
		this.gain.rampTo(1, fadeIn, Math.max(0, start.toSeconds() - fadeIn));
	}

	stop() {
		const end = Tone.TransportTime("@4m");

		console.log("stopping", this.name, "at", end.toBarsBeatsSixteenths());

		for (const player of Object.values(this.players)) {
			player.stop(end.toSeconds());
		}

		if (this.tailPlayer) {
			console.log("playing", this.name, "tail");
			this.tailPlayer.restart(end.toSeconds());
			this.gain.setValueAtTime(
				0,
				end.toSeconds() + this.tailPlayer.buffer.duration,
			);
		} else {
			this.gain.rampTo(0, Math.max(0, end.toSeconds() - this.gain.now()));
		}
	}

	get loopLength() {
		return this.players[this.currentVariant].buffer.duration;
	}

	get state() {
		return this.tailPlayer?.state === "started"
			? "tail"
			: this.players[this.currentVariant].state;
	}
}

export const layers: Record<string, Layer> = Object.fromEntries(
	[
		new Layer({ name: "amen", tail: false }),
		new Layer({ name: "apprehensive" }),
		new Layer({ name: "bansuri" }),
		new Layer({ name: "barrels" }),
		new Layer({ name: "bells", tail: false }),
		new Layer({ name: "bonks", tail: false }),
		new Layer({ name: "cello" }),
		new Layer({ name: "cello-foley" }),
		new Layer({ name: "clarinet" }),
		new Layer({ name: "cyclical" }),
		new Layer({ name: "cyclical2", tail: false }),
		new Layer({ name: "discord" }),
		new Layer({ name: "ethereal" }),
		new Layer({ name: "foley" }),
		new Layer({ name: "gloaming" }),
		new Layer({ name: "hats", tail: false }),
		new Layer({ name: "impending" }),
		new Layer({ name: "metallic", tail: false }),
		new Layer({ name: "pads" }),
		new Layer({ name: "piano-foley" }),
		new Layer({ name: "poly", tail: false }),
		new Layer({ name: "pulse" }),
		new Layer({ name: "pulse2" }),
		new Layer({ name: "spooky" }),
		new Layer({ name: "string-chords" }),
		new Layer({ name: "tension" }),
		new Layer({ name: "trepidation" }),
		new Layer({ name: "wood" }),
	].map((l) => [l.name, l]),
);
