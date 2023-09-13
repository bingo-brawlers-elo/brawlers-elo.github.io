import {useEffect, useState} from 'react'
import './App.css'
import {loadData, Match} from "./utils/load-data.ts";
import {EloList} from "./components/EloList.tsx";
import {useCsvData} from "./hooks/csv-data-hook.ts";
import {MatchList} from "./components/MatchList.tsx";

function App() {
    const eloData = useCsvData();

  return (
    <>
        <h1>Bingo Brawlers Elo</h1>
        <h2>Rank</h2>
        <EloList data={eloData}/>
        <h2>Season 2 Matches</h2>
        <MatchList data={eloData} type={'competiton'}/>
        <h2>Season 2 Practice Matches</h2>
        <MatchList data={eloData} type={'practice'}/>

    </>
  )
}

export default App
