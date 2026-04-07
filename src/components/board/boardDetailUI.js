import { escapeHtml } from '../../utils/escapeHtml.js';

export const Comment = (comment) => `
  <div class="bg-[#F8F9FA] rounded-2xl border border-gray-100"
       style="padding: 20px 24px; margin-bottom: 5px;">
    <div class="flex justify-between items-center mb-2">
      <span class="font-bold text-gray-800 text-[15px]">${escapeHtml(comment.authorNickname)}</span>
      <span class="text-xs text-gray-400 font-medium">
        ${comment.createdAt ? escapeHtml(comment.createdAt.split('T')[0].replace(/-/g, '.')) : ''}
      </span>
    </div>
    <p class="text-gray-600 text-[14px] text-left leading-relaxed">${escapeHtml(comment.content)}</p>
  </div>
`;

export const BoardDetailContent = (post) => {
  const isLiked = post.isFavorite || false;

  return `
   <div class="border-b border-gray-50 px-6 md:px-10 lg:px-[60px]" style="padding-top: 60px; padding-bottom: 20px; display: block;">
      <div style="text-align: left;">
        <div style="margin-bottom: 16px;">
          <span class="inline-block px-3 py-1 bg-red-50 text-red-400 text-[11px] font-bold rounded-md">
            ${escapeHtml(post.category)}
          </span>
        </div>

        <h1 class="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight"
            style="margin-bottom: 30px; text-align: left; width: 100%;">
          ${escapeHtml(post.title)}
        </h1>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-gray-400 text-sm gap-2">
          <div class="flex items-center gap-4">
            <span class="font-bold text-gray-700 text-[16px]">${escapeHtml(post.author)}</span>
            <span class="text-gray-200">|</span>
            <span class="font-medium">${post.createdAt ? escapeHtml(post.createdAt.split('T')[0]) : ''}</span>
          </div>
          <div class="font-medium">
            조회수 <span class="text-gray-600 font-bold ml-1">${post.viewCount?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 lg:px-[60px]" style="padding-top: 40px; padding-bottom: 60px; display: block; min-height: 400px; position: relative;">
      
      <div class="text-gray-700 leading-relaxed text-[16px] md:text-[17px] whitespace-pre-wrap" 
           style="margin-top: 0; margin-bottom: 60px; text-align: left; width: 100%; display: block;">
${escapeHtml(post.content.trim())}</div>

      ${
        post.ImgUrls && post.ImgUrls.length > 0
          ? `<div class="w-full rounded-[24px] md:rounded-[32px] overflow-hidden border border-gray-100" 
                  style="margin-bottom: 60px; display: block;">
               <img src="${post.ImgUrls[0]}" alt="게시글 이미지" style="width: 100%; height: auto; display: block;">
             </div>`
          : ''
      }

      <div style="width: 100%; margin-top: auto; ">
        <button class="w-full flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-gray-50 transition-all active:scale-[0.98] group" 
                style="padding: 16px 0; height: 60px; border: 1px solid #D1D5DB; margin-top: 10px;">
          <span class="text-xl md:text-2xl" style="line-height: 1;">
             ${isLiked ? '❤️' : '🤍'}
          </span>
          <span class="font-black text-gray-900 text-[18px] md:text-[20px]" style="letter-spacing: -0.5px;">
             ${post.favoriteCount || 0}
         </span>
        </button>
      </div>
    </div>
  `;
};

export const CommentSection = (comments = []) => `
  <div class="px-6 md:px-10 lg:px-[60px]" style="padding-bottom: 60px;">
    <h3 class="font-black text-gray-900 text-lg md:text-xl" style="margin-bottom: 32px;">
      댓글 <span class="text-gray-400 font-medium ml-1">${comments.length}</span>
    </h3>
    
    <div style="margin-bottom: 40px;">
      ${comments.length > 0 ? comments.map((c) => Comment(c)).join('') : "<p class='text-center py-10 text-gray-400'>아직 댓글이 없습니다.</p>"}
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
