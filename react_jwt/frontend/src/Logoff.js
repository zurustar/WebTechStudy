import { useEffect } from "react";

import { Link } from "react-router-dom";

export default function Logoff() {
  useEffect(() => {
    fetch("http://localhost:8080/api/v0/logoff", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("failed to logoff");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      ログオフしたと思います。
      <br />
      <Link to="/">トップページにもどる</Link>
    </>
  );
}
