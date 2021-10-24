

import { useState } from "react";

import { useHistory } from "react-router-dom";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const history = useHistory();

    function onSubmit(e) {
        e.preventDefault();
        setMessage("");
        fetch('http://localhost:8080/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username: username, password: password})
        }).then(res => {
            if(res.status !== 200) {
                throw new Error('failed to login');
            }
            return res.json();
        }).then(data => {
            history.push('/');
        }).catch(e => {
            setMessage("ログインに失敗しました");
        });
    }
    
    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    onChange={e=>setUsername(e.target.value)}
                    required />
                <input
                    type="password"
                    placeholder="password"
                    onChange={e=>setPassword(e.target.value)}
                    required />
                <button type="submit">ログイン</button>
            </form>

            <p style={{"color": "red"}}>{message}</p>

            <p>あなたのアカウント/パスワードは両方ともuser01です。</p>
        </>
    );
}