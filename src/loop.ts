import * as Tone from "tone";
import { Layer } from "./layer";
import scenes, { Scene, Pos } from "./scenes";
import sortBy from "lodash/sortBy";
import popcount from "@f/popcount";

const chebyshev = (p1: Pos, p2: Pos) =>
	Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1]));

const increasingWeight = (b: number) =>
	sortBy(
		Array.from({ length: Math.pow(2, b) }, (_, i) => i),
		popcount,
	).map((n) => Array.from(n.toString(2).padStart(b, "0"), (c) => c === "1"));

/* TODO
- schedule all loops to end at same time then play tails/fade out (1 bar)
- chop up the long loops (discord, bansuri etc) into variants
- actually implement switching between combinations of layer variants in a loop
- some concept of which loops are more important for a scene (weird to be super close to a combat scene and not be playing any drums)
- implement density variants for layers to fade between(?) on approach
- allow some layers to crossfade between scenes
*/

export class Loop {
	static current?: Loop;

	static build(position: Pos, location: string) {
		const layers = scenes.flatMap((scene) => {
			const amount =
				scene.location === location
					? 1 -
						Math.max(0, Math.min(1, chebyshev(scene.position, position)))
					: 0;

			const layerMap = increasingWeight(scene.layers.length);
			const whichLayers =
				layerMap[Math.floor(amount * (layerMap.length - 1))];

			const layers = scene.layers.filter(
				(layer, index) => whichLayers[index],
			);
			return layers;
		});

		Loop.current?.stop();
		Loop.current = new Loop(layers).start();
	}

	constructor(public layers: Layer[]) {}

	start() {
		for (const layer of this.layers) {
			layer.start("@1m");
		}

		return this;
	}

	stop() {
		for (const layer of this.layers) {
			layer.stop("@1m");
		}
	}
}
