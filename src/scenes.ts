/*
TODO
- loop start samples
- loop tail samples
- intro samples
- loop variations
- drum loops start full volume at 0.5 distance instead of fading in
*/

import * as Tone from "tone";
import { Layer } from "./layer";

export type Scene = {
	position: [number, number];
	location: string;
	layers: Layer[];
};

const scenes = [
	{
		position: [0, 0],
		location: "wilderness",
		layers: [
			new Layer({ name: "foley" }),
			new Layer({ name: "clarinet" }),
			new Layer({ name: "bansuri" }),
			new Layer({ name: "ethereal" }),
		],
	},
	{
		position: [1, 0],
		location: "wilderness",
		layers: [
			new Layer({ name: "wood" }),
			new Layer({ name: "hats" }),
			new Layer({ name: "clarinet", variants: ["a", "b"] }),
			new Layer({ name: "bansuri" }),
			new Layer({ name: "cello" }),
			new Layer({ name: "pads" }),
			new Layer({ name: "poly" }),
		],
	},
	{
		position: [0, 1],
		location: "wilderness",
		layers: [
			new Layer({ name: "piano-foley" }),
			new Layer({ name: "string-chords" }),
			new Layer({ name: "bells" }),
			new Layer({ name: "apprehensive" }),
			new Layer({ name: "cyclical" }),
		],
	},
	{
		position: [1, 1],
		location: "wilderness",
		layers: [
			new Layer({ name: "piano-foley" }),
			new Layer({ name: "amen" }),
			new Layer({ name: "string-chords" }),
			new Layer({ name: "bonks" }),
			new Layer({ name: "apprehensive" }),
			new Layer({ name: "cyclical2" }),
			new Layer({ name: "impending" }),
		],
	},
	{
		position: [0, 0],
		location: "dungeon",
		layers: [
			new Layer({ name: "discord" }),
			new Layer({ name: "gloaming" }),
			new Layer({ name: "trepidation" }),
		],
	},
	{
		position: [1, 0],
		location: "dungeon",
		layers: [
			new Layer({ name: "foley" }),
			new Layer({ name: "discord" }),
			new Layer({ name: "gloaming" }),
			new Layer({ name: "trepidation" }),
			new Layer({ name: "pulse" }),
			new Layer({ name: "tension" }),
		],
	},
	{
		position: [0, 1],
		location: "dungeon",
		layers: [
			new Layer({ name: "cello-foley" }),
			new Layer({ name: "bonks" }),
			new Layer({ name: "bells" }),
			new Layer({ name: "spooky" }),
			new Layer({ name: "metallic" }),
		],
	},
	{
		position: [1, 1],
		location: "dungeon",
		layers: [
			new Layer({ name: "foley" }),
			new Layer({ name: "cello-foley" }),
			new Layer({ name: "barrels" }),
			new Layer({ name: "spooky" }),
			new Layer({ name: "metallic" }),
			new Layer({ name: "pulse2" }),
		],
	},
] satisfies Scene[];

export default scenes;
