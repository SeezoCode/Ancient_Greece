import React from "react";
import ReactPlayer from 'react-player'
import {useDocumentOnce} from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import "firebase/firestore";
const firestore = firebase.firestore()
// @ts-ignore
// import videoSrc from './My Movie.mp4';


export function HistoryTab(props: { language: string }) {
    const [snapshot, loading, error] = useDocumentOnce(firestore.collection('data').doc('HistorySection'))
    console.log(loading, error)
    const data = snapshot?.data()
    if (data) {
        const d = data[props.language] ?? data.data
        return (
            <div className='HistoryTabBody'>
                <h1 className='PhilosophyText navbarLinks' id='historyTabMargin'> </h1>

                <h1 className='historyTabLandingText'>{d[0]}</h1>

                <AnimationHandler elId='historyLandingImg'>
                    <img className='historyLandingImg' alt='nice pic' src="https://wallpaperaccess.com/full/1127822.jpg"/>
                </AnimationHandler>

                <FirstSetOfParagraphs arr={d} />

                <FirstVideo/>

                <PeloponnesianWar arr={d}/>

                <History arr={d} />

                <Slavery arr={d} />

                <AnimationHandler elId="end"><p>*End*</p></AnimationHandler>

            </div>
        )
    }
    else return <div> </div>
}


function FirstVideo() {
    const url = 'https://firebasestorage.googleapis.com/v0/b/roman-empire-power.appspot.com/o/My%20Movie.mp4?alt=media&token=ece016cb-1298-4df3-bc22-7c7a6fd1fedc'
    // const url = videoSrc
    const player = React.useRef(null);
    const [scrollTop, setScrollTop] = React.useState(0)
    const [animAt, setAnimAt] = React.useState(0)
    const [state, setState] = React.useState(0)

    const scrollTopSetter = () => setScrollTop(window.scrollY)
    React.useEffect(() => window.addEventListener('scroll', scrollTopSetter), [])

    React.useEffect(() => {
        // console.log(performance.now() - state)
        // setState(performance.now())
        const elem = document.getElementById('firstVideo')
        if (elem) {
            let viewOnScreen = (1 - elem.getBoundingClientRect().top / window.scrollY) / 1.7
            if (viewOnScreen > 0 && viewOnScreen < 1) {
                setState(state + 1)
                setAnimAt(viewOnScreen)
                // console.log(viewOnScreen)
                document.body.style.setProperty(('--firstVideo'), (viewOnScreen).toString())
            }
        }
    }, [scrollTop])

    React.useEffect(() => {
        try {
            //@ts-ignore
            if (scrollTop) player.current.seekTo(animAt * 7, 'fragments')
        } catch (e) {
            console.log(e)
        }
    }, [animAt])
    return (
        <div className='firstVideoDiv'>
            {/*{Math.round(animAt * 100) / 100}*/}
            <ReactPlayer ref={player} id='firstVideo' url={url} width={720} height={420} />
            <div className='firstVideoSpace'> </div>
        </div>
    )
}








type AnimationHandlerPropsType = {
    elId: string;
    cssVar?: string;
    children: JSX.Element
}

function AnimationHandler(props: AnimationHandlerPropsType) {
    const [scrollTop, setScrollTop] = React.useState(0)
    const [, setAnimAt] = React.useState(0)
    const scrollTopSetter = () => setScrollTop(window.scrollY)

    React.useEffect(() => window.addEventListener('scroll', scrollTopSetter), [])

    React.useEffect(() => {
        getViewportVisibility(props.elId, setAnimAt)
        // return window.removeEventListener('scroll', scrollTopSetter)
    }, [scrollTop, props.elId])
    return (
        <div id={props.elId}>
            {props.children}
        </div>
    )
}


function getViewportVisibility(elId: string, setAnimAt: any, cssVar?: string) {
    const elem = document.getElementById(elId)
    if (elem) {
        // contains value between 0 (seen from bottom) to 1 (seen from top)
        let viewOnScreen = 1 - (elem.getBoundingClientRect().top + elem.getBoundingClientRect().height) /
            (window.innerHeight + elem.getBoundingClientRect().height)
        if (viewOnScreen > 1) viewOnScreen = 1
        else if (viewOnScreen < 0) viewOnScreen = 0
        document.body.style.setProperty(
            cssVar ?? ('--' + elId),
            viewOnScreen.toString()
        )
        setAnimAt(viewOnScreen)
        return viewOnScreen
    }
}


