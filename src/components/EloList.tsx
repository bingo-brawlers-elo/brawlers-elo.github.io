import {Match} from "../utils/load-data.ts";
import {eloFromData} from "../utils/elo-calculator.ts";


export const EloList = ({data}: {data: Match[]}) => {
    const eloMap = eloFromData(data);
    const sorted = Object.entries(eloMap).sort(([,eloA], [,eloB]) => eloB-eloA);
    return (
        <>
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