import * as Tone from "tone";
import { Layer } from "./layer";
import scenes, { Scene, Pos } from "./scenes";

const chebyshev = (p1: Pos, p2: Pos) =>
	Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1]));

export class Loop {
	static build(initial: boolean, position: Pos, location: string) {
		for (const scene of scenes) {
			const gain =
				scene.location === location
					? Math.sin(
							((1 -
								Math.max(
									0,
									Math.min(1, chebyshev(scene.position, position)),
								)) *
								Math.PI) /
								2,
						)
					: 0;

			for (const layer of scene.layers) {
				if (gain > 0.01) {
					layer.start("@1m");
				} else {
					layer.stop(Tone.Time("@1m").toSeconds() + layer.loopLength);
				}

				if (initial) {
					layer.gain.value = gain;
				} else {
					layer.gain.rampTo(gain, layer.loopLength, "@1m");
				}
			}
		}
	}
}
