import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/navBar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="relative" style={{ isolation: "isolate" }}>
        <Outlet />
      </main>
    </>
  );
}
