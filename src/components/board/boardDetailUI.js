import { escapeHtml } from '../../utils/escapeHtml.js';
import { categoryMap } from '../../utils/boardConstants.js';

//카드 내부에 포켓몬 배치
const SLOT_POSITIONS = [
  { top: '35%', left: '4%' },
  { top: '35%', left: '25%' },
  { top: '35%', left: '46%' },
  { top: '54%', left: '4%' },
  { top: '54%', left: '25%' },
  { top: '54%', left: '46%' },
];

export const Comment = (comment, currentUserId) => {
  const isMyComment = String(comment.userId) === String(currentUserId);
  return `
    <div id="comment-container-${comment.commentId}" class="bg-[#F8F9FA] rounded-2xl border border-gray-100" 
         style="padding: 20px 24px; margin-bottom: 5px;">
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center gap-2">
          <span class="font-bold text-gray-800 text-[15px]">${comment.nickname}</span>
          <span class="text-xs text-gray-400 font-medium">
            ${comment.createdAt ? comment.createdAt.split('T')[0].replace(/-/g, '.') : ''}
          </span>
          
          ${
            isMyComment
              ? `
            <span class="text-[10px] text-gray-300">|</span>
            <div id="comment-btns-${comment.commentId}" class="flex gap-2">
              <button data-action="edit-comment" data-comment-id="${comment.commentId}" class="text-[11px] text-gray-400 hover:text-[#05B29F] font-bold transition-colors">수정</button>
              <button data-action="delete-comment" data-comment-id="${comment.commentId}" class="text-[11px] text-gray-400 hover:text-red-500 font-bold transition-colors">삭제</button>
            </div>
          `
              : ''
          }
        </div>
      </div>
      <p id="comment-content-${comment.commentId}" class="text-gray-600 text-[14px] text-left leading-relaxed whitespace-pre-wrap">${escapeHtml(comment.content)}</p>
    </div>
  `;
};

