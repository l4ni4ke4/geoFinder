import { db } from "../firebase";
// RounStart or RoundPlay etc.
export async function setGameState({lobbyId,gameState}){
    try{
        await db.collection("lobbies").doc(`${lobbyId}`).update({
            gameState: gameState
        })
    }catch(error){
        console.error("Db error at updating game state");
    }
}

export async function setTrueLocations({lobbyId,fetchedLocations}){
    try{
      await db.collection("lobbies").doc(`${lobbyId}`).update({
            trueLocations: fetchedLocations
        })
    }catch(error){
        console.error(error);
    }

}

export async function toggleIsClickedGuess({lobbyId,userId}){
    try{
        const queryGetIsClickedGuess = await db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers").doc(userId);
        queryGetIsClickedGuess.get().then((doc)=>{
            if(doc.exists){
                return doc.ref.update({ isClickedGuess: !doc.data().isClickedGuess });
            }
            else{
                throw new Error("Db error user id not found")
            }
        })
    }catch(error){
        console.error("Db error at updating isClickedGuess field");
    }
}

export async function makeIsClickedGuessFalse({lobbyId,userId}){
    try{
        await db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers").doc(userId).update({
            isClickedGuess: false
        });
        
    }catch(error){
        console.error("Db error at updating isClickedGuess field");
    }
}

export async function resetLobby({lobbyId}){
    // change gameState to ""
    // change currentRound to ""
    // change isGameStarted to false
    // change each users distances,guessedLocations,scores,totalScore
    try{
        await db.collection("lobbies").doc(`${lobbyId}`).update({
            currentRound: null,
            isGameStarted: false,
            gameState: "Lobby",
            trueLocations: []
        });
        
        const query = db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers");
        query.get().then((querySnapshot)=>{
            querySnapshot.forEach((docUser)=>{
                docUser.ref.update({
                    guessedLocations:[],
                    distances:[],
                    scores:[],
                    isClickedGuess:false,
                    totalScore: 0                   
                })
            })
        })
    }catch(error){
        console.error("Error resetting the lobby");
    }
}


export async function exitLobbyDb({lobbyId,userId,isHost}){
    console.log(isHost);
    if(isHost){
        console.log("1");
        //delete user
        try{
            await db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers").doc(userId).delete()
        }catch(error){
            console.error("Db error at deleting user from lobby")
        }
        console.log("2");
        //select another user to make him host
        try{
            const nextHostSnapshot = await db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers").limit(1).get();
            if(!nextHostSnapshot.isEmpty){
                console.log("3");
                const nextHost = nextHostSnapshot.docs[0];
                nextHost.ref.update({
                    isHost: true
                })
            }
            else{
                 //no one left in the lobby do something here...
            }
        }catch(error){
            console.error("Db error at making someone else host")
        }
    }
    else{
        console.log("4");
        //delete user
        try{
            await db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers").doc(userId).delete()
        }catch(error){
            console.error("Db error at deleting user from lobby")
        }
    }
}




