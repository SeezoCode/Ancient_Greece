import './App.css';
import {Component} from 'react'
import firebase from "firebase/app";
import "firebase/functions";
import "firebase/firestore";
import "firebase/analytics";
// import HttpsCallableResult = firebase.functions.HttpsCallableResult;
// import functions = firebase.functions;

let firebaseConfig = {
    apiKey: "AIzaSyAgbsgswZpDKQ3PbiubfLB5I4JACZSymGg",
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
    // .functions('europe-west1')

}

let functions = firebase.app().functions('europe-west1');
// functions.useEmulator("localhost", 5002);

let anal = firebase.analytics();
let upvote = functions.httpsCallable('helloWorld')
let downvote = functions.httpsCallable('downvote')
// let askQuestionFire = functions.httpsCallable('askQuestion')
// testFunc({name: "gjc"}).then((data) => {console.log(data)})

let firestore = firebase.firestore();


interface StateInterface {
    current: number,
    cache: Array<NavBarElemInterface>,
    question: string,
}

interface NavBarElemInterface {
    text: string,
    dataAt: string,
    type: string,
    savedData?: string,
}

interface landingInterface {
    img: string,
    heading: string,
    description: string,
    key: number
}

interface People {
    name: string,
    reputation: number,
    description: string,
    img: string
}

let navBarElems = [
    {
        text: 'Ancient Greece',
        type: 'landingPage',
        dataAt: 'ancient_greece'
    },
    {
        text: 'History',
        type: 'html',
        dataAt: 'history'

    },
    {
        text: 'Politics and Society',
        type: 'html',
        dataAt: 'politics_and_society'

    },
    {
        text: 'Philosophy',
        type: 'philosophy',
        dataAt: 'philosophers'
    },
]

let philosophyData: firebase.firestore.DocumentData[] = []


async function getDescription(link: string, type: string = '') {
    const docRef = firestore.doc(`data/${link}`);
    const docSnapshot = await docRef.get();
    return docSnapshot.data()
    // let text = await firestore.collection(`data/${link}`).get()
    // return text
    // let response = await fetch(link)
    // return response.text()
}


async function getCollection(collection: string): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    let db = firestore.collection(collection).orderBy("reputation", 'desc').get()
    return db
}

async function getProcessedCol(name: string) {
    let collection = await getCollection(name)
    let arr = collection.docs.map(data => {
        return data.data()
    })
    console.log(arr)
    return arr
}

// getProcessedCol('people').then(data => console.log(data))


class App extends Component {
    state: StateInterface

    constructor(props: any) {
        super(props);
        this.state = {
            current: 0,
            cache: navBarElems,
            question: '',
        }
        this.fetchContentData = this.fetchContentData.bind(this)
        this.changeSection = this.changeSection.bind(this)
    }

    componentDidMount() {
        this.fetchContentData(0)
    }

    fetchContentData(key: number) {
        console.log(key, this.state)
        let currentContext = this.state.cache[key]
        if (navBarElems[key].type === 'philosophy') getPhilosophy().then()
        if (currentContext.savedData) {
            // this.setState({current: key})
            console.log('from cache')
        } else {
            getDescription(currentContext.dataAt).then(data => {
                console.log(data)
                let cache = this.state
                // @ts-ignore
                cache.cache[key].savedData = data.data
                this.setState(cache)
            })
        }
    }

    changeSection(key: number): void {
        this.setState({current: key})
    }

    renderSections() {
        let data = this.state.cache[this.state.current].savedData
        if (data) return Section({__html: data})
    }

    landingPage = () => {
        let data = this.state.cache[this.state.current].savedData
        if (data) {
            let parsed = JSON.parse(data)
            // return LandingElems(parsed, this.fetchContentData, this.changeSection)
            return <LandingElems2 data={parsed} fetchContentData={this.fetchContentData}
                                  changeSection={this.changeSection}/>
        }
    }

