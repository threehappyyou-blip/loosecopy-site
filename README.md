# Loosecopy 유틸 2종

## 1. ai-authenticity-checker.html — 독립 무료 툴
바로 loosecopy.com에 별도 페이지(예: `/ai-checker`)로 올려서 쓰는 완성형 툴입니다.
텍스트를 붙여넣으면 AI스러운 클리셰 문구·과장 표현·em dash 남용·삼항 나열 반복 등을
하이라이트하고, 100단어당 밀도 기준으로 "Reads pretty clean" ~ "Lots of common AI
tells" 4단계 평가를 보여줍니다. 완전히 클라이언트 사이드(JS만)라 서버 비용 없이 SEO용
랜딩으로 바로 쓸 수 있고, 결과 화면 하단에 Loosecopy 본 서비스로 연결되는 CTA가
이미 들어 있습니다.

- 레딧에서 AI 콘텐츠로 플래그당했던 사연과 정확히 맞아떨어지는 툴이라 브랜드 스토리와
  자연스럽게 연결됩니다.
- 플래그 문구 목록(`PHRASES` 배열)은 코드 상단에 있어서 필요하면 바로 추가/삭제 가능합니다.
- "확정된 AI 탐지기가 아니다"라는 디스클레이머를 의도적으로 넣어뒀습니다 — 과신뢰를
  주지 않기 위한 장치이니 문구를 빼지 마세요.

## 2. thread-splitter-char-counter.html — app.html 통합용 위젯
독립 페이지가 아니라 기존 app.html의 결과 검토 textarea에 붙이는 용도로 설계했습니다.
- 타이핑하는 동안 Twitter/X·LinkedIn·Threads·Instagram 글자 수 실시간 표시
- "Split into Twitter/X thread" 버튼으로 280자 기준 자동 분할 + (1/N) 번호 매김
- 이미 확정된 "검토·수정 완료 체크박스" 게이트 바로 위/아래에 배치하면 자연스럽습니다

`<script>` 안의 `LIMITS`, `updateCounters()`, `splitIntoTweets()` 세 부분만 그대로
가져다 붙이면 됩니다. 나머지 HTML/CSS는 참고용 데모 화면입니다.

## 다음에 확인할 것
- ai-authenticity-checker를 실제로 올릴 경로/서브도메인 결정
- PHRASES 목록에 자신이 자주 겪는 AI 클리셰 몇 개 더 추가해서 정확도 올리기
- 위젯을 app.html에 붙인 뒤 실제 생성 결과로 한 번 테스트
