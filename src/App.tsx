import React from 'react';
import './App.css';
// import { Component } from 'react'
import firebase from "firebase/app";
import "firebase/functions";
import "firebase/firestore";
import "firebase/analytics";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect, useLayoutEffect } from 'react';
import {useCollection, useCollectionOnce} from "react-firebase-hooks/firestore";

let firebaseConfig = {
  apiKey: "AIzaSyC5PG2D5YTNNr8j6Ca7BLI8Mt9TeH3e13c",
  authDomain: "roman-empire-power.firebaseapp.com",
  projectId: "roman-empire-power",
  storageBucket: "roman-empire-power.appspot.com",
  messagingSenderId: "848202750164",
  appId: "1:848202750164:web:f0b1f50322601e04028341",
  measurementId: "G-VVBXH8Y8EY"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
      .functions('europe-west1')
} else {
  firebase.app()
}

// let functions = firebase.app().functions('europe-west1');
// functions.useEmulator("localhost", 5002);
//
// let upvote = functions.httpsCallable('helloWorld')
// let downvote = functions.httpsCallable('downvote')



function App() {
    return (
        <div>
            <Router>
                <NavBar />
                <Switch>
                    <Route path="/ancient_greece" children={<LandingPage />} />
                    {/*<Route path="/history" children={<GetComments />} />*/}
                    {/*<Route path="/politics_and_society" children={<GetComments />} />*/}
                    <Route path="/philosophy" children={<PhilosophyCards />} />
                </Switch>
            </Router>
        </div>
    );
}


function LandingPage(props: any) {
    const [snapshot, loading, error] = useCollectionOnce(firebase.firestore().collection('people'));
    if (snapshot) {
        let arr: Array<Array<any>> = [[], [], []]
        const elems = snapshot.docs.map((doc, i) => {
            const data = doc.data()
            return <LandingElem key={i} img={data.img} name={data.name} sd={data.sd} to={data.to} />
        })

        elems.forEach((elem, i) => {
            arr[i % 3].push(elem)
        })
        return <div className='landingScreen'>
            <div className='landingScreenText landingElements'>
                <h1>Ancient Greece</h1>
                <p id='landingInfo'>Ancient Greece (Greek: Ἑλλάς, romanized: Hellás) was a civilization belonging to a period of Greek
                    history
                    from the Greek Dark Ages of the 12th–9th centuries BC to the end of antiquity (c. AD 600).</p>
            </div>
            <div className="landingElements">
                <div>{arr[0]}</div>
                <div>{arr[1]}</div>
                <div>{arr[2]}</div>
            </div>
        </div>
        }
    return (
        <div>
            {error && <p>{JSON.stringify(error)}</p>}
            {/*{loading && <p>Loading</p>}*/}
            {snapshot && <p>Loaded</p>}
        </div>
    )
}


function LandingElem(props: any) {
    const history = useHistory();

    return (
        <div className="landingElem" onClick={() => {history.push(props.to)}}>
            <img src={props.img} className="landingImages"/>
            <div className="landingText">
                <h3>{props.name}</h3>
                <p>{props.sd}</p>
                {/*<button className="btn btn-outline-dark">See more</button>*/}
            </div>
        </div>
    )
}


function NavBar(props: any) {
    return (
        <div className='NavBar'>
            <div className='navbarLinks'>
                <Link className='navbarLink' to="/ancient_greece">Ancient Greece</Link>
                <Link className='navbarLink' to="/history">History</Link>
                <Link className='navbarLink' to="/politics_and_society">Politics and Society</Link>
                <Link className='navbarLink' to="/philosophy">Philosophy</Link>
            </div>
        </div>
    )
}


function PhilosophyCards(props: any) {
    const [snapshot, loading, error] = useCollection(firebase.firestore().collection('people')
        .orderBy('reputation', 'desc'));
    const [order, setOrder] = useState([] as any)
    const [sorted, setSorted] = useState([] as any)

    // if (snapshot) {
    useEffect(() => {
        let arr: any = []
        let arrSorted: any = []
        if (snapshot) {
            let d = snapshot.docs.map((doc, i) => {
                const data = doc.data()
                arr[i] = data.name
                return data
            })
            if (!order.length) setOrder(arr)
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < d.length; j++) {
                    if (order[i] === d[j].name) {
                        arrSorted[i] = <PhilosophyCard resize={true} img={d[j].img} name={d[j].name}
                                                       description={d[j].description} reputation={d[j].reputation}
                                                       key={i} pos={i}/>
                        console.log(order[i], d[j].name)
                    }
                }
            }
            console.log(order, d)
            console.log(arrSorted)
            setSorted(arrSorted)
        }
    }, [snapshot, order])

    window.addEventListener('scroll', (e) => console.log(window.scrollY));

    return (
        <div className='philosophyCards'>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Collection: Loading...</span>}
            {snapshot && <div className='philosophyCardsLoaded'>
                <h1 className='PhilosophyText navbarLinks'> </h1>
                {sorted}
            </div>}
        </div>
    )
}

function PhilosophyCard(props: any) {
    const [state, setState] = useState('auto');
    const [description, setDescription] = useState(true);

    function re() {
        setTimeout(() => {
            if (document?.getElementById(props.pos)?.clientHeight) {
                const h = document.getElementById(props.pos)?.clientHeight
                if (h) setState(h - 40 + 'px')
            }
            else re()
        }, 5)
    }
    if (description) re()
    window.addEventListener('resize', () => re())
    return (
        <div className='philosophyCard' onClick={() => {
            setDescription(!description)
            description ? setState('auto') : re()
        }
        } >
            <img id={props.pos} src={props.img} className="philosophyImg"/>
            {/*// @ts-ignore*/}
            <div className="philosophyCardText" style={{height: state}}>
                <h3>{props.name}</h3>
                <span>Favor: {props.reputation}
                    <button className='btn btnUp' onClick={(e) => {
                        updateVote(props.name, props.reputation + 1)
                        e.stopPropagation()
                    }}><FontAwesomeIcon icon={faArrowUp} /></button>
                    <button className='btn btnDown' onClick={(e) => {
                        updateVote(props.name, props.reputation - 1)
                        e.stopPropagation()
                    }}><FontAwesomeIcon icon={faArrowDown} /></button>
                </span>
                <hr />
                {props.description.map((e: string, i: number) => {
                    return <p key={i}>{e}</p>
                })}
            </div>
        </div>
    )
}

function updateVote(name: string, targetRep: number) {
    firebase.firestore().collection('people').doc(name).update({
        reputation: targetRep
    })
}




export default App;
