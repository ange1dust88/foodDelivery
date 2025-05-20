import { Link } from "react-router-dom"
interface SmallHeaderTypes {
  isBlack: boolean;
}

function SmallHeader( {isBlack} : SmallHeaderTypes) {
  return (
    <>
      {isBlack  ? (
      <div className="h-(--header-height) fixed top-0 bg-black w-full flex justify-start items-center px-12 shadow-xs">
          <Link to = '/'><h2 className='text-2xl font-stretch-ultra-condensed text-white'>Smaczne <b>Kielce</b></h2></Link>
      </div>
      ):
      (
        <div className="h-(--header-height) fixed top-0 bg-white w-full flex justify-center items-center px-12 shadow-xs">
          <Link to = '/' className='text-2xl font-stretch-ultra-condensed text-black'>Smaczne <b>Kielce</b></Link>
        </div>
      )}
    </>

  )
}

export default SmallHeader
