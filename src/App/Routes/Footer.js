// Components/Users/Footer/Footer.js
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 ">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} MakeMyPlane. All rights reserved.
        </p>
        <div className="mt-2 space-x-4 text-sm text-gray-400">
          <span className="cursor-pointer hover:text-white">Privacy</span>
          <span className="cursor-pointer hover:text-white">Terms</span>
          <span className="cursor-pointer hover:text-white">Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
