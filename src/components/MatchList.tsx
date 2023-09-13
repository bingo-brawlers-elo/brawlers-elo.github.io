import {Match} from "../utils/load-data.ts";
import {eloHistoryFromData} from "../utils/elo-calculator.ts";

type MatchListType = "practice" | "competiton"

const boldIfMatch = (content: string, toMatch: string) => content === toMatch ? <span className={'win'}>{content}</span> : <span>{content}</span>
export const MatchList = ({data, type}: {data: Match[], type: MatchListType}) => {
    const matchList = eloHistoryFromData(data).filter(({practice_match}) => (type === "practice" && practice_match === true) || type === "competiton" && practice_match === false)

    return (
        <details>
            <summary>
                Click to Expand
            </summary>
            <table className={'match-list'}>

                <thead>
                <tr>
                    <th className={"p1"}>Player 1</th>
                    <th className={"p1-elo"}></th>
                    <th className={"p2"}>Player 2</th>
                    <th className={"p2-elo"}></th>
                    <th className={"winner"}>Winner</th>
                    <th className={"vod-link"}>VOD Link</th>
                </tr>


                </thead>
                <tbody>
                {
                    matchList.map((match, i) => (
                        <tr key={`${match.player_1}:${match.player_2}:${match.playerOneElo}:${match.playerTwoElo}:${i}`}>
                            <td>{boldIfMatch(match.player_1, match.winner)}</td>
                            <td>{match.playerOneElo}</td>
                            <td>{boldIfMatch(match.player_2, match.winner)}</td>
                            <td>{match.playerTwoElo}</td>
                            <td>{match.winner}</td>
                            <td>{ match.vod_link ? <a href={match.vod_link} target={"_blank"}>VOD</a> : ""}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </details>
    )
}