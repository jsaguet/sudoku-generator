import {fillBoard, printBoard} from './sudoku.utils';


function findSudoku(): void {
    const startDate = Date.now();
    const finalBoard = fillBoard();
    const endDate = Date.now();

    console.log(`Grid found in ${endDate - startDate}ms`);
    printBoard(finalBoard);
}

findSudoku();
