import {Match} from "./load-data";

const DEFAULT_ELO = 1_500;
const K_FACTOR = 40;

const coeficientFromOutcome = (outcome: 0|1|2, playerNumber: 1|2) => {
    switch(outcome){
        case 1: return playerNumber === 1 ? 1 : 0;
        case 2: return playerNumber === 2 ? 1 : 0;
        case 0: return 0.5
    }
}

const computeEloExpectationForPlayer = (eloA: number, eloB: number) => {
    const difference = eloB-eloA;
    const scaled = difference / 400;
    const power = Math.pow(10, scaled) + 1;

    return 1/power;
}

const computeEloForPlayer = (lastScore: number, outcome: number, expectation: number) => {
    const change = K_FACTOR* (outcome-expectation);

    return lastScore+change;
}

export const eloFromData = (matches: Match[]): Record<string, number> => matches.reduce(
    (acc, match) => {
        const player_1_last_elo = acc[match.player_1] || DEFAULT_ELO;
        const player_2_last_elo = acc[match.player_2] || DEFAULT_ELO;
        const p1_expectation = computeEloExpectationForPlayer(player_1_last_elo, player_2_last_elo);
        const p2_expectation = computeEloExpectationForPlayer(player_2_last_elo, player_1_last_elo);

        acc[match.player_1] = computeEloForPlayer(player_1_last_elo, coeficientFromOutcome(match.winner, 1), p1_expectation);
        acc[match.player_2] = computeEloForPlayer(player_2_last_elo, coeficientFromOutcome(match.winner, 2), p2_expectation);

        return acc;
    },
    {} as Record<string, number>
);