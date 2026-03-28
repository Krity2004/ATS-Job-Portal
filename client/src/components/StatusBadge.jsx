const statusColors = {
  applied: "bg-blue-100 text-blue-800",
  shortlisted: "bg-yellow-100 text-yellow-800",
  r1_cleared: "bg-orange-100 text-orange-800",
  r2_cleared: "bg-purple-100 text-purple-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-600",
};

const statusLabels = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  r1_cleared: "R1 Cleared",
  r2_cleared: "R2 Cleared",
  hired: "Hired",
  rejected: "Rejected",
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  closed: "Closed",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
