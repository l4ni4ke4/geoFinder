import {useState, useEffect} from "react";
import { db } from "../firebase";

export default function useGameUser({lobbyId,userId}){
    const [isFetchingUser,setIsFetchingUser] = useState(true);
    const [gameUser, setGameUser] = useState();

    useEffect(()=>{
        const unsubscribe = db.collection("lobbies")
        .doc(`${lobbyId}`)
        .collection("gameUsers")
        .doc(userId)
        .onSnapshot((doc) => {
            if (doc.exists) setGameUser({ ...doc.data(), id: doc.id })
            else console.log('User Not Found in Lobby')
            if (isFetchingUser) setIsFetchingUser(false)
          })
          return () => {
              unsubscribe()
          }
    }, [userId, isFetchingUser])

    return {isFetchingUser, gameUser}
}