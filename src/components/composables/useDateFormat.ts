export function useDateFormat() {

  const formatDate = (date?: string | null): string => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return { formatDate };
}
