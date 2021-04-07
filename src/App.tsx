import logo from './logo.svg';
import './App.css';
import {Component} from 'react'


interface StateInterface {
    current: number,
    cache: Array<NavBarElemInterface>
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

let navBarElems = [
    {
        text: 'Roman Empire',
        type: 'landingPage',
        dataAt: 'http://127.0.0.1:8080/roman_empire.json'
    },
    {
        text: 'History',
        type: 'html',
        dataAt: 'http://127.0.0.1:8080/history.html'
    },
    {
        text: 'Geography',
        type: 'html',
        dataAt: 'http://127.0.0.1:8080/geography.html'
    },
    {
        text: 'Philosophers',
        type: 'json',
        dataAt: 'http://127.0.0.1:8080/philosophers.json'
    },
]


async function getDescription(link: string): Promise<string> {
    let response = await fetch(link)
    return response.text()
}


class App extends Component {
    state: StateInterface

    constructor(props: any) {
        super(props);
        this.state = {
            current: 0,
            cache: navBarElems,
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
    console.log(array)
    return <div className="row landing">
        <div className="col-4 landingCol">{array[0]}</div>
        <div className="col-4 landingCol">{array[1]}</div>
        <div className="col-4 landingCol">{array[2]}</div>
    </div>
}


function LandingElem(data: landingInterface, fetchContentData: any, changeSection: any) {
    return (
        <div className="landingElem">
            <img src={data.img} className="landingImages"/>
            <h4>{data.heading}</h4>
            <p>{data.description}</p>
            <button className="btn btn-light" onMouseOver={() => fetchContentData(data.key)} onClick={() => changeSection(data.key)}>See more
            </button>
        </div>
    )
}


function Footer() {
    return (
        <footer>
            <br />
            <p>This is the footer</p>
            <br />
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
