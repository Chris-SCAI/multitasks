"use client";

import { motion } from "framer-motion";

// noindex metadata is set via a separate metadata file (not possible in "use client")
// robots.txt already disallows /login and /register

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0B1120] px-4">
      <meta name="robots" content="noindex, nofollow" />
      {/* Multiple animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/4 -translate-x-1/2"
        >
          <div className="h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -20, 30, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 top-1/2"
        >
          <div className="h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
        </motion.div>
        <motion.div
          animate={{ x: [0, 15, -25, 0], y: [0, -15, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -right-10 bottom-1/4"
        >
          <div className="h-[350px] w-[350px] rounded-full bg-purple-600/8 blur-[100px]" />
        </motion.div>
      </div>

      {/* Grid dot pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {children}
    </div>
  );
}
