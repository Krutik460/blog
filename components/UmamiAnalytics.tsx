"use client"

import Script from "next/script"

export default function UmamiAnalytics() {
  return (
    <>
      <Script
        async
        src="https://analytics.krutikpatel.dev/script.js"
        data-website-id="0b3aba2e-1c7f-4f9b-93e8-e891243c5033"
      />
    </>
  )
}
