import { useHistory } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import world from '../../world.json'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import axios from 'axios'
import { VectorMap } from '@south-paw/react-vector-maps'
import { Modal, Button } from 'react-bootstrap'
import { useSelector } from "react-redux"



export default function SeeAllPoints() {
    const history = useHistory()

    const [isDrag, setisDrag] = useState(false)
    const userData = useSelector(state => state.userData)
    const [notes, setnotes] = useState()
    const [htmlNotes, sethtmlNotes] = useState()
    const [visability, setvisability] = useState({ "display": "none" })
    const [Description, setDescription] = useState({ x: 0, y: 0, note: "", email: "" })
    const [show, setShow] = useState(true)
    const [AdditionalTextForMobileDevices, setAdditionalTextForMobileDevices] = useState()
    let [LastClicked, setLastClicked] = useState(null)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        const getPoints = async () => {
            if (!userData.user) {
                return history.push("/")
            }

            const { data } = await axios.get("/points/getpoints")
            // const elem = document.getElementsByClassName("react-transform-component")[0]
            data.map((note) => {
                const elem = document.getElementsByClassName("svgmap")[0]
                const wdthOnePercent = elem.offsetWidth / 100
                note.pointCoords.x = note.pointCoords.x * wdthOnePercent

                const hgthOnePercent = elem.offsetHeight / 100
                note.pointCoords.y = note.pointCoords.y * hgthOnePercent
            })
            console.log(data)
            setnotes(data)

            if (window.innerWidth < 1000) {
                setAdditionalTextForMobileDevices(<>
                    <br />
                    <br />
                    <p><strong>📱!If you are on mobile device, you have to tap twice to make action happen!📱</strong></p>
                </>)
            }
        }
        getPoints()
    }, [])

    useEffect(() => {
        if (notes) {
            sethtmlNotes(
                notes.map(note => {
                    return (
                        <div key={note.id} onClick={() => { Shownote(note.pointCoords.y, note.pointCoords.x, note.note, note.userEmail, note.id) }} style={{ "top": `${note.pointCoords.y}px`, "left": `${note.pointCoords.x}px` }} className={`oneNote note-id-${note.id}`} ></div>
                    )
                })
            )
        }
    }, [notes])

    const closeModal = () => {
        if (LastClicked !== null) {
            const lastDot = document.getElementsByClassName(`note-id-${LastClicked}`)[0]
            lastDot.style.backgroundColor = "#51ff00"
        }

        setvisability({ "display": "none" });
    }

    const Shownote = (y, x, note, userEmail, id) => {
        if (LastClicked !== null) {
            const lastDot = document.getElementsByClassName(`note-id-${LastClicked}`)[0]
            lastDot.style.backgroundColor = "#51ff00"
        }

        const elem = document.getElementsByClassName(`note-id-${id}`)[0]
        elem.style.backgroundColor = "#bac8a0"

        LastClicked = id
        setLastClicked(id)

        setDescription({ y: y, x: x, note: note, email: userEmail })
        setvisability({ "display": "block" })
    }

    // const elem = document.getElementsByClassName("react-transform-component")[0]

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

    return (
        <div className="make-point-div">
            <Modal show={show} onHide={() => { handleClose() }} centered>
                <div className="modal-set-locations">
                    <Modal.Header closeButton>
                        <Modal.Title>Hint</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Select any dot on the map to learn more about the note left by someone
                        <hr />
                        <p style={{ "fontStyle": "italic", "color": "#656565" }}>To enlarge the map use your mousewheel or just pinch to zoom in</p>
                        {AdditionalTextForMobileDevices}
                    </Modal.Body>
                </div>
            </Modal>

            <div style={visability} className="addnote-div">
                <div className="title-and-cross">
                    <h5>Note on coords:  <p style={{ "marginBottom": "0px" }} >x: {Math.round(Description.x)}; y: {Math.round(Description.y)}</p></h5>
                    <button onClick={() => { closeModal() }} className="close-btn">&times;</button>
                </div>
                <h6 style={{ "marginBottom": "0px" }} > Creator's email: {Description.email}</h6>
                <br></br>
                <p>{Description.note}</p>
            </div>

            <TransformWrapper
                wheel={{ step: 40 }}
                onPanningStart={() => dragStart()}
                onPanningStop={() => dragEnd()}
                options={{ maxScale: 50, centerContent: false }}
                pan={{ paddingSize: 100 }}
                doubleClick={{ disabled: true }}
            >
                <TransformComponent>
                    <div className="inner-div point-read-only">
                        <div className="notes">
                            {htmlNotes}
                        </div>
                        <div className="svgmap">
                            <VectorMap className="map-for-point" {...world} style={{ width: "100%" }} />
                        </div>
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}
