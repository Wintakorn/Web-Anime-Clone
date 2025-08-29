
import MangaPage from './mangapage/mangapage'

import HeroSlider from '../components/Heromanga'

const Homepage = () => {
  return (
    <div className='bg-[#161b32] px-15   py-10'>
      {/* */}
      <div className="">
        <HeroSlider />
      </div>
      <div className="mt-5 " >
        <MangaPage />
      </div>

    </div>
  )
}

export default Homepage 