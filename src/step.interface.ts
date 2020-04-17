export interface Step {
    position: [number, number],
    excludedNumbers: Set<number>,
    board: number[][];
}
