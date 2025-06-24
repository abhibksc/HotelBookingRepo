import { Routes, Route } from "react-router-dom";
import NotFound from "../../Errors/NotFound";
import Hotel from "../../Components/Users/Hotels/Hotel/Hotel";
import User from "../../Components/Users/User/User";
import Header from "../../Components/Users/Hotels/Header/Header";
import MainNavigation from "./MainNavigation";
import Booking from "../../Components/Users/Hotels/Bookings/Booking";
import HotelCategory from "../../Components/Users/Hotels/Hotel/HotelCategory";
import HotelListings from "../../Components/Users/Hotels/Hotel/HotelListings";
import ParticularHotel from "../../Components/Users/Hotels/Hotel/ParticularHotel";
import HeroText from "./HeroText";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Cart from "../../Components/Users/Hotels/Bookings/Cart";

const MainPage = () => {
  return (
    <div className="flex flex-col  bg-white">
      <div>
        <div
          className="bg-cover bg-no-repeat bg-center  flex-grow"
          style={{
            backgroundImage: `url('https://imgak.mmtcdn.com/pwa_v3/pwa_commons_assets/desktop/bg4.jpg')`,
          }}
        >
          <Header page={"MainPage"} />
          <HeroText />
          <MainNavigation />
        </div>


      </div>

      <div
        className="h-[500px] bg-contain bg-no-repeat bg-center w-full"
        style={{
          backgroundImage: `url('https://promos.makemytrip.com/images/axis-ih-tb-dt-020424.webp')`,
        }}
      ></div>

      
    </div>
  );
};

const MytripRoute = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow">
          <Header page={"MytripRoute"} />
        <Routes>
          <Route path="/Category" element={<HotelCategory />} />
          <Route path="/Category/:id/hotels" element={<HotelListings />} />
          <Route path="/Category/:id/hotel/:id" element={<ParticularHotel />} />
        </Routes>
      </div>
    </div>
  );
};

const BookingRoute = () => {
    const userToken = useSelector((state) => state.auth.tokens.userToken);
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow">
             <Header page={"BookingRoute"} />
        <Routes>
             <Route path={`Cart/${userToken}`} element={<Cart />} />
        </Routes>
      </div>
    </div>
  );
};

const Mytrip_user = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<User />} />
        </Routes>
      </div>
    </div>
  );
};

const DesktopRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mytrip/*" element={<MytripRoute />} />
          {/* <Route path="/mytrip-user/*" element={<Mytrip_user />} /> */}
          <Route path="/bookings/*" element={<BookingRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer /> {/* 👈 Dummy footer here */}
      </div>
    </div>
  );
};

export default DesktopRoutes;
