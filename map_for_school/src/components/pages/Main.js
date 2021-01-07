import React from 'react'
import Loader from 'react-loader-spinner'
import { Container, Row, Col } from 'react-bootstrap';

import Map from '../layout/Map'

export default function Main() {
    return (
        <>
            {/* <Loader className="pre-loader"
                type="Bars" color="#FFFFFF" height={80} width={80}
                timeout={1000} //3 secs
            // #5b8982
            /> */}
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
                            <div className="descDIV">
                                <p id="description"></p>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
