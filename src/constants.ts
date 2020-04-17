import {Step} from './step.interface';

export const initialGrid = (new Array<number>(9)).fill(0).map(() => Array<number>(9).fill(0));

export const firstStep: Step = {addedNumber: 0, excludedNumbers: new Set<number>(), board: initialGrid};
