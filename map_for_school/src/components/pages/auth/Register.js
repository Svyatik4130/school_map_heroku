import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import axios from 'axios'
import ErrorNotice from '../../layout/misc/ErrorNotice'
import { loggedUser } from '../../../actions/UserActions'
import { useDispatch } from 'react-redux'


export default function Register() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordCheck, setPasswordCheck] = useState()
    const [error, setError] = useState()

    const dispatch = useDispatch()
    const history = useHistory()

    const submit = async (e) => {
        e.preventDefault()
        try {
            const newUser = { email, password, passwordCheck }
            await axios.post("/users/register", newUser)

            const loginRes = await axios.post("users/login", { email, password })
            dispatch(loggedUser({
                token: loginRes.data.token,
                user: loginRes.data.user
            }))

            localStorage.setItem("auth-token", loginRes.data.token)
            history.push('/')
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }

    }

    return (
            <div className="auth-wrapper-logNreg">
                <div className="auth-inner">
                    <form onSubmit={submit}>
                        <h3>Sign Up</h3>
                        {error && <ErrorNotice message={error} clearError={() => { setError(undefined) }} />}

                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" name="email" className="form-control" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="pass" className="form-control" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                            <input type="password" className="form-control" placeholder="verify password" onChange={e => setPasswordCheck(e.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block logNreg-btn">Sign Up</button>
                        <p className="forgot-password text-right">
                            Already registered <Link to={"/login"}>Sign-in</Link>
                        </p>
                    </form>
                </div>
            </div>
    )
}
