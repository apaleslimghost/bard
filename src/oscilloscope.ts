import * as Tone from "tone";

export class Oscilloscope {
	static FFT = 4096;

	private anl: AnalyserNode;
	private data: Uint8Array<ArrayBuffer>;
	protected src: Tone.ToneAudioNode;
	protected canvas: HTMLCanvasElement;
	protected cctx: CanvasRenderingContext2D;

	constructor(src: Tone.ToneAudioNode, canvas: HTMLCanvasElement) {
		this.src = src;
		this.canvas = canvas;

		this.cctx = this.canvas.getContext("2d")!;
		this.cctx.strokeStyle = "cyan";
		this.cctx.lineWidth = devicePixelRatio * 2;

		this.anl = Tone.getContext().createAnalyser();
		this.anl.fftSize = 4096;
		this.src.connect(this.anl);
		this.data = new Uint8Array(this.anl.fftSize);
	}

	clear() {
		this.cctx.fillStyle = "white";
	}

	run() {
		requestAnimationFrame(() => this.run());
		this.draw();
	}

	draw() {
		this.anl.getByteTimeDomainData(this.data);
		this.cctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.cctx.beginPath();
		for (let i = 0; i < this.data.length; i++) {
			const x = i * ((this.canvas.width * 2) / this.data.length);
			const v = this.data[i] / 128.0;
			const y = this.canvas.height - (v * this.canvas.height) / 2;
			if (i === 0) this.cctx.moveTo(x, y);
			else this.cctx.lineTo(x, y);
		}
		this.cctx.stroke();
	}
}
