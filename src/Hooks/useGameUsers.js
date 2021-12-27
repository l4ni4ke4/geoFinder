import {useState, useEffect} from "react";
import { db } from "../firebase";

export default function useGameUsers({lobbyId}){
    const [isFetchingUsers,setIsFetchingUsers] = useState(true);
    const [gameUsers, setGameUsers] = useState([]);

    useEffect(()=>{
        const unsubscribe = db.collection("lobbies")
        .doc(`${lobbyId}`)
        .collection("gameUsers")
        .onSnapshot((querySnapshot) => {
            let gameUsersList = [];
            querySnapshot.forEach((userDoc)=>{
                gameUsersList.push({...userDoc.data(),id: userDoc.id});
                // console.log(userDoc.data())
            })
            setGameUsers(gameUsersList);
            if (isFetchingUsers) setIsFetchingUsers(false)
          })
          return () => {
              setGameUsers([])
              unsubscribe()
          }
    }, [isFetchingUsers,lobbyId])

    return {isFetchingUsers, gameUsers}
}