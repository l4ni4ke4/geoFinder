import {useState, useEffect} from "react";
import { db } from "../firebase";

export default function useGameHistory({userId}){
    const [isFetching,setIsFetching] = useState(true);
    const [userGameHistory, setUserGameHistory] = useState([]);

    useEffect(()=>{
        const unsubscribe = db.collection("users")
        .doc(`${userId}`)
        .collection("gameHistory")
        .onSnapshot((querySnapshot) => {
            let userGames = [];
            querySnapshot.forEach((gameHistoryDoc)=>{
                userGames.push({...gameHistoryDoc.data(),id: gameHistoryDoc.id});
            })
            setUserGameHistory(userGames);
            if (isFetching) setIsFetching(false)
          })
          return () => {
              setUserGameHistory([])
              unsubscribe()
          }
    }, [userId, isFetching])

    return {isFetching, userGameHistory}
}