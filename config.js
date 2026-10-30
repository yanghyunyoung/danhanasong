// 단하나송 사이트 설정 — 여기만 고치면 됩니다.
window.DHS_CONFIG = {
  brand: "단하나송",
  price: 19900,                 // 노래 한 곡 가격(원)
  deliveryHours: 24,            // 완성까지 걸리는 시간(안내 문구용)

  // 주문을 받을 구글 앱스 스크립트 주소 (apps-script/설치방법.md 참고)
  // 비어 있으면 '미리보기 모드'로 동작해 주문이 이 브라우저에만 저장됩니다.
  orderEndpoint: "",

  // 결제 대신 주문 후 보여 줄 안내 (비워 두면 해당 줄이 숨겨집니다)
  bankInfo: "",                 // 예: "카카오뱅크 3333-00-0000000 (예금주 홍길동)"
  kakaoChannelUrl: "",          // 예: "https://pf.kakao.com/_xxxx"
  contactEmail: "",             // 예: "hello@danhanasong.kr"

  // 틱톡 광고 전환 측정용 픽셀 ID (틱톡 광고 관리자 → 이벤트 → 웹 이벤트)
  tiktokPixelId: "",

  // 사업자 정보 (전자상거래법상 사이트 아래에 표시해야 합니다)
  business: {
    name: "",        // 상호
    owner: "",       // 대표자
    regNo: "",       // 사업자등록번호
    mailOrderNo: "", // 통신판매업 신고번호
    address: "",
  },
};
