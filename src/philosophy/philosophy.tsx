import {useCollection} from "react-firebase-hooks/firestore";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase";

import firebaseConfig from "../fireconfig";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
        .functions('europe-west1')
} else {
    firebase.app()
}

const firestore = firebase.firestore()


export function PhilosophyCards(props: { coll: string; }) {
    const [snapshot, loading, error] = useCollection(firestore.collection(props.coll).where('reputation', '<', Infinity)
        .orderBy('reputation', 'desc'));
    const [order, setOrder] = useState([] as any)
    const [sorted, setSorted] = useState([] as any)
    const [overlay, setOverlay] = useState([] as any)

    useEffect(() => {
        if (!snapshot?.docs.length) return
        let arr: any = []
        let arrSorted: any = []
        if (snapshot) {
            let d = snapshot.docs.map((doc, i) => {
                const data = doc.data()
                arr[i] = data.name
                return data
            })
            let ids = snapshot.docs.map((doc, i) => {
                return doc.id
            })
            if (!order.length) setOrder(arr)
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < d.length; j++) {
                    if (order[i] === d[j].name) {
                        arrSorted[i] = <PhilosophyCard resize={props.coll.split('/').length < 2} img={d[j].img} name={d[j].name}
                                                       description={d[j].description} reputation={d[j].reputation}
                                                       key={i} pos={i} col={props.coll} id={ids[j]} />
                    }
                }
            }
            setSorted(arrSorted)
        }
    }, [snapshot, order])

    return (
        <div className='philosophyCards'>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Collection: Loading...</span>}
            {snapshot && <div className='philosophyCardsLoaded'>
                <h1 className='PhilosophyText navbarLinks'> </h1>
                {sorted}
            </div>}
            {overlay && <div className='philosophyCardsOverlay'>{overlay}</div>}
        </div>
    )
}

export function PhilosophyCard(props: { pos: number; resize: any; img: string; name: string; reputation: number; description: string[]; id?: string; col?: string }) {
    const history = useHistory();
    const [state, setState] = useState('auto');
    const [display, setDisplay] = useState('hidden');
    const [voted, setVoted] = useState(10);

    function re() {
        setTimeout(() => {
            if (document?.getElementById(String(props.pos))?.clientHeight) {
                const h = document.getElementById(String(props.pos))?.clientHeight
                if (h) {
                    setState(h - 10 + 'px')
                    setDisplay('grid')
                }
            }
            else re()
        }, 10)
    }
    if (props.resize) {
        re()
        window.addEventListener('resize', () => re())
    }
    let s = {
        display: display,
    }
    if (!props.resize) { // @ts-ignore
        s.height = 'auto'
    }
    return (
        <div style={s} className='philosophyCard' onClick={() => {
            if (props.resize) history.push(`/philosophy/${props.name}`)}
        } >
            <img id={props.pos.toString()} src={props.img} className="philosophyImg"/>
            {/*// @ts-ignore*/}
            <div id={props.pos + 'div'} className="philosophyCardText" style={{height: state}}>
                {props.resize &&
                <FontAwesomeIcon className='faExternalLinkAlt' icon={faExternalLinkAlt} /> }
                <h3 className='philosophyCardName'>{props.name}</h3>
                <span>Favor: {props.reputation}
                    <button className='btn btnUp' onClick={(e) => {
                        if (voted >= 0) updateVote(props.id ?? props.name, props.reputation + 1, props.col)
                        setVoted(voted - 1)
                        e.stopPropagation()
                    }}><FontAwesomeIcon icon={faArrowUp} /></button>
                    <button className='btn btnDown' onClick={(e) => {
                        if (voted >= 0) updateVote(props.id ?? props.name, props.reputation - 1, props.col)
                        setVoted(voted - 1)
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


function updateVote(id: string, targetRep: number, collection: string = 'people') {
    firebase.firestore().collection(collection).doc(id).update({
        reputation: targetRep
    })
}