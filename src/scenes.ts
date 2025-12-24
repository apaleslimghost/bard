/*
TODO
- loop start samples
- loop tail samples
- intro samples
- loop variations
- drum loops start full volume at 0.5 distance instead of fading in
*/

import * as Tone from "tone";
import layers from "./layers";

export type Scene = {
	position: [number, number];
	location: string;
	layers: Tone.Player[];
};

const scenes = [
	{
		position: [0, 0],
		location: "wilderness",
		layers: [
			layers["foley"],
			layers["clarinet"],
			layers["bansuri"],
			layers["ethereal"],
		],
	},
	{
		position: [1, 0],
		location: "wilderness",
		layers: [
			layers["wood"],
			layers["hats"],
			layers["clarinet"],
			layers["bansuri"],
			layers["cello"],
			layers["pads"],
			layers["poly"],
		],
	},
	{
		position: [0, 1],
		location: "wilderness",
		layers: [
			layers["piano-foley"],
			layers["string-chords"],
			layers["bells"],
			layers["apprehensive"],
			layers["cyclical"],
		],
	},
	{
		position: [1, 1],
		location: "wilderness",
		layers: [
			layers["piano-foley"],
			layers["amen"],
			layers["string-chords"],
			layers["bonks"],
			layers["apprehensive"],
			layers["cyclical2"],
			layers["impending"],
		],
	},
	{
		position: [0, 0],
		location: "dungeon",
		layers: [layers["discord"], layers["gloaming"], layers["trepidation"]],
	},
	{
		position: [1, 0],
		location: "dungeon",
		layers: [
			layers["foley"],
			layers["discord"],
			layers["gloaming"],
			layers["trepidation"],
			layers["pulse"],
			layers["tension"],
		],
	},
	{
		position: [0, 1],
		location: "dungeon",
		layers: [
			layers["cello-foley"],
			layers["bonks"],
			layers["bells"],
			layers["spooky"],
			layers["metallic"],
		],
	},
	{
		position: [1, 1],
		location: "dungeon",
		layers: [
			layers["foley"],
			layers["cello-foley"],
			layers["barrels"],
			layers["spooky"],
			layers["metallic"],
			layers["pulse2"],
		],
	},
] satisfies Scene[];

export default scenes;
