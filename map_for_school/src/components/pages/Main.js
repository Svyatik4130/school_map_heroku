import React, { useState, useEffect } from 'react'
import Loader from 'react-loader-spinner'
import { Container, Row, Col } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom"

import Map from '../layout/Map'

export default function Main() {
    const [modalShowed, setmodalShowed] = useState(false)
    const [AdditionalTextForMobileDevices, setAdditionalTextForMobileDevices] = useState()

    let isMainModalShowed = localStorage.getItem("isMainModalShowed");
    console.log( typeof( Number(isMainModalShowed) ),  (Number(isMainModalShowed) > 2) || (isMainModalShowed !== null))
    const handleClose = () => {
        setmodalShowed(true)
        localStorage.setItem("isMainModalShowed", (isMainModalShowed == null) ? (0) : ((typeof(Number(isMainModalShowed)) === "number") ? (Number(isMainModalShowed) + 1) : (0)));
    }

    useEffect(() => {   
        if(isMainModalShowed !== null){
            if(typeof(Number(isMainModalShowed)) === "number"){
                if(Number(isMainModalShowed) >= 2){
                    setmodalShowed(true)
                }
            } else {
                setmodalShowed(true)
            }
        }

        if (window.innerWidth < 1000) {
            setAdditionalTextForMobileDevices(<>
                <br />
                <p style={{"color": "#f0ad4e"}} ><strong>📱!If you are on mobile device, you have to tap twice to select the country!📱</strong></p>
            </>)
        }
    }, [])
    return (
        <>
            <Modal show={!modalShowed} onHide={() => { handleClose() }} centered>
                <div className="modal-set-locations">
                    <Modal.Header closeButton>
                        <Modal.Title><h4 className="mainModal-notice">Warning!</h4></Modal.Title>
                    </Modal.Header>
                    <Modal.Body> <p>This is portfolio, interactive, NodeJS and ReactJS, world map</p> {AdditionalTextForMobileDevices}</Modal.Body>
                </div>
            </Modal>
            {/* map and info */}
            <Container fluid>
                <Row>
                    <Col className="colMap">
                        <Map />
                    </Col>
                    <Col md={3} id="fullInfo">
                        <Row>
                            <h2 id="titleOfInfo" >*Please select any country*</h2>
                        </Row>
                        <Row>
                            <Col>
                                <div className="authIMG">
                                    <img id='flagImage' style={{ width: '100%' }} src={require('../../images/state.png')} alt="flag" />
                                </div>
                            </Col>
                            <Col>
                                <div className="timediv">
                                    <p id="time"></p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <div id="outer-desc-div" className="descDIV">
                                <p id="description"></p>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
