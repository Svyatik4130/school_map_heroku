import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom"
import { loggedUser } from '../../actions/UserActions'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

export default function NavMenu() {
    const dispatch = useDispatch()
    const history = useHistory()
    const [url, seturl] = useState(window.location.href)
    const userData = useSelector(state => state.userData)
    const [MenuStatus, setMenuStatus] = useState({seepoints: "", createpoint: ""})

    useEffect(() => {
        if(window.location.href.includes("seepoints")){
            setMenuStatus({
                seepoints: "menu-active",
                createpoint: ""
            })
        } else if(window.location.href.includes('makepoint')){
            setMenuStatus({
                seepoints: "",
                createpoint: "menu-active"
            })
        } else {
            setMenuStatus({
                seepoints: "",
                createpoint: ""
            })
        }
    }, [])

    const setNewActive = (active_menu) => {
        switch (active_menu) {
            case "seepoints":
                setMenuStatus({
                    seepoints: "menu-active",
                    createpoint: ""
                })
                break;
            case "createpoint":
                setMenuStatus({
                    seepoints: "",
                    createpoint: "menu-active"
                })
                break;

            default:
                history.push("/")
                setMenuStatus({seepoints: "", createpoint: ""})
                break;
        }
    }

    const logout = () => {
        history.push("/")
        dispatch(loggedUser({
            token: undefined,
            user: undefined
        }))
        localStorage.setItem("auth-token", "")
    }

    return (
        <Navbar bg="light" expand="lg">
            <Link className="navbar-brand"onClick={() => {setNewActive("") }} to={"/"}>Worldik<span role='img' aria-label="Close">🌐</span></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" >
                    {userData.user ? (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to={"/seepoints"}><button className={MenuStatus.seepoints} onClick={() => {setNewActive("seepoints") }}>See other people's dots on the map</button></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/makepoint"}><button className={MenuStatus.createpoint} onClick={() => {setNewActive("createpoint") }}>Create own dot</button></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/"}><button className="logoutBtn" onClick={logout}>Log out</button></Link>
                            </li>
                        </ul>
                    ) : (
                            <>
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link className="nav-link" to={"/sign-in"}>Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={"/sign-up"}>Sign-up</Link>
                                    </li>
                                </ul>
                            </>
                        )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
