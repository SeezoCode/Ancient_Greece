import './App.css';
import {Component} from 'react'
import firebase from "firebase/app";
import "firebase/functions";
import "firebase/firestore";
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
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app(); // if already initialized, use that one
}

let functions = firebase.functions();
functions.useEmulator("localhost", 5002);
// firebase.analytics();
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
        dataAt: 'gs://roman-empire-power.appspot.com/ancient_greece.json'
    },
    {
        text: 'History',
        type: 'html',
        dataAt: 'http://127.0.0.1:8080/history.html'
    },
    {
        text: 'Politics and Society',
        type: 'html',
        dataAt: 'http://127.0.0.1:8080/politics_and_society.html'
    },
    {
        text: 'Philosophy',
        type: 'philosophy',
        dataAt: 'http://127.0.0.1:8080/philosophers.json'
    },
]


async function getDescription(link: string, type: string = ''): Promise<string> {
    let response = await fetch(link)
    return response.text()
}


async function getCollection(collection: string): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    let db = firestore.collection(collection).orderBy("reputation", 'desc').get()
    return db
}

async function getProcessedCol(name: string) {
    // let text = await firestore.collection(`data/${name}`).get()
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
        if (currentContext.savedData) {
            // this.setState({current: key})
            console.log('from cache')
        } else {
            getDescription(currentContext.dataAt).then((data) => {
                let cache = this.state
                cache.cache[key].savedData = data
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
            return LandingElems(parsed, this.fetchContentData, this.changeSection)
        }
    }

    render() {
        return (
            <div className="App">
                <NavBar fetchContentData={this.fetchContentData} changeSection={this.changeSection}/>
                {/*<div className="container">*/}
                {navBarElems[this.state.current].type === 'html' && this.renderSections()}
                {navBarElems[this.state.current].type === 'landingPage' && this.landingPage()}
                {navBarElems[this.state.current].type === 'philosophy' && <Philosophy />}
                <Footer />
                {/*{this.state.current === 0 && InitialCards(navBarElems)}*/}
                {/*</div>*/}
            </div>
        );
    }
}


function Section(state: any) {
    return (
        // @ts-ignore
        <div dangerouslySetInnerHTML={state}/>
    )
}

function LandingElems(data: Array<landingInterface>, fetchContentData: any, changeSection: any) {
    let array = [[], [], []]
    for (let i = 0; i < data.length; i++) {
        // @ts-ignore
        array[i % 3][Math.floor(i / 3)] = <div className="col" key={i}>{LandingElem(data[i], fetchContentData, changeSection)}</div>
    }
    return <div className="row landing" id="landing">
        <h1 id="landingH1">Ancient Greece</h1>
        <p>Ancient Greece (Greek: Ἑλλάς, romanized: Hellás) was a civilization belonging to a period of Greek history
            from the Greek Dark Ages of the 12th–9th centuries BC to the end of antiquity (c. AD 600).</p>
        <div className="col-4 landingCol">{array[0]}</div>
        <div className="col-4 landingCol">{array[1]}</div>
        <div className="col-4 landingCol">{array[2]}</div>
    </div>
}


function LandingElem(data: landingInterface, fetchContentData: any, changeSection: any) {
    return (
        <div className="landingElem">
            <img src={data.img} className="landingImages"/>
            <div className="landingText">
                <h4>{data.heading}</h4>
                <p>{data.description}</p>
                <button className="btn btn-outline-dark" onMouseOver={() => fetchContentData(data.key)} onClick={() => changeSection(data.key)}>See more
                </button>
            </div>
        </div>
    )
}



let philosophyData: firebase.firestore.DocumentData[] = []

class Philosophy extends Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            isReady: false
        }
    }

    componentDidMount() {
        if (!philosophyData.length) this.getData()
        else this.changeStateToReady()
    }

    getData = async () => {
        let dataArr = await getProcessedCol('people')
        philosophyData = dataArr;
        console.log(this.state)
        console.log(philosophyData)
        this.changeStateToReady()
    }

    changeStateToReady = () => {
        this.setState({isReady: true})
    }

    changeUpvote(key: number, name: string) {
        upvote({name: name}).then((data) => this.rest(data, key))
    }

    down(key: number, name: string) {
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
                <div className="person container">
                    <div className="person-card landingElem">
                        <div className='row container-md'>
                            <div className="col-md-3">
                                <img src={elem.img} className="pimg"/>
                            </div>
                            <div className="col-md-9">
                                <h4>{elem.name}</h4>
                                <span>Favor: {elem.reputation}
                                    <button className='btn btn-outline-success butn' onClick={() => {this.changeUpvote(key, elem.name)}}>Upvote</button>
                                    <button className='btn btn-outline-danger butn' onClick={() => {this.down(key, elem.name)}}>Downvote</button></span>
                                <hr />
                                {elem.description.map((par: string, i: number) => {
                                    return (<p key={i}>{par}</p>)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    render() {
        if (this.state.isReady) {
            let cards = this.createCards(philosophyData)
            console.log(cards)
            return (
                // <p>rend</p>
                // {cards}
                <div>
                    <h3 className="p">This list contains famous ancient Greeks ordered by upvotes</h3>
                    {cards}
                </div>
            )
        }
        else return <p onClick={() => this.setState({ready: true})}>Loading</p>
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
            <br />
            <br />
            <p>This is the footer</p>
            <br />
        </footer>
    )
}


class NavBar extends Component<any, any> {
    buildSections() {
        let lis = navBarElems.map((elem, key) => {
            return <li key={key} className='nav-item'>
                <button className='btn btn-dark' onMouseOver={() => this.props.fetchContentData(key)}
                        onClick={() => this.props.changeSection(key)}>{elem.text}</button>
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
