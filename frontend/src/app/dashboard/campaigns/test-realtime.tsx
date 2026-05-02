"use client"

import { useEffect } from "react"
import { useCampaignsRealtime } from "@/lib/hooks/useCampaignsRealtime"

// This is a test component to verify real-time functionality
export function TestRealtimeCampaigns() {
  const { campaigns, loading, error } = useCampaignsRealtime()

  useEffect(() => {
    console.log("Campaigns updated:", campaigns)
  }, [campaigns])

  if (loading) return <div>Loading campaigns...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Real-time Campaigns Test</h2>
      <p>Number of campaigns: {campaigns.length}</p>
      <ul>
        {campaigns.map(campaign => (
          <li key={campaign.campaign_id}>
            {campaign.campaign_name} - {campaign.status}
          </li>
        ))}
      </ul>
    </div>
  )
}