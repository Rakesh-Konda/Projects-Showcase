import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  Loading: 'LOADING',
}

class Projects extends Component {
  state = {List: [], type: 'ALL', apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.get()
  }

  getSuccess = data => {
    const upData = data.projects.map(each => ({
      id: each.id,
      ImageUrl: each.image_url,
      name: each.name,
    }))
    console.log(upData)
    this.setState({List: upData})
  }

  getFailure = () => {
    this.setState({apiStatus: apiStatusConstants.failure})
  }

  get = async () => {
    this.setState({apiStatus: apiStatusConstants.Loading})
    const {type} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${type}`
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    if (res.ok) {
      this.setState({apiStatus: apiStatusConstants.success})
      this.getSuccess(data)
    } else {
      this.getFailure()
    }
  }

  SelectEle = event => {
    console.log(event.target.value)
    this.setState({type: event.target.value}, this.get)
  }

  Loader = () => (
    <div data-testid="loader" className="load">
      <Loader type="TailSpin" color="blue" height={50} width={50} />
    </div>
  )

  Retry = () => {
    this.get()
  }

  FailureView = () => (
    <div className="fdiv">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fail"
      />
      <h1>Oops! Something went wrong!</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="but" type="button" onClick={this.Retry}>
        Retry
      </button>
    </div>
  )

  SuccessView = () => {
    const {List} = this.state
    return (
      <div>
        <ul className="ul">
          {List.map(each => (
            <li className="li" key={each.id}>
              <img className="img" src={each.ImageUrl} alt={each.name} />
              <p className="p">{each.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  Finale = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.SuccessView()
      case apiStatusConstants.failure:
        return this.FailureView()
      case apiStatusConstants.Loading:
        return this.Loader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className="na">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <select className="sel" onChange={this.SelectEle}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.Finale()}
      </div>
    )
  }
}
export default Projects
