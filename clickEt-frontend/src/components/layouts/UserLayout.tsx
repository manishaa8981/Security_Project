import ClientHeader from "../common/clientHeader";
import Footer from "../common/Footer";
import { ReactNode } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" flex flex-col min-h-screen ">
      <ClientHeader />
      {children}
      <Footer />
    </div>
  );
};

export default UserLayout;