// spriteMap: { [pokemonId]: imageUrl } — boardDetail.js에서 미리 fetch해서 넘겨
export const BoardDetailContent = (post, currentUserId, spriteMap = {}) => {
  const isLiked = post.isFavorited === true;
  const isMyPost = String(post.userId) === String(currentUserId);

  // 트레이너 카드 HTML
  const trainerCardHtml = post.preset
    ? `
      <div style="width: 100%; max-width: 600px; margin: 24px auto;">
        ${
          post.preset.deckname
            ? `<p style="font-size: 13px; font-weight: 700; color: #6b7280; margin-bottom: 8px; text-align: center;">
                  ${post.preset.deckname}
               </p>`
            : ''
        }
        <div style="position: relative; width: 100%; border-radius: 12px; overflow: hidden;">
          <img
            src="${post.preset.gender === 'woman' ? '/assets/trianercard_woman.png' : '/assets/trianercard_man.png'}"
            alt="trainer-card"
            style="display: block; width: 100%; height: auto; user-select: none;"
          />
          ${SLOT_POSITIONS.map((pos, i) => {
            const id = post.preset.pocketmons?.[i];
            const url = id ? spriteMap[id] : null;
            return `
              <div style="
                position: absolute;
                top: ${pos.top};
                left: ${pos.left};
                width: 20%;
                height: 17%;
              ">
                ${url ? `<img src="${url}" alt="pokemon-${id}" style="width: 100%; height: 100%; object-fit: contain; padding: 4px;"/>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `
    : '';

  return `
   <div class="flex w-full flex-col items-start shrink-0 rounded-2xl bg-white shadow" style="padding: 32px; gap: 32px;">
      
      <button id="write-back-btn" onclick="location.href='/board'" class="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-500 hover:bg-[#05B29F]/10 hover:text-[#05B29F] transition-all text-sm font-bold">
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
        목록으로 돌아가기
      </button>
 
      <div class="flex flex-col w-full" style="gap: 16px;">
        <div class="flex flex-col items-start" style="gap: 8px;">
          <span class="inline-block px-3 py-1 bg-red-50 text-red-400 text-[11px] font-bold rounded-md">
            ${escapeHtml(categoryMap[post.category] ?? post.category)}
          </span>
          <div class="flex items-center justify-between w-full">
            <h1 class="text-3xl font-bold text-[#1a3a35] leading-tight flex-1">
              ${escapeHtml(post.title)}
            </h1>
            ${
              isMyPost
                ? `<div class="flex items-center gap-3 ml-4 shrink-0">
                    <button data-action="edit-post" data-post-id="${post.postId}" class="text-sm text-gray-400 hover:text-[#05B29F] font-bold transition-colors">수정</button>
                    <button data-action="delete-post" data-post-id="${post.postId}" class="text-sm text-gray-400 hover:text-red-500 font-bold transition-colors">삭제</button>
                  </div>`
                : ''
            }
        </div>
 
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-gray-400 text-sm gap-2">
          <div class="flex items-center gap-4">
            <span class="font-bold text-gray-700 text-[16px]">${escapeHtml(post.nickname)}</span>
            <span class="text-gray-200">|</span>
            <span class="font-medium">${post.createdAt ? escapeHtml(post.createdAt.split('T')[0]) : ''}</span>
          </div>
          <div class="font-medium">
            조회수 <span class="text-gray-600 font-bold ml-1">${post.viewCount?.toLocaleString()}</span>
          
            </div>
        </div>
      </div>
 
      <div class="px-6 md:px-10 lg:px-15" style="padding-top: 40px; padding-bottom: 60px; display: block; min-height: 400px; position: relative;">
        <div class="text-gray-700 leading-relaxed text-[16px] md:text-[17px] whitespace-pre-wrap" 
             style="margin-top: 0; margin-bottom: 60px; text-align: left; width: 100%; display: block;">
${escapeHtml(post.content.trim())}</div>
 
        ${
          post.imgUrl
            ? `<div class="w-full rounded-3xl md:rounded-4xl overflow-hidden border border-gray-100" 
                    style="margin-bottom: 60px; display: block;">
                 <img src="${post.imgUrl}" alt="게시글 이미지" style="width: 100%; height: auto; display: block;">
               </div>`
            : ''
        }
      </div>
 
      <!-- 트레이너 카드 -->
      ${trainerCardHtml}
 
      <div class="flex w-full" style="gap: 16px;">
        <button id="post-like-btn" class="flex-1 flex items-center justify-center gap-3 rounded-lg border border-[#D1D5DC] bg-white hover:bg-gray-50 transition-all active:scale-[0.98] group" style="height: 60px;">
          <span class="text-xl md:text-2xl" style="line-height: 1;">
             ${isLiked ? '❤️' : '🤍'}
          </span>
          <span class="font-black text-[#1a3a35] text-[18px]">
             ${post.favoriteCount || 0}
          </span>
        </button>
      </div>
 
    </div>
  `;
};

export const CommentSection = (comments = [], currentUserId) => `
  <div class="px-6 md:px-10 lg:px-15" style="padding-bottom: 60px;">
    <h3 class="font-black text-gray-900 text-lg md:text-xl" style="margin-bottom: 32px;">
      댓글 <span class="text-gray-400 font-medium ml-1">${comments.length}</span>
    </h3>
    
    <div style="margin-bottom: 40px;">
      ${comments.length > 0 ? comments.map((c) => Comment(c, currentUserId)).join('') : "<p class='text-center py-10 text-gray-400'>아직 댓글이 없습니다.</p>"}
    </div>
 
    <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white" 
         style="margin-bottom: 5px;">
      <textarea id="commentInput" placeholder="댓글을 입력하세요..." 
        class="w-full h-32 p-5 focus:outline-none resize-none text-gray-700 placeholder:text-gray-300 border-none" 
        style="display: block; padding:10px"></textarea>
    </div>
    
    <button id="submitComment" class="w-full py-4 bg-[#05B29F] text-white font-bold rounded-xl hover:bg-[#049686] transition-all active:scale-95 text-base md:text-lg shadow-sm shadow-emerald-100">
      댓글 작성
    </button>
  </div>
`;
