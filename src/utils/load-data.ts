import * as RT from "runtypes";
import csvToJson from "csvtojson";

export const Match = RT.Record({
    "player_1": RT.String,
    "player_2": RT.String,
    "winner": RT.Union(RT.Literal(1), RT.Literal(2), RT.Literal(0)),
    practice_match: RT.Boolean,
    vod_link: RT.Union(RT.String, RT.Undefined)
});

const Matches = RT.Array(Match);

export type Match = RT.Static<typeof Match>;

const SHEET_ID = "12mc-zRMfN1GbnATjUiZJ_BN8M7V1E2kHiHn0EMHvrCQ";
const SHEET_NAME = "Matches";

const normalize = (match: Match): Match => {
    match.player_1 = match.player_1.toLowerCase();
    match.player_2 = match.player_2.toLowerCase();

    return match;
}

const isOk = (res: Response) => {
    if(!res.ok && res.status <= 200 && res.status >= 400){
        throw new Error(`Failed to fetch sheet`)
    }

    return res
}

const data = (res: Response) => {
    return res.text()
}

const loadDataFromSheets = async () => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
    return fetch(url)
        .then(isOk)
        .then(data)
}

export const loadData = async () => {
    const csvData = await loadDataFromSheets();
    const data = await csvToJson({colParser: {winner: "number", practice_match:(item) => item === "TRUE"}}).fromString(csvData);
    return Matches.check(data).map(normalize);
}