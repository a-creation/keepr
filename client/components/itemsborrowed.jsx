import React, { useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";

export default function ItemsBorrowed() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const username =  useParams();

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch('/api/itemsBorrowed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(username)
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log('result', result)
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [isLoaded])

  const returnItem = (id) => {
    // useEffect(() => {
    // setIsLoaded(false);
    console.log(id, 'id')
    fetch('/api/returnItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id})
    })
      .then((res)=> {
        setIsLoaded(false)
      })
  }

  const results = [];

  items.map(item => {
    if(username.username){
      results.push(<tr key={item.thingid}><td>{item.thingname}</td><td>{item.thingdescription}</td><td>{item.username}</td></tr>)
    }
    else {
      results.push(<tr key={item.thingid}><td>{item.thingname}</td><td>{item.thingdescription}</td><td>{item.username}</td><td><button onClick={() => returnItem(item.thingid)}>Return</button></td></tr>)
    }
  })

  if (error) {
    return <tr><td>Error: {error.message}</td></tr>;
  } else if (!isLoaded) {
    return <tr><td>Loading...</td></tr>;
  } else {
    return results
  }

}