function FirstSetOfParagraphs(props: any) {
    return (
        <div>
            <AnimationHandler elId='firstSetOfParagraphs'>
                <p className="firstSetOfParagraphs">{props.arr[1]}</p>
            </AnimationHandler>
            <AnimationHandler elId='firstSetOfParagraphs2' >
                <p className="firstSetOfParagraphs">{props.arr[2]}</p>
            </AnimationHandler>
        </div>
    )
}









function PeloponnesianWar(props: any) {
    return (
        <div id='PeloponnesianWarDiv'>
            <div>
                <AnimationHandler elId='peloponnesianWarH1'><h1 className='peloponnesianWar'>{props.arr[3]}</h1></AnimationHandler>
                <AnimationHandler elId='peloponnesianWarP1'>
                    <p className='peloponnesianWar'>{props.arr[4]}</p>
                </AnimationHandler>
                <AnimationHandler elId='peloponnesianWarP2'>
                    <p className='peloponnesianWar'>{props.arr[5]}</p>
                </AnimationHandler>
                <AnimationHandler elId='peloponnesianWarP3'>
                    <p className='peloponnesianWar'>{props.arr[6]}</p>
                </AnimationHandler>
            </div>
            <div>
                <AnimationHandler elId='peloponnesianWarImg'>
                    <img className='peloponnesianWarImg' src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Pelopennesian_War%2C_Key_Actions_in_each_Phase%2C_431_-_404_B.C..JPG' alt='' />
                </AnimationHandler>
            </div>
        </div>
    )
}


function History(props: {arr: Array<string>}) {
    return (
        <div className='historyDiv'>
            <AnimationHandler elId='historyH1' ><h1>{props.arr[7]}</h1></AnimationHandler>
            <AnimationHandler elId='historyH21' ><h2>{props.arr[8]}</h2></AnimationHandler>
            <AnimationHandler elId='historyP1' ><p>{props.arr[9]}</p></AnimationHandler>
            <AnimationHandler elId='historyH22' ><h2>{props.arr[10]}</h2></AnimationHandler>
            <AnimationHandler elId='historyP2' ><p>{props.arr[11]}</p></AnimationHandler>
            <AnimationHandler elId='historyH23' ><h2>{props.arr[12]}</h2></AnimationHandler>
            <AnimationHandler elId='historyP3' ><p>{props.arr[13]}</p></AnimationHandler>
            <AnimationHandler elId='historyH34' ><h3>{props.arr[14]}</h3></AnimationHandler>
            <AnimationHandler elId='historyP4' ><p>{props.arr[15]}</p></AnimationHandler>
        </div>
    )
}


function Slavery(props: {arr: Array<string>}) {
    return (
        <div className='slavery'>
            <AnimationHandler elId='slaveryH1' ><h1>{props.arr[16]}</h1></AnimationHandler>
            <AnimationHandler elId='slaveryP1' ><p>{props.arr[17]}</p></AnimationHandler>
            <AnimationHandler elId='slaveryP2' ><p>{props.arr[18]}</p></AnimationHandler>
        </div>
    )
}


// window.addEventListener(
//     "scroll",
//     () => {
//         // let height = window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
//         const img = document.getElementById('historyLandingImg')
//         if (img) {
//             console.log(1-(img?.getBoundingClientRect().top + img?.getBoundingClientRect().height) / (window.innerHeight + img?.getBoundingClientRect().height))
//                 // (img?.getBoundingClientRect().top), img?.getBoundingClientRect().height, window.innerHeight)
//             // const isElemInView = ((img.getBoundingClientRect().top / img.getBoundingClientRect().height) <= 1.18 && (img.getBoundingClientRect().top / img.getBoundingClientRect().height) >= -1)
//             // if (isElemInView)
//             //     console.log(Math.abs(img?.getBoundingClientRect().top) / img?.getBoundingClientRect().height)
//         }
//         if (img) {
//             let height = window.pageYOffset / (img.clientHeight + img.getBoundingClientRect().top)
//             if (height > 1) height = 1
//             // console.log(height)
//             document.body.style.setProperty(
//                 "--scroll",
//                 height.toString()
//             );
//         }
//     },
//     false
// );