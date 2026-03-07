/**
 * Shared utility functions for activity pages (enquiries, appointments, visits, quotations).
 */

/**
 * Returns a label + className for a time badge based on how long ago a date was.
 * Used in list pages for enquiries, appointments, visits, quotations.
 */
export function getTimeBadge(
  date: string,
  t: (key: string) => string,
): { label: string; className: string } {
  const diffInDays = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24),
  );
  if (diffInDays < 1)
    return { label: t("new"), className: "bg-[#FFA500] text-white" };
  if (diffInDays < 7)
    return {
      label: `${diffInDays}d ago`,
      className: "bg-[#1A237E] text-white",
    };
  return {
    label: `${Math.floor(diffInDays / 7)}w ago`,
    className: "bg-[#BDBDBD] text-white",
  };
}
