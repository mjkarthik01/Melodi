import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AnimatedRoutes({ children }) {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/dashboard/admin/") ||
    location.pathname.startsWith("/dashboard/user/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        onAnimationComplete={() => {
          const el = document.getElementById("main-scroll");
          if (el) el.scrollTop = 0;
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
