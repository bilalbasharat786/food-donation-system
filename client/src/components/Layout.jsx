import Navbar from "./Navbar";

export default function Layout({ children, withNav = true }) {
  return (
    <div className="min-h-screen">
      {withNav && <Navbar />}
      <main>{children}</main>
    </div>
  );
}
