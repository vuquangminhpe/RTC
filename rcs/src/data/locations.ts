import type { HistoricalLocation } from '../types';
import * as THREE from 'three';

// ============================================
// VIETNAM HISTORICAL LOCATIONS
// with REAL GPS coordinates
// ============================================

export const historicalLocations: HistoricalLocation[] = [
  // ============================================
  // 1. ĐIỆN BIÊN PHỦ (1954)
  // ============================================
  {
    id: 'dien-bien-phu',
    name: 'Điện Biên Phủ',
    year: 1954,
    coordinates: {
      lat: 21.3891,
      lng: 103.0178,
      alt: 500,
    },
    title: 'Chiến thắng Điện Biên Phủ',
    subtitle: '"Lừng lẫy năm châu, chấn động địa cầu"',
    description:
      'Chiến dịch Điện Biên Phủ (13/3 - 7/5/1954) là đỉnh cao nghệ thuật quân sự Việt Nam, kết thúc 9 năm kháng chiến chống thực dân Pháp.',
    detailedContent: {
      context:
        'Sau Chiến tranh Thế giới II, thực dân Pháp quay trở lại xâm lược Việt Nam. Cuộc kháng chiến toàn quốc kéo dài 9 năm, qua nhiều giai đoạn từ tự vệ đến tổng phản công. Đến năm 1953, Pháp xây dựng căn cứ Điện Biên Phủ hy vọng kéo quân ta vào quyết chiến.',
      event:
        'Chiến dịch kéo dài 56 ngày đêm với 3 giai đoạn: Đánh chắc tiến chắc, quyết đánh quyết thắng, và tổng công kích. Quân ta đã vận chuyển pháo lên núi một cách kỳ tích, bao vây và tiến công từng cứ điểm. Ngày 7/5/1954, cờ Quyết thắng tung bay trên hầm tướng De Castries.',
      significance:
        'Điện Biên Phủ đánh bại hoàn toàn ý chí xâm lược của thực dân Pháp, buộc họ phải ký Hiệp định Giơ-ne-vơ (1954) công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam. Đây là chiến thắng lịch sử của dân tộc Việt Nam, mở đầu kỷ nguyên độc lập.',
      impact:
        'Điện Biên Phủ không chỉ giải phóng miền Bắc mà còn có ý nghĩa quốc tế to lớn: Cổ vũ phong trào giải phóng dân tộc ở châu Á, châu Phi; góp phần làm tan rã hệ thống thuộc địa cũ; chứng minh rằng một dân tộc nhỏ nhưng đoàn kết, kiên cường có thể chiến thắng kẻ thù hùng mạnh.',
      legacy:
        'Tinh thần Điện Biên Phủ - "Quyết chiến, quyết thắng" - trở thành biểu tượng của ý chí Việt Nam. Nghệ thuật quân sự Điện Biên Phủ được nghiên cứu trên toàn thế giới. Di tích Điện Biên Phủ là điểm đến tưởng nhớ công lao cha ông và giáo dục lòng yêu nước.',
    },
    color: '#ff4444',
    markerType: 'battle',
    cameraPath: [
      {
        position: new THREE.Vector3(0, 100, 200),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 3,
        ease: 'power2.inOut',
      },
      {
        position: new THREE.Vector3(-50, 50, 100),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 2,
        ease: 'power2.inOut',
      },
      {
        position: new THREE.Vector3(0, 30, 80),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 2,
        ease: 'power2.inOut',
      },
    ],
    illustrationType: 'dien-bien-phu',
  },

  // ============================================
  // 2. HÀ NỘI - QUẢNG TRƯỜNG BA ĐÌNH (1945)
  // ============================================
  {
    id: 'ba-dinh',
    name: 'Quảng trường Ba Đình',
    year: 1945,
    coordinates: {
      lat: 21.0368,
      lng: 105.8342,
      alt: 10,
    },
    title: 'Tuyên ngôn Độc lập',
    subtitle: 'Ngày đất nước ra đời',
    description:
      'Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    detailedContent: {
      context:
        'Sau Cách mạng Tháng Tám thành công (19/8/1945), toàn quyền Đông Dương Nhật đã đầu hàng. Nhân dân Việt Nam giành chính quyền từ tay thực dân Pháp và phong kiến tay sai. Chủ tịch Hồ Chí Minh được bầu làm Chủ tịch nước.',
      event:
        'Chiều ngày 2/9/1945, tại Quảng trường Ba Đình, hàng vạn đồng bào từ khắp nơi đổ về. Chủ tịch Hồ Chí Minh, với giọng nói đanh thép nhưng đầy xúc động, đọc bản Tuyên ngôn Độc lập lịch sử: "Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc."',
      significance:
        'Tuyên ngôn Độc lập khẳng định quyền dân tộc tự quyết, tuyên bố với thế giới về sự ra đời của nước Việt Nam Dân chủ Cộng hòa - nhà nước công nông đầu tiên ở Đông Nam Á. Đây là thắng lợi vĩ đại của Cách mạng Tháng Tám, kết thúc gần 100 năm đô hộ của thực dân Pháp.',
      impact:
        'Tuyên ngôn Độc lập mở ra kỷ nguyên độc lập, tự do cho dân tộc. Nó cổ vũ mạnh mẽ các dân tộc bị áp bức trên thế giới đấu tranh giải phóng. Văn kiện lịch sử này khẳng định quyền con người, quyền dân tộc tự quyết - những giá trị nhân văn cao cả.',
      legacy:
        'Quảng trường Ba Đình trở thành địa điểm linh thiêng của dân tộc. Lăng Chủ tịch Hồ Chí Minh được xây dựng tại đây. Mỗi năm, vào ngày Quốc khánh 2/9, lễ thượng cờ long trọng được tổ chức, nhắc nhớ về ngày đất nước ra đời.',
    },
    color: '#ffcc00',
    markerType: 'monument',
    cameraPath: [
      {
        position: new THREE.Vector3(-100, 80, 150),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 3,
        ease: 'power2.inOut',
      },
      {
        position: new THREE.Vector3(0, 60, 120),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 2,
        ease: 'power2.inOut',
      },
    ],
    illustrationType: 'ba-dinh',
  },

  // ============================================
  // 3. SÀI GÒN (TP. HỒ CHÍ MINH) - 1975
  // ============================================
  {
    id: 'saigon-1975',
    name: 'Sài Gòn',
    year: 1975,
    coordinates: {
      lat: 10.7769,
      lng: 106.7009,
      alt: 20,
    },
    title: 'Đại thắng Mùa Xuân 1975',
    subtitle: 'Non sông thu về một mối',
    description:
      'Ngày 30/4/1975, chiến dịch Hồ Chí Minh kết thúc với thắng lợi hoàn toàn, miền Nam hoàn toàn giải phóng, đất nước thống nhất.',
    detailedContent: {
      context:
        'Sau Hiệp định Paris 1973, Mỹ rút quân nhưng chính quyền Sài Gòn vẫn cố thủ. Cuối năm 1974, quân ta mở chiến dịch Tây Nguyên, tạo thế tiến công chiến lược. Đầu năm 1975, các chiến dịch liên tiếp thắng lợi, mở đường tiến về Sài Gòn.',
      event:
        'Chiến dịch Hồ Chí Minh bắt đầu từ 26/4/1975. Trong 4 ngày chớp nhoáng, quân ta tiến công từ nhiều hướng, bao vây Sài Gòn. Sáng 30/4/1975, xe tăng 390 và 843 húc đổ cổng Dinh Độc Lập (nay là Dinh Thống Nhất). Lá cờ Tổ quốc tung bay trên nóc dinh, đánh dấu miền Nam hoàn toàn giải phóng.',
      significance:
        'Đại thắng Mùa Xuân là đỉnh cao của nghệ thuật quân sự Việt Nam, kết thúc 21 năm chia cắt đất nước. Hoàn thành cách mạng dân tộc dân chủ nhân dân trong cả nước, mở đường cho cả nước đi lên chủ nghĩa xã hội.',
      impact:
        'Thống nhất đất nước sau 21 năm chia cắt. Kết thúc 30 năm chiến tranh liên tục. Chấm dứt ảnh hưởng của đế quốc Mỹ ở Đông Dương. Tạo điều kiện để đất nước đổi mới và phát triển. Góp phần thay đổi cục diện chính trị ở Đông Nam Á.',
      legacy:
        'Ngày 30/4 trở thành ngày Giải phóng miền Nam, thống nhất đất nước. Sài Gòn được đổi tên thành TP. Hồ Chí Minh. Dinh Độc Lập (Dinh Thống Nhất) là di tích lịch sử quan trọng. Xe tăng 390 và 843 được lưu giữ tại Bảo tàng Lịch sử Quân sự.',
    },
    color: '#00ff88',
    markerType: 'city',
    cameraPath: [
      {
        position: new THREE.Vector3(100, 70, 180),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 3,
        ease: 'power2.inOut',
      },
      {
        position: new THREE.Vector3(50, 40, 100),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 2,
        ease: 'power2.inOut',
      },
      {
        position: new THREE.Vector3(0, 25, 70),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 2,
        ease: 'power2.inOut',
      },
    ],
    illustrationType: 'saigon-1975',
  },

  // ============================================
  // 4. NGHỆ AN - KIM LIÊN (1890)
  // ============================================
  {
    id: 'kim-lien',
    name: 'Làng Kim Liên',
    year: 1890,
    coordinates: {
      lat: 19.0833,
      lng: 105.4167,
      alt: 50,
    },
    title: 'Quê hương Bác Hồ',
    subtitle: 'Nơi sinh của Chủ tịch Hồ Chí Minh',
    description:
      'Làng Kim Liên, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An - nơi sinh của Chủ tịch Hồ Chí Minh ngày 19/5/1890.',
    detailedContent: {
      context:
        'Cuối thế kỷ 19, Việt Nam đang chìm trong khổ đau dưới ách thống trị của thực dân Pháp. Làng Kim Liên là một làng quê nghèo nhưng giàu truyền thống yêu nước. Cha của Bác - cụ Nguyễn Sinh Sắc - là một nho sĩ yêu nước.',
      event:
        'Ngày 19/5/1890 (nhằm ngày mùng 10 tháng 4 năm Canh Dần), Nguyễn Sinh Cung (tên thật của Bác Hồ) ra đời tại làng Kim Liên. Thuở nhỏ, Bác học chữ Nho với cha, rồi học chữ Quốc ngữ và tiếng Pháp. Từ nhỏ, Bác đã chứng kiến cảnh dân tộc bị đô hộ và nuôi dưỡng chí hướng cứu nước.',
      significance:
        'Kim Liên không chỉ là nơi sinh của một vĩ nhân mà còn nuôi dưỡng tinh thần yêu nước, ý chí tự cường của Người. Gia đình và quê hương đã hun đúc nhân cách, lý tưởng cách mạng cho Nguyễn Ái Quốc sau này.',
      impact:
        'Từ làng quê nghèo Kim Liên, Nguyễn Sinh Cung đã ra đi tìm đường cứu nước, trở thành Nguyễn Ái Quốc, rồi Hồ Chí Minh - lãnh tụ vĩ đại của dân tộc Việt Nam. Ngôi nhà sàn nhỏ ở Kim Liên đã sản sinh ra một con người phi thường, người đã dành cả đời cho độc lập dân tộc và hạnh phúc của nhân dân.',
      legacy:
        'Khu di tích Kim Liên là địa chỉ đỏ quan trọng, nơi giáo dục truyền thống cách mạng. Nhà lưu niệm Chủ tịch Hồ Chí Minh tại Kim Liên đón hàng triệu lượt khách mỗi năm. Làng Kim Liên trở thành biểu tượng của quê hương Bác, nơi khởi nguồn của con đường cách mạng Việt Nam.',
    },
    color: '#ff8800',
    markerType: 'monument',
    cameraPath: [
      {
        position: new THREE.Vector3(-80, 60, 140),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 3,
        ease: 'power2.inOut',
      },
      {
        position: new THREE.Vector3(-40, 40, 90),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 2,
        ease: 'power2.inOut',
      },
    ],
    illustrationType: 'ho-chi-minh',
  },

  // ============================================
  // 5. HÀ NỘI - ĐẠI HỘI ĐẢNG VI (1986)
  // ============================================
  {
    id: 'doi-moi-1986',
    name: 'Hà Nội',
    year: 1986,
    coordinates: {
      lat: 21.0278,
      lng: 105.8342,
      alt: 10,
    },
    title: 'Đổi Mới',
    subtitle: 'Bước ngoặt lịch sử',
    description:
      'Tháng 12/1986, Đại hội Đảng lần thứ VI đề ra đường lối đổi mới toàn diện đất nước, mở ra thời kỳ mới.',
    detailedContent: {
      context:
        'Sau thống nhất đất nước (1975), Việt Nam gặp nhiều khó khăn: Kinh tế trì trệ, lạm phát cao, thiếu hụt lương thực. Cơ chế tập trung quan料料 bao cấp bộc lộ nhiều hạn chế. Đất nước cần một sự đổi mới mạnh mẽ để thoát khỏi khủng hoảng.',
      event:
        'Đại hội Đảng lần thứ VI (tháng 12/1986) là bước ngoặt lịch sử. Đại hội quyết định thực hiện đường lối đổi mới toàn diện: Chuyển sang cơ chế thị trường có sự quản lý của nhà nước, phát huy mọi tiềm năng của đất nước, mở cửa hội nhập quốc tế. Khẩu hiệu "Đổi mới tư duy" ra đời.',
      significance:
        'Đổi mới là yêu cầu khách quan của lịch sử, xuất phát từ thực tiễn cuộc sống. Đường lối đổi mới giải phóng sức sản xuất, phát huy mọi nguồn lực, đưa đất nước thoát khỏi khủng hoảng kinh tế - xã hội.',
      impact:
        'Gần 40 năm đổi mới, Việt Nam đạt nhiều thành tựu to lớn: GDP tăng trưởng bình quân trên 6%/năm, từ nước nhập khẩu lương thực trở thành nước xuất khẩu gạo lớn thứ 3 thế giới, đời sống nhân dân được cải thiện rõ rệt, vị thế quốc tế ngày càng nâng cao.',
      legacy:
        'Tinh thần đổi mới không ngừng nghỉ, không ngại khó khăn, dám nghĩ, dám làm, dám chịu trách nhiệm. Đổi mới là quá trình lâu dài, liên tục, không có điểm dừng. Thành công của đổi mới khẳng định sự lựa chọn đúng đắn của Đảng và nhân dân.',
    },
    color: '#00ccff',
    markerType: 'city',
    cameraPath: [
      {
        position: new THREE.Vector3(90, 75, 160),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 3,
        ease: 'power2.inOut',
      },
      {
        position: new THREE.Vector3(45, 50, 110),
        lookAt: new THREE.Vector3(0, 0, 0),
        duration: 2,
        ease: 'power2.inOut',
      },
    ],
    illustrationType: 'doi-moi',
  },
];

// ============================================
// VIETNAM BOUNDING BOX
// ============================================

export const VIETNAM_BOUNDS = {
  north: 23.3926504, // Lũng Cú
  south: 8.1790665, // Mũi Cà Mau
  east: 109.46432, // Trường Sa
  west: 102.14441, // Điện Biên
  centerLat: 16.0,
  centerLng: 106.0,
};

// ============================================
// MAP CONFIGURATION
// ============================================

export const MAP_CONFIG = {
  scale: 20, // Scale factor for converting lat/lng to 3D coordinates
  elevationScale: 0.5,
  terrainSegments: 200,
  textureUrl: '/textures/vietnam-terrain.jpg',
  normalMapUrl: '/textures/vietnam-normal.jpg',
};
