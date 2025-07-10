'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface ToggleApprovalButtonProps {
  propertyId: string;
  action: 'approve' | 'unapprove';
}

export default function ToggleApprovalButton({ propertyId, action }: ToggleApprovalButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    await fetch(`/api/property/${propertyId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action }),
    });

    startTransition(() => {
      router.refresh(); // refreshes server component
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded text-white cursor-pointer ${
        action === 'approve'
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-red-600 hover:bg-red-700'
      }`}
      disabled={isPending}
    >
      {isPending ? 'Updating...' : action === 'approve' ? 'Approve' : 'Unapprove'}
    </button>
  );
}
