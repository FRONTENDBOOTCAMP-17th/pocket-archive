export function Login() {
  return `
    <main class="w-screen min-h-screen flex flex-col items-center justify-center gap-5 bg-[linear-gradient(135deg,#FEF2F2_0%,#FFF_50%,#FFF7ED_100%)]">

      <!-- icon & header -->
      <div class="flex flex-col items-center gap-2">
        <a href="/" data-page="home" class="flex flex-col items-center gap-2 no-underline">
          <img src="/assets/pocketarchive.png" alt="포켓아카이브" class="h-25 w-auto" />
          <h1 class="text-xl font-bold text-[#1a3a35]">포켓 아카이브</h1>
        </a>
        <p class="text-xs text-[#5a8a82] tracking-widest text-center">포켓몬 트레이너 커뮤니티에<br class="hidden max-[315px]:block"> 오신 것을 환영합니다!</p>
      </div>

      <!-- login box -->
      <div class="bg-white rounded-xl border-t-8 border-b-8 border-[#00BBA7] shadow-[0_8px_32px_rgba(0,187,167,0.15)] flex flex-col items-start gap-6 w-md max-[501px]:w-[calc(100vw-32px)] max-[501px]:h-auto max-[501px]:px-5 max-[501px]:pb-6 p-8">

        <h2 class="text-2xl font-bold text-[#00BBA7] mb-1">로그인</h2>

        <form name="form1" class="w-full flex flex-col gap-4">
          <!-- ID -->
          <div class="flex h-24 flex-col items-start gap-2 shrink-0 self-stretch">
            <p class="text-s">아이디</p>
            <input
              type="text"
              name="login_id"
              placeholder="아이디를 입력하세요"
              class="w-full h-12 bg-[#f4faf9] border border-[#d0eeea] rounded-lg mb-3 text-sm text-[#1a3a35] placeholder-[#aac8c3] outline-none focus:border-[#00BBA7] transition-colors pl-3 pr-4"
            />
          </div>

          <!-- Password -->
          <div class="flex h-24 flex-col items-start gap-2 shrink-0 self-stretch">
            <p class="text-s">비밀번호</p>
            <div class="relative mb-3 w-full">
              <input
                type="password"
                id="pwd"
                name="password"
                placeholder="비밀번호를 입력하세요"
                class="w-full h-12 bg-[#f4faf9] border border-[#d0eeea] rounded-lg pr-11 text-sm text-[#1a3a35] placeholder-[#aac8c3] outline-none focus:border-[#00BBA7] transition-colors pl-3"
              />
              <button type="button" id="eye" aria-label="비밀번호 표시"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#aac8c3] hover:text-[#00BBA7] transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                  <line id="eye-slash" x1="4" y1="4" x2="20" y2="20" stroke-dasharray="24" stroke-dashoffset="24" class="[transition:stroke-dashoffset_0.2s]"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <p id="msg" class="hidden text-s text-red-500 bg-red-50 rounded-md px-3 py-2 mb-3" h-8></p>

          <!-- Remember me -->
          <label class="flex items-center gap-2 mb-5 cursor-pointer">
            <input type="checkbox" class="hidden" />
            <span class="w-5 h-5 border-2 border-[#b0d8d3] rounded-sm inline-block relative shrink-0 [input:checked+&]:before:content-['✓'] [input:checked+&]:before:absolute [input:checked+&]:before:text-[#00BBA7] [input:checked+&]:before:text-sm [input:checked+&]:before:-top-1 [input:checked+&]:before:left-0"></span>
            <small class="text-m text-[#5a8a82]">Remember me</small>
          </label>

          <!-- Login button -->
          <button type="submit"
            class="w-full h-12 bg-[#00BBA7] hover:bg-[#009e8d] text-white rounded-full text-base font-bold transition-colors cursor-pointer border-0 mb-5">
            로그인
          </button>

          <!-- join the membership -->
          <div class="flex items-center justify-center gap-2 text-sm">
            <p class="text-[#8a9a98] m-0">계정이 없으신가요?</p>
            <button type="button"
              class="bg-transparent border-0 text-[#00BBA7] hover:text-[#009e8d] text-sm underline cursor-pointer p-0"
              id="registerBtn">
              회원가입
            </button>
          </div>
        </form>
      </div>

      <!-- footer -->
      <p class="text-xs text-[#8a9a98]">포켓몬 마스터가 되는 여정을 시작하세요!</p>

    </main>
  `;
}
