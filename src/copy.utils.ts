export function copyBoard(board: number[][]): number[][] {
    return board.map(line => line.slice());
}

export function copySet(set: Set<number>): Set<number> {
    const newSet = new Set<number>();
    set.forEach(val => newSet.add(val));
    return set;
}
