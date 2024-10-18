import '../../style/home.css'
import Homeposts from './homeposts'
import Profilehomepage from './profilehomepage'

const Home = () => {
  return (
    <div className='Homediv'>
        <div className="homecontainer">
          <Profilehomepage />

          <Homeposts />

          <div className="filtre_search">

          </div>

        </div>
    </div>
  )
}

export default Home