'use client';

import { CampaignDetail } from '../../campaign-detail';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <CampaignDetail campaignId={params.id} />
    </div>
  );
}