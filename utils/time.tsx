export function formatTimeAgo(dateInput?: string | Date | null): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  let relative = "";

  if (minutes < 1) {
    relative = "vừa xong";
  } else if (minutes < 60) {
    relative = `${minutes} phút trước`;
  } else if (hours < 24) {
    relative = `${hours} giờ trước`;
  } else {
    relative = `${days} ngày trước`;
  }

  const absolute = date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${relative} • ${absolute}`;
}