    render() {
        return (
            <div className="App">
                <NavBar fetchContentData={this.fetchContentData} changeSection={this.changeSection}/>
                {/*<div className="container">*/}
                {navBarElems[this.state.current].type === 'html' && this.renderSections()}
                {navBarElems[this.state.current].type === 'landingPage' && this.landingPage()}
                {navBarElems[this.state.current].type === 'philosophy' && <Philosophy/>}
                <Footer/>
                {/*{this.state.current === 0 && InitialCards(navBarElems)}*/}
                {/*</div>*/}
            </div>
        );
    };
}


function Section(state: any) {
    return (
        // @ts-ignore
        <div dangerouslySetInnerHTML={state}/>
    )
}

class LandingElems2 extends Component {
    state: { width: number; };
    props: any;

    constructor(props: any) {
        super(props);
        this.state = {width: window.innerWidth}
    }

    componentDidMount = () => {
        let state = () => this.setState({width: window.innerWidth})
        window.addEventListener('resize', (e) => {
            state()
        })
    }

    render() {
        let array = [[], [], []]
        let colAmount = this.state.width <= 923 ? 2 : 3
        for (let i = 0; i < this.props.data.length; i++) {
            // @ts-ignore
            array[i % colAmount][Math.floor(i / colAmount)] =
                <div className="col"
                     key={i}>{LandingElem(this.props.data[i], this.props.fetchContentData, this.props.changeSection)}</div>
        }
        return <div className="row landing" id="landing">
            <h1 id="landingH1">Ancient Greece</h1>
            <p>Ancient Greece (Greek: Ἑλλάς, romanized: Hellás) was a civilization belonging to a period of Greek
                history
                from the Greek Dark Ages of the 12th–9th centuries BC to the end of antiquity (c. AD 600).</p>
            <div className='row'>
                <div className="landingCol">{array[0]}</div>
                <div className="landingCol">{array[1]}</div>
                <div className="landingCol">{array[2]}</div>
            </div>
        </div>
    }
}


function LandingElem(data: landingInterface, fetchContentData: any, changeSection: any) {
    return (
        <div className="landingElem">
            <img src={data.img} className="landingImages"/>
            <div className="landingText">
                <h4>{data.heading}</h4>
                <p>{data.description}</p>
                <button className="btn btn-outline-dark" onMouseOver={() => fetchContentData(data.key)}
                        onClick={() => {
                            changeSection(data.key)
                            anal.logEvent(`Card Click ${data.heading}`)
                        }}>See more
                </button>
            </div>
        </div>
    )
}

async function getPhilosophy() {
    let dataArr = await getProcessedCol('people')
    philosophyData = dataArr;
}

