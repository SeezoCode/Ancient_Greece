import logo from './logo.svg';
import './App.css';
import { Component } from 'react'


interface SectionInterface {
  h1?: string,
  header: string,
  paragraphs: Array<string>,
  image?: string,
  customHTMLs: Array<string>
}


interface StateInterface {
  current: number,
  cache: Array<NavBarElemInterface>
}

interface NavBarElemInterface {
  text: string,
  dataAt: string,
  pendingFetch: boolean,
  savedData?: Array<SectionInterface>
}

let navBarElems = [
  {
    text: 'Roman Empire',
    pendingFetch: false,
    dataAt: 'http://127.0.0.1:8080/roman_empire.json'
  },
  {
    text: 'History',
    pendingFetch: false,
    dataAt: 'http://127.0.0.1:8080/history.json'
  },
  {
    text: 'Geography',
    pendingFetch: false,
    dataAt: 'http://127.0.0.1:8080/geography.json'
  },
]



async function getDescription(link: string): Promise<Array<SectionInterface>> {
  let response = await fetch(link)
  return response.json()
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
  }

  componentDidMount() {
    this.fetchContentData(0)
  }

  fetchContentData(key: number) {
    console.log(key, this.state)
    let currentContext = this.state.cache[key]
    if (currentContext.savedData) {
      this.setState({current: key})
      console.log('from cache')
    }
    else {
      getDescription(currentContext.dataAt).then((data) => {
        let cache = this.state
        cache.cache[key].savedData = data
        this.setState(cache)
        this.setState({current: key})
      })
    }
  }

  renderSections() {
    let data = this.state.cache[this.state.current].savedData
    if (data) return Sections(data)
  }

  render() {
    return (
        <div className="App">
          <NavBar fetchContentData={this.fetchContentData} />
          <div className="container">
            <button onClick={() => {this.fetchContentData(1)}}>change</button>
            {this.renderSections()}
          </div>
        </div>
    );
  }
}


function Sections(state: Array<SectionInterface>) {
  let secs = state.map((elem, key) => {
    return <div key={key}>{Section(elem)} {elem.image && <img src={elem.image} />}</div>
  })
  return (
      <div>
        <h1>{state[0]["h1"]}</h1>
        {secs}
      </div>
  )
}

function Section(state: SectionInterface) {
  let pars = state.paragraphs.map((par, key) => {
    return <p key = {key}>{par}</p>
  })
  return (
      <div>
        <h2>{state.header}</h2> <hr />
        {pars}
      </div>
  )
}


class NavBar extends Component<any, any>{
  buildSections() {
    let lis = navBarElems.map((elem, key) => {
      return <li key={key} className='nav-item'>
        <button className='btn btn-light' onClick={() => this.props.fetchContentData(key)}>{elem.text}</button></li>
    })
    return <ul className="navbar-nav">{lis}</ul>
  }

  render() {
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
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
