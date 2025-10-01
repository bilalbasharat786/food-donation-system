import { useState } from "react";
import Navbar from "./Navbar";

export default function Layout({ children, withNav = true }) {
  // Sidebar open/close ka state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout-wrapper">
      {withNav && <Navbar onToggle={setIsSidebarOpen} />}

      {/* Main content ko sidebar ke hisaab se shift karna */}
      <main
        className={`main-content ${isSidebarOpen ? "shifted" : "normal"}`}
      >
        {/* Child (Dashboard, Donors, etc.) ko bhi state pass karenge */}
        {children &&
          (Array.isArray(children)
            ? children.map((child) =>
                child
                  ? { ...child, props: { ...child.props, isSidebarOpen } }
                  : null
              )
            : { ...children, props: { ...children.props, isSidebarOpen } })}
      </main>
    </div>
  );
}

