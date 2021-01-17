import React from 'react'
import { useHistory } from "react-router-dom"

export default function NotFound() {
    const history = useHistory()

    const backtomain = () => {
        history.push("/")
    }

    return (
        <div className="auth-wrapper-logNreg bckgd404">
            <a href="https://dribbble.com/shots/9516613-Melting-Earth" target="_blank" className="source">gif source</a>
            <p className="title404" >404</p>
            <div className="desc404">
                <p className="desc" >We searched hight and low, but we could not find what you are looking for. Let's better discover some new places on our Earth!</p>
                <button onClick={() => backtomain()} className="back404mainbtn" >Back to home page</button>
            </div>
            {/* https://dribbble.com/shots/9516613-Melting-Earth */}
            <img className="gif404" src={require('../../../images/earth404.gif')} alt="earth404" />
        </div>
    )
}
