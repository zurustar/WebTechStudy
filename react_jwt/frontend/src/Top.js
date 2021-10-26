

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Top() {

    const [username, setUsername] = useState("");
    const [realname, setRealname] = useState("");

    useEffect(()=>{
        fetch('http://localhost:8080/api/v0/me', {
            credentials: "include"
        }).then(res => {
            if(res.status !== 200) {
                throw new Error("failed tyo get my info");
            }
            return res.json();
        }).then(data => {
            setUsername(data.username);
            setRealname(data.realname);
        }).catch(e => {
            setUsername("");
            console.log(e);
        });
    },[]);

    return (
        <>
            {
                (username==="") ?
                <Link to="/login">ログイン</Link>
                :
                <>{realname}さんようこそ<br /><Link to="/content">コンテンツ</Link> | <Link to="/logoff">ログオフ</Link></>
            }
        </>
    );

}