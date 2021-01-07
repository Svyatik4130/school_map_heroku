import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import axios from 'axios'
import ErrorNotice from '../../layout/misc/ErrorNotice'

import { loggedUser } from '../../../actions/UserActions'
// import { getAllUsers } from '../../../actions/UserActions'
import { useDispatch } from 'react-redux'

export default function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()

    const dispatch = useDispatch()
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault()

        try {
            const loginUser = { email, password }

            const loginRes = await axios.post("users/login", loginUser)
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
                    <h3>Login</h3>
                    {error && <ErrorNotice message={error} clearError={() => { setError(undefined) }} />}
                    <div className="form-group">
                        <label>Your email</label>
                        <input type="email" name="login" className="form-control" placeholder="Enter login" onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="pass" className="form-control" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block logNreg-btn">Submit</button>
                    <p className="forgot-password text-right">
                        Dont have account? <Link to={"/register"}>Sign-up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
