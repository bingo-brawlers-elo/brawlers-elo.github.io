import {useEffect, useState} from "react";
import {loadData, Match} from "../utils/load-data.ts";
import * as RT from 'runtypes';

const Cache = RT.Record({
    data: RT.Array(Match),
    ttl: RT.Number,
    updated: RT.Number
})

const verifyCache = (cacheData: string) => {
    try {
        return Cache.check(JSON.parse(cacheData))
    } catch {
        return undefined
    }
}

const withLocalStorageCache = (ttl: number) => {
    const cacheKey = 'bingo-brawlers-elo-data';
    return {
        set: (data: Match[]) => {
            window.localStorage.setItem(cacheKey, JSON.stringify({data, ttl, updated: Date.now()}))
        },
        get: () => {
            const maybeData = window.localStorage.getItem(cacheKey);
            if(!maybeData) return undefined;
            const maybeCacheData = verifyCache(maybeData);
            if(!maybeCacheData) return undefined;

            const {data, ttl, updated} = maybeCacheData;
            if(Date.now() > updated+ttl) return undefined;

            return data;
        }
    }
}

export const useCsvData = () => {
    const dataCache = withLocalStorageCache(300_000);
    const [data, setData] = useState<Match[]>([])

    useEffect(() => {
        const cachedData = dataCache.get();
        if(cachedData){
            setData(cachedData);
        } else {
            loadData().then((data) => {
                dataCache.set(data);
                setData(data)
            });
        }
    }, []);

    return data;
}