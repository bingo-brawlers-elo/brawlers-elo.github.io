import {loadData} from "./load-data";
import {eloFromData} from "./elo-calculator";

const main = async () => {
    const dataset = await loadData();
    const eloMap = eloFromData(dataset);

    console.log(JSON.stringify(Object.entries(eloMap).sort(([_, eloA], [__, eloB]) => eloB-eloA), null, 2));
}

main().catch((e) => {
    console.log(e);
    throw e;
})