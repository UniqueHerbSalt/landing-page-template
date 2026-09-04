# 브랜딩 랜딩페이지 유형 쇼케이스

유명 브랜드 랜딩페이지 **30개**(글로벌 테크 10 · 한국 브랜드 10 · 라이프스타일 10)를 분석해 도출한
**6가지 랜딩 유형**과, 유형별 샘플 페이지 모음입니다.

여섯 샘플은 전부 **같은 콘텐츠**(조재형 · Creator IP Builder, pertential100.com의 실제 데이터와 이미지 13장)를 쓰고,
팔레트·타이포·레이아웃 골격·모션만 유형별 문법으로 바꿔 — 유형이 인상을 얼마나 바꾸는지 통제 변인으로 비교합니다.

## 구성

| 페이지 | 유형 | 참고 브랜드 |
|---|---|---|
| `index.html` | 쇼케이스 허브 (+ 30개 브랜드 유형 매트릭스) | — |
| `templates/impact.html` | 1 · 임팩트 캠페인형 | Nike · Gentle Monster · Red Bull · 무신사 · Spotify |
| `templates/immersive.html` | 2 · 프로덕트 몰입형 | Apple · Tesla · 현대카드 · LG전자 · 유니클로 |
| `templates/saas.html` | 3 · 전환형 SaaS | Stripe · 토스 · Notion · Figma · Linear · Vercel |
| `templates/narrative.html` | 4 · 헤리티지 내러티브형 | 신도리코 · 네이버 · 카카오 · 우아한형제들 · Lush |
| `templates/editorial.html` | 5 · 콰이어트 에디토리얼형 | Aesop · 무인양품 · Anthropic · Patagonia · Freitag |
| `templates/curation.html` | 6 · 커머스 큐레이션형 | Airbnb · IKEA · 29CM · 이니스프리 |
| `assets/shared.css` | 공용 구조 + 테마 토큰 계약 | |
| `assets/fx.js` | 공용 인터랙션 (goldenrecords.kr 실측 파라미터) | |
| `img/` | pertential100.com 이미지 로컬 사본 (핫링크 차단 대응) | |

## landing-builder 스킬

이 쇼케이스의 방법론을 재사용 가능한 스킬로 정리해 `.claude/skills/landing-builder/`에 두었다.
이 저장소에서 Claude Code 세션을 열면 자동으로 로드되고, "랜딩페이지 만들어줘" 계열 요청에 발동한다.

- `SKILL.md` — 트리거 조건과 5단계 제작 워크플로우
- `references/archetypes.md` — 6유형 상세 스펙(팔레트 공식·섹션 골격·타이포·모션·카피 톤·흔한 실수)
- `assets/` — 인터랙션 키트 (이 저장소 `assets/`와 동일, 스킬 단독 배포를 위한 사본)
- `evals/` — 테스트 요청·채점 기준과 개선 기록. 스킬을 고칠 때 여기서부터 시작한다

## 테마 시스템

`assets/shared.css`는 구조(네비·마퀴·티커·카드·필터)만 갖고, 각 템플릿이 `:root` 토큰을 재정의합니다:

- `--bg / --surface / --card-bg / --text-*` — 그라운드와 텍스트 스케일
- `--fx-accent / --fx-accent-ink` — 인터랙션 액센트(글로우·링·CTA·스파크·스크롤스파이). `fx.js`가 런타임에 읽음
- `--nav-bg / --radius / --font-body / --font-display` — 크롬, 라운딩, 서체

## 보는 방법

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

GitHub Pages: Settings → Pages → 배포 브랜치 선택 (빌드 과정 없음, 정적 파일만 사용).

## 인터랙션 파라미터 출처 (goldenrecords.kr 실측)

- 스크롤 리빌: IO `threshold 0.12`, `rootMargin 0 0 -8%`, 0.8s `cubic-bezier(.22,.61,.36,1)`
- 숫자 티커: 스프링 `stiffness 60 / damping 20 / mass 0.8`, 120Hz 서브스텝 적분, 자리수 스태거
- 마퀴: 목록 2벌 복제 + `translateX(-50%)` 루프, 호버 시 일시정지
- 카드 호버: lift −4px + 1px 링 + 글로우 + 이미지 `scale(1.09)` + CTA 배지 등장
- 스크롤 스파이: IO `rootMargin -45% 0 -50%` (뷰포트 중앙 밴드)
- 스파크 필드: 시드 랜덤 `Math.sin(i·127.1+311.7)·43758.5453`, twinkle 2.5~6.5s
- `prefers-reduced-motion: reduce` 시 전체 무효화
