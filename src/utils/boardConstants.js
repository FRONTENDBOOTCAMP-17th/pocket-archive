// API category key -> Korean name mapping
export const categoryMap = {
  free: '자유게시판',
  guide: '질문게시판',
  battle: '공략',
  party: '파티 공유',
};

export const reverseCategoryMap = {
  자유게시판: 'free',
  질문게시판: 'guide',
  공략: 'battle',
  파티공유: 'party',
};

// Tailwind color class mapping by category
export const categoryColors = {
  자유게시판: 'text-[#00bba7] bg-[#e6f7f5]',
  질문게시판: 'text-pink-500 bg-pink-50',
  '파티 공유': 'text-amber-500 bg-amber-50',
  파티공유: 'text-amber-500 bg-amber-50',
  공략: 'text-blue-500 bg-blue-50',
  공지: 'text-purple-500 bg-purple-50',
};

//ISO Function to convert string to 'YYYY.MM.DD' format
export function formatDate(dateStr) {
  return dateStr.split('T')[0].replace(/-/g, '.');
}
