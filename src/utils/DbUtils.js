import { db } from "../firebase";
// RounStart or RoundPlay etc.
export async function setGameState({lobbyId,gameState}){
    try{
        await db.collection("lobbies").doc(lobbyId).update({
            gameState: gameState
        })
    }catch(error){
        console.error("Db error at updating game state");
    }
}

export async function setTrueLocations({lobbyId,fetchedLocations}){
    try{
      await db.collection("lobbies").doc(lobbyId).update({
            trueLocations: fetchedLocations
        })
    }catch(error){
        console.error(error);
    }

}

export async function toggleIsClickedGuess({lobbyId,userId}){
    try{
        const queryGetIsClickedGuess = await db.collection("lobbies").doc(lobbyId).collection("gameUsers").doc(userId);
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
        await db.collection("lobbies").doc(lobbyId).collection("gameUsers").doc(userId).update({
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
        await db.collection("lobbies").doc(lobbyId).update({
            currentRound: null,
            isGameStarted: false,
            gameState: "",
            trueLocations: []
        });
        
        const query = db.collection("lobbies").doc(lobbyId).collection("gameUsers");
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




