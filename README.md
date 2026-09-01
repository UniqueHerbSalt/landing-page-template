# 브랜딩 홈페이지 템플릿 쇼케이스

「작은 브랜드 전성시대가 온다」(가제) 원고 193p 속 브랜드 사례를 분석해 도출한
**브랜딩 홈페이지 템플릿 5유형**과, 유형별 샘플 홈페이지 모음입니다.

- 디자인 토큰: [pertential100.com](https://www.pertential100.com/) (다크 그린 `#1B4332` + 베이지 `#E8D9BE`, pill 형태 언어)
- 인터랙션: [goldenrecords.kr](https://goldenrecords.kr/) 분석 결과의 바닐라 JS 이식
  (스프링 숫자 티커 · 스크롤 리빌 · 무한 마퀴 · 카드 호버 5중주 · 스크롤 스파이 · 필터 스태거 등장 · 스파크 필드)

## 구성

| 페이지 | 유형 | 책 속 근거 |
|---|---|---|
| `index.html` | 쇼케이스 허브 | — |
| `templates/performance.html` | A · 성과·전문성 강조형 | 5장 (쏘피 · 성지연 · 커리어디벨로퍼J) |
| `templates/visual.html` | B · 비주얼·경험 몰입형 | 1장 · 8장 (한아조 · 밑미 · 마이시크릿덴 · 무릉) |
| `templates/story.html` | C · 스토리텔링·세계관 강조형 | 3장 · 10장 (글로니 · 뚜누 · 왁타버스) |
| `templates/community.html` | D · 커뮤니티·컬처형 | 7장 (밑미 · 플라잉웨일 록담 · 크리스천데이트) |
| `templates/curation.html` | E · 취향 큐레이션형 | 2장 · 9장 (흑심 · 시시호시 · 퍼멘티드 고스트) |
| `assets/shared.css` | 공용 디자인 토큰 + 인터랙션 스타일 | |
| `assets/fx.js` | 공용 인터랙션 (goldenrecords 원본 파라미터 유지) | |
| `img/` | pertential100.com 이미지 로컬 사본 (핫링크 차단 대응) | |

샘플 콘텐츠는 pertential100.com(조재형 · Creator IP Builder)의 실제 데이터를 사용해,
같은 브랜드·같은 토큰이라도 **무엇을 앞세우느냐에 따라 전혀 다른 홈페이지가 되는 것**을 보여줍니다.

## 보는 방법

```bash
# 로컬
python3 -m http.server 8000
# → http://localhost:8000
```

GitHub Pages로 보려면: 저장소 Settings → Pages → 배포 브랜치를 선택하면
`index.html`이 그대로 서빙됩니다 (빌드 과정 없음, 정적 파일만 사용).

## 인터랙션 파라미터 출처 (goldenrecords.kr 실측)

- 스크롤 리빌: IO `threshold 0.12`, `rootMargin 0 0 -8%`, 0.8s `cubic-bezier(.22,.61,.36,1)`
- 숫자 티커: 스프링 `stiffness 60 / damping 20 / mass 0.8`, 120Hz 서브스텝 적분, 자리수 스태거
- 마퀴: 목록 2벌 복제 + `translateX(-50%)` 루프, 호버 시 일시정지
- 카드 호버: lift −4px + 1px 링 + 글로우 + 이미지 `scale(1.09)` + CTA 배지 등장
- 스크롤 스파이: IO `rootMargin -45% 0 -50%` (뷰포트 중앙 밴드)
- 별하늘(스파크 필드): 시드 랜덤 `Math.sin(i·127.1+311.7)·43758.5453`, twinkle 2.5~6.5s
- `prefers-reduced-motion: reduce` 시 전체 무효화
