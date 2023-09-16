import {Match} from "../utils/load-data.ts";
import {eloFromData} from "../utils/elo-calculator.ts";
import {useState} from "react";

export const EloList = ({data}: {data: Match[]}) => {
    const [includePracticeMatches, setIncludePracticeMatches] = useState(true);
    const eloMap = eloFromData(data, includePracticeMatches);
    const sorted = Object.entries(eloMap).sort(([,eloA], [,eloB]) => eloB-eloA);
    return (
        <>
            <div className={"filter"}>
                <input id={'elo-filter'} type={"checkbox"} checked={includePracticeMatches} onClick={() => setIncludePracticeMatches(!includePracticeMatches)}/>
                <label>Include Practice Matches</label>
            </div>
            <table className={'elo-list'}>

                <thead>
                <tr>
                    <th className={"rank"}>rank</th>
                    <th className={"player"}>player</th>
                    <th className={"elo"}>elo</th>
                </tr>


                </thead>
                <tbody>
                {sorted.map(([playerName, elo], i) => <tr key={`${playerName}:${elo}`} className={'player-row'}>
                    <td>{i+1}</td>
                    <td>{playerName}</td>
                    <td>{elo}</td>
                </tr>)}
                </tbody>
            </table>
        </>
    )
};