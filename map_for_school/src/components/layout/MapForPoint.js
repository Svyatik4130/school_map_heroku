import React, { useState, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { VectorMap } from '@south-paw/react-vector-maps'
import world from '../../world.json'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'


import ErrorNotice from '../layout/misc/ErrorNotice'

export default function MapForPoint() {
    const [x, setx] = useState()
    const [y, sety] = useState()
    const [prctgCoords, setprctgCoords] = useState({ x: 0, y: 0 })
    const history = useHistory()
    const [error, setError] = useState()
    const [isDrag, setisDrag] = useState(false)
    const [notes, setnotes] = useState([[0, 0]])
    const [pointCoords, setpointCoords] = useState()
    const userData = useSelector(state => state.userData)
    const [textareaValue, settextareaValue] = useState("")
    const [visability, setvisability] = useState({ "display": "none" })
    const [show, setShow] = useState(true);
    const [showSuccesss, setshowSuccesss] = useState(false);
    const [AdditionalTextForMobileDevices, setAdditionalTextForMobileDevices] = useState()

    const handleClose = () => setShow(false);

    const handleCloseSuccess = () => setshowSuccesss(false)
    const handleShowSuccess = () => setshowSuccesss(true)

    useEffect(() => {
        if (!userData.user) {
            history.push("/")
        }

        if (window.innerWidth < 1000) {
            setAdditionalTextForMobileDevices(<>
                <br />
                <br />
                <p><strong>📱!If you are on mobile device, you have to tap twice to make action happen!📱</strong></p>
            </>)
        }
    }, [])

    const getCords = (e) => {
        const elem = document.getElementsByClassName("svgmap")[0]
        const wdthOnePercent = elem.offsetWidth / 100
        const wdthPercntg = e.nativeEvent.offsetX / wdthOnePercent

        const hgthOnePercent = elem.offsetHeight / 100
        const hgthPercntg = e.nativeEvent.offsetY / hgthOnePercent

        // переместить eвент в онклик

        // console.log(Math.round(wdthPercntg * wdthOnePercent))
        // console.log(Math.round(hgthPercntg * hgthOnePercent))
        // setx(wdthPercntg)
        // sety(hgthPercntg)
        setprctgCoords({ x: wdthPercntg, y: hgthPercntg })
        setx(Math.round(wdthPercntg * wdthOnePercent))
        sety(Math.round(hgthPercntg * hgthOnePercent))
    }

    function dragEnd() {
        setTimeout(() => {
            setisDrag(false)
        }, 200);
    }
    function dragStart() {
        setTimeout(() => {
            setisDrag(true)
        }, 200);
    }

    const onClick = () => {
        if (!isDrag) {
            setpointCoords(prctgCoords)
            setnotes([[x, y]])
            setvisability({ "display": "block" })
        }
    }

    const handleTextareaChange = (event) => {
        settextareaValue(event.target.value)
    }

    const submit = async () => {
        try {
            let token = localStorage.getItem("auth-token")
            const newPoint = { pointCoords, userEmail: userData.user.email, userId: userData.user.id, textareaValue }
            const newPointReq = await axios.post("points/add", newPoint, { headers: { "x-auth-token": token } })

            console.log(newPointReq)
            if (newPointReq.statusText === "OK") {
                handleShowSuccess()
                settextareaValue("")
                setvisability({ "display": "none" })
                setnotes([[0, 0]])
            }
        } catch (err) {
            console.log(err.response.data.msg)
            err.response.data.msg && setError(err.response.data.msg)
        }
    }


    return (
        <div className="make-point-div">
            <div style={visability} className="addnote-div">
                <div className="title-and-cross">
                    <h6>Some words about this place on coords: <p>x: {notes[0][0]}; y: {notes[0][1]}</p></h6>
                    <button onClick={() => { setnotes([[0, 0]]); setvisability({ "display": "none" }); }} className="close-btn">&times;</button>
                </div>
                {error && <ErrorNotice message={error} clearError={() => { setError(undefined) }} />}
                <textarea value={textareaValue} onChange={handleTextareaChange} placeholder="Type here..."></textarea>
                <button className="submit-btn" onClick={() => submit()}>Submit</button>
            </div>

            <Modal show={show} onHide={() => { handleClose() }} centered>
                <div className="modal-set-locations">
                    <Modal.Header closeButton>
                        <Modal.Title>Hint about creating a dot</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Here you can create your own dot with some extra notes on this map. Just click or tap anywhere and in appeared window type your unique note!
                    {AdditionalTextForMobileDevices}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { history.push("/seepoints"); handleClose() }}>
                            I want to see others' dots!!!
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
            <Modal show={showSuccesss} onHide={() => { handleCloseSuccess() }} centered>
                <div className="modal-set-locations">
                    <Modal.Header closeButton>
                        <Modal.Title>Thank you!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You have sucessfully created your own dot, now you can show it to your friends!😋</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { handleCloseSuccess() }}>
                            See my and others' dots!
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            <TransformWrapper
                wheel={{ step: 40 }}
                onPanningStart={() => dragStart()}
                onPanningStop={() => dragEnd()}
                options={{ maxScale: 50, centerContent: false }}
                pan={{ paddingSize: 100 }}
                doubleClick={{ disabled: true }}
            >
                <TransformComponent>
                    <div className="inner-div" onClick={() => onClick()}>
                        <div className="notes">
                            {notes.map(cords => {
                                return (
                                    <div style={{ "top": `${cords[1] - 4}px`, "left": `${cords[0] - 4}px` }} className="oneNote" ></div>
                                )
                            })}
                        </div>
                        <div className="svgmap">
                            <VectorMap className="map-for-point" onMouseMove={getCords} {...world} style={{ width: "100%" }} />
                        </div>
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}
