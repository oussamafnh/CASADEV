import '../../style/home.css'
import FiltreAndSearch from './FiltreAndSearch'
import Homeposts from './homeposts'
import Profilehomepage from './profilehomepage'

const Home = () => {
  return (
    <div className='Homediv'>
        <div className="homecontainer">
          <Profilehomepage />

          <Homeposts />

          <FiltreAndSearch />

        </div>
    </div>
  )
}

export default Home