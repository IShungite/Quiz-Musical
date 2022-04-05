import React, { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    const getData = async () => {
      const data = await fetch("https://cors-anywhere.herokuapp.com/http://api.deezer.com/search/track/autocomplete?limit=1&q=eminem").then((res) =>
        res.json()
      );

      console.log(data);
    };

    getData();
  }, []);

  return <div>test</div>;
}
