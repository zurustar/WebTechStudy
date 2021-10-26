

import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Content() {

    useEffect(()=>{
        fetch('http://localhost:8080/api/v0/me', {
            credentials: 'include'            
        }).then(res => {
            if(res.status !== 200) {
                throw new Error("error");
            }
            return res.json();
        }).then(data => {
            console.log(data);
        }).catch(e => {
            console.log(e);
        })
    }, [])

    return (
        <>
        こんてんつ

        <hr />
        <Link to="/">トップ</Link>
        </>
    );
}