import SidebarNavbar from "./SidebarNavbar";
import PropertyBanner from "./propertyBanner";

const Header = () => {
  return (
    <>
      <div className="w-full py-4 bg-white shadow-sm">
        <div className="flex justify-center items-center">
          <div className="text-2xl font-bold">PROPERTY PORTAL</div>
        </div>
      </div>

      <SidebarNavbar />
      <PropertyBanner />
    </>
  );
};

export default Header;
