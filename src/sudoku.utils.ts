import {boardLength, firstStep} from './constants';
import {copyBoard, copySet} from './copy.utils';
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
    if (excludedList.size === boardLength) {
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
    if (lastStep.excludedNumbers.size === boardLength) {
        return removeSteps(steps);
    }
    return lastStep;
}

export function fillBoard(
    {excludedNumbers, board, position}: Step = firstStep,
    steps: Map<number, Step> = new Map<number, Step>()
): number[][] {
    const [previousLine, previousColumn] = position;

    const column = (previousColumn + 1) % boardLength;
    const line = column === 0 ? previousLine + 1 : previousLine;

    const number = pickANumber(copyBoard(board), [line, column], copySet(excludedNumbers));
    if (number === -1) {
        const newStep = removeSteps(steps);
        return fillBoard(newStep, steps);
    }
    board[line][column] = number;

    if (line === boardLength - 1 && column === boardLength - 1) {
        return board; // Board is filled
    }

    const lastStep = steps.get(steps.size);
    if (lastStep) {
        lastStep.excludedNumbers.add(number);
    }
    steps.set(steps.size + 1, {
        position: [line, column],
        excludedNumbers: new Set(),
        board: copyBoard(board)
    });

    return fillBoard(steps.get(steps.size), steps);
}
