export type TokenScore = [string, number];

export type IIntersectTokenScores = (options: { data: TokenScore[][] }) => { data: TokenScore[] };
