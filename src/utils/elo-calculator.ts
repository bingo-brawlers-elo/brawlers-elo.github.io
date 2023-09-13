import {Match} from "./load-data";

const DEFAULT_ELO = 1000;
const K_FACTOR = 23;

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
    const change = Math.round(K_FACTOR* (outcome-expectation));

    return lastScore+change;
}

const elosFromMatch = (playerOneElo: number, playerTwoElo: number, winner: 0|1|2) => {
    const p1Expectation = computeEloExpectationForPlayer(playerOneElo, playerTwoElo);
    const p2Expectation = computeEloExpectationForPlayer(playerTwoElo, playerOneElo);

    const nextPlayerOneElo = computeEloForPlayer(playerOneElo, coeficientFromOutcome(winner, 1), p1Expectation);
    const nextPlayerTwoElo = computeEloForPlayer(playerTwoElo, coeficientFromOutcome(winner, 2), p2Expectation);

    return {
        playerOne: nextPlayerOneElo,
        playerTwo: nextPlayerTwoElo
    }
}

export const eloFromData = (matches: Match[]): Record<string, number> => matches.reduce(
    (acc, match) => {
        const {playerOne, playerTwo} = elosFromMatch( acc[match.player_1] || DEFAULT_ELO, acc[match.player_2] || DEFAULT_ELO, match.winner)

        acc[match.player_1] = playerOne;
        acc[match.player_2] = playerTwo;

        return acc;
    },
    {} as Record<string, number>
);

export const eloHistoryFromData = (matches: Match[]) => {
    const eloCollection: Record<string, number> = {};

    return matches.map((match) => {
        const playerOneLastElo = eloCollection[match.player_1] || DEFAULT_ELO;
        const playerTwoLastElo = eloCollection[match.player_2] || DEFAULT_ELO;
        const {playerOne, playerTwo} = elosFromMatch(playerOneLastElo, playerTwoLastElo, match.winner);
        eloCollection[match.player_1] = playerOne;
        eloCollection[match.player_2] = playerTwo;

        return {
            ...match,
            winner: match.winner === 1 ? match.player_1 : match.winner === 2 ? match.player_2 : "-",
            playerOneElo: `${playerOne} (${(playerOne-playerOneLastElo) > 0 ? '+' : ''}${playerOne-playerOneLastElo})`,
            playerTwoElo: `${playerTwo} (${(playerTwo-playerTwoLastElo) > 0 ? '+' : ''}${playerTwo-playerTwoLastElo})`
        }
    });
}