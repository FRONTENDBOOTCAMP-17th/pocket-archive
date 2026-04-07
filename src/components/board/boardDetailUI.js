export const Comment = (comment, currentUserId) => {
  // localStorage의 userId와 댓글 작성자 ID 비교 (문자열 타입 일치화)
  const isMyComment = String(comment.userId) === String(currentUserId);
  console.log(currentUserId);
  return `
    <div id="comment-container-${comment.commentId}" class="bg-[#F8F9FA] rounded-2xl border border-gray-100" 
         style="padding: 20px 24px; margin-bottom: 5px;">
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center gap-2">
          <span class="font-bold text-gray-800 text-[15px]">${comment.nickname}</span>
          <span class="text-xs text-gray-400 font-medium">
            ${comment.createdAt ? comment.createdAt.split("T")[0].replace(/-/g, ".") : ""}
          </span>
          
          ${
            isMyComment
              ? `
            <span class="text-[10px] text-gray-300">|</span>
            <div id="comment-btns-${comment.commentId}" class="flex gap-2">
              <button onclick="toggleEditMode(${comment.commentId})" 
                      class="text-[11px] text-gray-400 hover:text-[#05B29F] font-bold transition-colors">수정</button>
              <button onclick="handleDeleteComment(${comment.commentId})" 
                      class="text-[11px] text-gray-400 hover:text-red-500 font-bold transition-colors">삭제</button>
            </div>
          `
              : ""
          }
        </div>
      </div>
      <p id="comment-content-${comment.commentId}" class="text-gray-600 text-[14px] text-left leading-relaxed whitespace-pre-wrap">${comment.content}</p>
    </div>
  `;
};

export const BoardDetailContent = (post) => {
  console.log(post);
  const isLiked = post.isFavorited === true;

  const currentUserId = localStorage.getItem("userId");
  const isMyPost = String(post.userId) === String(currentUserId);

  return `
   <div class="flex w-full flex-col items-start shrink-0 rounded-2xl bg-white shadow" style="padding: 32px; gap: 32px;">
      
      <button id="write-back-btn" onclick="history.back()" class="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-500 hover:bg-[#05B29F]/10 hover:text-[#05B29F] transition-all text-sm font-bold">
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
        목록으로 돌아가기
      </button>
    ${
      isMyPost
        ? `<div class="flex gap-3"><button onclick="handleEditPost(${post.postId})" class="text-sm text-gray-400 hover:text-[#05B29F] font-bold transition-colors">수정</button>
                <button onclick="handleDeletePost(${post.postId})" class="text-sm text-gray-400 hover:text-red-500 font-bold transition-colors">삭제</button>
           </div>
            `
        : ""
    }
      <div class="flex flex-col w-full" style="gap: 16px;">
        <div class="flex flex-col items-start" style="gap: 8px;">
          <span class="inline-block px-3 py-1 bg-red-50 text-red-400 text-[11px] font-bold rounded-md">
            ${post.category}
          </span>
          <h1 class="text-3xl font-bold text-[#1a3a35] leading-tight">
            ${post.title}
          </h1>
        </div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-gray-400 text-sm gap-2">
          <div class="flex items-center gap-4">
            <span class="font-bold text-gray-700 text-[16px]">${post.nickname}</span>
            <span class="text-gray-200">|</span>
            <span class="font-medium">${post.createdAt ? post.createdAt.split("T")[0] : ""}</span>
          </div>
          <div class="font-medium">
            조회수 <span class="text-gray-600 font-bold ml-1">${post.viewCount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div class="w-full border-t border-gray-50"></div>

      <div class="flex flex-col w-full" style="gap: 24px;">
        <div class="text-gray-700 leading-relaxed text-[16px] md:text-[17px] whitespace-pre-wrap text-left w-full">${post.content.trim()}</div>

        ${
          post.ImgUrls && post.ImgUrls.length > 0
            ? `<div class="w-full rounded-2xl overflow-hidden border border-gray-100">
                 <img src="${post.ImgUrls[0]}" alt="게시글 이미지" class="w-full h-auto block">
               </div>`
            : ""
        }
      </div>

      <div class="flex w-full" style="gap: 16px;">
        <button id="post-like-btn" class="flex-1 flex items-center justify-center gap-3 rounded-lg border border-[#D1D5DC] bg-white hover:bg-gray-50 transition-all active:scale-[0.98] group" style="height: 60px;">
          <span class="text-xl md:text-2xl" style="line-height: 1;">
             ${isLiked ? "❤️" : "🤍"}
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
  <div class="px-6 md:px-10 lg:px-[60px]" style="padding-bottom: 60px;">
    <h3 class="font-black text-gray-900 text-lg md:text-xl" style="margin-bottom: 32px;">
      댓글 <span class="text-gray-400 font-medium ml-1">${comments.length}</span>
    </h3>
    
    <div style="margin-bottom: 40px;">
      ${
        comments.length > 0
          ? comments.map((c) => Comment(c, currentUserId)).join("")
          : "<p class='text-center py-10 text-gray-400'>아직 댓글이 없습니다.</p>"
      }
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
