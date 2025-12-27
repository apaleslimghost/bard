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
			new Layer("foley"),
			new Layer("clarinet"),
			new Layer("bansuri"),
			new Layer("ethereal"),
		],
	},
	{
		position: [1, 0],
		location: "wilderness",
		layers: [
			new Layer("wood"),
			new Layer("hats"),
			new Layer("clarinet2"),
			new Layer("bansuri"),
			new Layer("cello"),
			new Layer("pads"),
			new Layer("poly"),
		],
	},
	{
		position: [0, 1],
		location: "wilderness",
		layers: [
			new Layer("piano-foley"),
			new Layer("string-chords"),
			new Layer("bells"),
			new Layer("apprehensive"),
			new Layer("cyclical"),
		],
	},
	{
		position: [1, 1],
		location: "wilderness",
		layers: [
			new Layer("piano-foley"),
			new Layer("amen"),
			new Layer("string-chords"),
			new Layer("bonks"),
			new Layer("apprehensive"),
			new Layer("cyclical2"),
			new Layer("impending"),
		],
	},
	{
		position: [0, 0],
		location: "dungeon",
		layers: [
			new Layer("discord"),
			new Layer("gloaming"),
			new Layer("trepidation"),
		],
	},
	{
		position: [1, 0],
		location: "dungeon",
		layers: [
			new Layer("foley"),
			new Layer("discord"),
			new Layer("gloaming"),
			new Layer("trepidation"),
			new Layer("pulse"),
			new Layer("tension"),
		],
	},
	{
		position: [0, 1],
		location: "dungeon",
		layers: [
			new Layer("cello-foley"),
			new Layer("bonks"),
			new Layer("bells"),
			new Layer("spooky"),
			new Layer("metallic"),
		],
	},
	{
		position: [1, 1],
		location: "dungeon",
		layers: [
			new Layer("foley"),
			new Layer("cello-foley"),
			new Layer("barrels"),
			new Layer("spooky"),
			new Layer("metallic"),
			new Layer("pulse2"),
		],
	},
] satisfies Scene[];

export default scenes;