class Philosophy extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isReady: false
        }
        philosophyData.sort((a, b) => {
            return a.reputation < b.reputation ? 1 : -1;
        })
    }

    componentDidMount() {
        if (!philosophyData.length) this.getData()
        else this.changeStateToReady()
    }

    getData = async () => {
        await getPhilosophy()
        this.changeStateToReady()
    }

    changeStateToReady = () => {
        this.setState({isReady: true})
    }

    spinning = (key: number, vote: string) => {
        let old = philosophyData[key].reputation
        setTimeout(() => {
            let limit = vote === 'upvote' ? philosophyData[key].upvoteLimit : philosophyData[key].downvoteLimit
            if (philosophyData[key].reputation === old && limit) {
                philosophyData[key].reputation = <i className="fas fa-circle-notch fa-spin"> </i>
                this.setState({num: null})
            }
        }, 500)
    }

    changeUpvote(key: number, name: string) {
        this.spinning(key, 'upvote')
        if (philosophyData[key].upvoteLimit == null) philosophyData[key].upvoteLimit = 16
        else philosophyData[key].upvoteLimit -= 1
        if (philosophyData[key].upvoteLimit <= 0) {
            alert(`You're too sweet for ${name}. So much so that he would get diabetes. \n\nMaybe... click this random link: https://youtu.be/dQw4w9WgXcQ`)
            return
        }
        upvote({name: name}).then((data) => this.rest(data, key))
    }

    down(key: number, name: string) {
        this.spinning(key, 'downvote')
        if (philosophyData[key].downvoteLimit == null) philosophyData[key].downvoteLimit = 16
        else philosophyData[key].downvoteLimit -= 1
        if (philosophyData[key].downvoteLimit <= 0) {
            alert(`Too much hate on ${name}. Please judge somebody else. \n\nMaybe... click this random link: https://youtu.be/dQw4w9WgXcQ`)
            return
        }
        downvote({name: name}).then((data) => this.rest(data, key))
    }

    rest(data: any, key: number) {
        philosophyData[key].reputation = data['data']
        this.setState({
            num: data.data,
        })
    }

    createCards = (dataArr: any) => {
        return dataArr.map((elem: any, key: number) => {
            return (
                <div className="person container" key={key}>
                    <div className="person-card landingElem">
                        <div className='row container-md c'>
                            <div className="col-md-3">
                                <img src={elem.img} className="pimg"/>
                            </div>
                            <div className="col-md-9">
                                <h4>{elem.name}</h4>
                                <span>Favor: {elem.reputation}
                                    <button className='btn btn-outline-success butn' onClick={() => {
                                        this.changeUpvote(key, elem.name)
                                    }}><i
                                        className="fas fa-arrow-up"> </i></button>
                                    <button className='btn btn-outline-danger butn' onClick={() => {
                                        this.down(key, elem.name)
                                    }}><i
                                        className="fas fa-arrow-down"> </i></button></span>
                                <hr/>
                                {this.desc(elem.description, philosophyData[key].full, key)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    desc = (data: Array<string>, full: boolean, key: number) => {
        if (full) {
            return <div>{data.map((par: string, i: number) => {
                return (<p className='phyCard' key={i}>{par}</p>)
            })}
                <button className='btn btn-link phyLink' onClick={() => {
                    philosophyData[key].full = !philosophyData[key].full;
                    this.forceUpdate();
                }}>Compress
                </button>
            </div>
        } else {
            return <div>
                <p className='phyCard'>{data[0].substring(0, 420)} ...</p>
                <button className='btn btn-link phyLink' onClick={() => {
                    philosophyData[key].full = !philosophyData[key].full;
                    this.forceUpdate()
                }}>Expand
                </button>
            </div>
        }
    }

    render() {
        if (this.state.isReady) {
            let cards = this.createCards(philosophyData)
            return (
                // <p>rend</p>
                // {cards}
                <div>
                    <h3 className="p">This list contains famous ancient Greeks ordered by upvotes</h3>
                    {cards}
                </div>
            )
        } else return <p onClick={() => this.setState({ready: true})}>Loading</p>
    }
}


// function Ask(ask: askQuestionType, change: askQuestionType) {
//     return (
//         <div className="questionAsker">
//             <form onSubmit={ask} >
//                 <input type="text" onChange={change} placeholder="What was Ancient Greece" className="input-group-text" />
//             </form>
//         </div>
//     )
// }


function Footer() {
    return (
        <footer>
            <br/>
            <br/>
            <p>This is the footer</p>
            <br/>
        </footer>
    )
}


class NavBar extends Component<any, any> {
    buildSections() {
        let lis = navBarElems.map((elem, key) => {
            return <li key={key} className='nav-item'>
                <button className='btn btn-dark' onMouseOver={() => this.props.fetchContentData(key)}
                        onClick={() => {
                            this.props.changeSection(key)
                            anal.logEvent(`NavBar ${elem.text}`)
                        }}>{elem.text}</button>
            </li>
        })
        return <ul className="navbar-nav">{lis}</ul>
    }

    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {this.buildSections()}
                    </div>
                </div>
            </nav>
        );
    }
}


export default App;
