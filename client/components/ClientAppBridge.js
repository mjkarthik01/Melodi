"use client";

import dynamic from "next/dynamic";

const ReactAppBridge = dynamic(() => import("./ReactAppBridge"), {
  ssr: false,
});

export default function ClientAppBridge() {
  return <ReactAppBridge />;
}
