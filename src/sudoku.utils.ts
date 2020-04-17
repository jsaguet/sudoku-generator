import {firstStep} from './constants';
import {copyBoard, copySet} from './copy-utils';
import {Step} from './step.interface';

export function printBoard(grid: number[][]): void {
    grid.forEach((line: number[], index: number) => {
        console.log(line.join(' | '));
        if ((index + 1) % 3 === 0) {
            console.log('---------------------------------');
        }
    });
}

function getRandomNumber(): number {
    const max = 9;
    const min = 1;
    return Math.trunc(Math.random() * max - min + 1 + min);
}

function pickANumber(board: number[][], [line, column]: [number, number], excludedList: Set<number>): number {
    const number = getRandomNumber();
    if (!excludedList.has(number) && isNumberMatching(copyBoard(board), [line, column], number)) {
        return number;
    }
    excludedList.add(number);
    if (excludedList.size === 9) {
        return -1; // no possible number found
    }
    return pickANumber(copyBoard(board), [line, column], copySet(excludedList));
}

function isNumberMatching(board: Array<Array<number>>, [line, column]: [number, number], number: number): boolean {
    // checking line
    if (board[line].includes(number)) {
        return false;
    }

    // checking column
    for (let line of board) {
        if (line[column] === number) {
            return false;
        }
    }

    // checking square
    const startLine = Math.trunc(line / 3) * 3;
    const startColumn = Math.trunc(column / 3) * 3;
    for (let i = startLine; i < startLine + 3; i++) {
        for (let j = startColumn; j < startColumn + 3; j++) {
            if (board[i][j] === number) {
                return false;
            }
        }
    }
    return true;
}

function removeSteps(steps: Map<number, Step>): Step {
    steps.delete(steps.size);

    const lastStep: Step = steps.get(steps.size);
    if (lastStep.excludedNumbers.size === 9) {
        return removeSteps(steps);
    }
    return lastStep;
}

export function fillBoard(step: Step = firstStep, steps: Map<number, Step> = new Map<number, Step>()): number[][] {
    const {excludedNumbers, board} = step;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== 0) {
                continue;
            }
            const number = pickANumber(copyBoard(board), [i, j], copySet(excludedNumbers));
            if (number === -1) {
                const newStep = removeSteps(steps);
                return fillBoard(newStep, steps);
            }
            const lastStep = steps.get(steps.size);
            if (lastStep) {
                lastStep.excludedNumbers.add(number);
            }
            board[i][j] = number;
            steps.set(steps.size + 1, {addedNumber: number, excludedNumbers: new Set(), board: copyBoard(board)});
            if (i === board.length - 1 && j === board[i].length - 1) {
                return board;
            }
            return fillBoard(steps.get(steps.size), steps);
        }
    }

}
