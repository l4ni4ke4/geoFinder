import {useState, useEffect} from "react";
import { db } from "../firebase";

export default function useLobby(lobbyId){
    const [isFetchingLobby,setIsFetchingLobby] = useState(true);
    const [lobby, setLobby] = useState();

    useEffect(()=>{
        const unsubscribe = db.collection("lobbies")
        .doc(`${lobbyId}`)
        .onSnapshot((doc) => {
            if (doc.exists) setLobby({ ...doc.data(), id: doc.id })
            else console.log('Lobby Not Found')
            if (isFetchingLobby) setIsFetchingLobby(false)
          })
          return () => {
              unsubscribe()
          }
    }, [lobbyId, isFetchingLobby])

    return {isFetchingLobby, lobby}
}