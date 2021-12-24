import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { exitLobbyDb } from '../utils/DbUtils'

const ExitPopup = ({showExitModal,setShowExitModal,lobbyId,userId,isHost}) => {

    const history = useHistory();

    const handleModalExitBtn = ()=>{
        exitLobbyDb({lobbyId,userId,isHost});
        history.push("/");
    }

    return (
        <Modal show = {showExitModal} onHide = {()=>setShowExitModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Exit Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to leave?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleModalExitBtn}>Exit</Button>
                </Modal.Footer>
        </Modal>
       
    )
}

export default ExitPopup
