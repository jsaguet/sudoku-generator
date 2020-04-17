import {Step} from './step.interface';

export const boardLength = 9;

export const initialGrid = (new Array<number>(boardLength)).fill(0).map(() => Array<number>(boardLength).fill(0));

export const firstStep: Step = {position: [-1, -1], excludedNumbers: new Set<number>(), board: initialGrid};
