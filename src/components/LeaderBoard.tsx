import {Match} from "../utils/load-data.ts";

export const LeaderBoard = ({data}: {data: Match[]}) => {

    const leaderList = Object.entries(data
        .filter(({practice_match}) => !practice_match)
        .reduce(
        (leaderList, match) => {
            leaderList[match.player_1] = leaderList[match.player_1] || 0;
            leaderList[match.player_2] = leaderList[match.player_2] || 0;

            switch (match.winner) {
                case 0: {
                    leaderList[match.player_1] += 0.5
                    leaderList[match.player_2] += 0.5
                    break;
                }
                case 1: {
                    leaderList[match.player_1] += 1;
                    break
                }
                case 2: {
                    leaderList[match.player_2] += 1;
                }

            }


            return leaderList
        },
        {} as Record<string, number>
    )).sort(([, matchesWonA], [, matchesWonB]) => matchesWonB-matchesWonA);

    return <>
        <h2>Season 2 Leaderboard</h2>
        <table className={'leader-board'}>
            <thead>
                <tr>
                    <th className={'playerName'}></th>
                    <th className={'gamesWon'}></th>
                </tr>
            </thead>
            <tbody>
            {leaderList.map(([playerName, gamesWon]) => <tr>
                <td>{playerName}</td>
                <td>{gamesWon}</td>
            </tr>)}
            </tbody>
        </table>
    </>
}