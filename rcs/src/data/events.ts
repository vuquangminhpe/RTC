import { HistoricalEvent } from '../types';

export const historicalEvents: HistoricalEvent[] = [
  {
    id: 'event-1930',
    year: 1930,
    title: 'Đảng Cộng sản Việt Nam ra đời',
    subtitle: 'Thành lập Đảng',
    description: 'Ngày 3/2/1930, tại Hội nghị hợp nhất ở Cửu Long (Hương Cảng), dưới sự chủ trì của đồng chí Nguyễn Ái Quốc, ba tổ chức cộng sản đã hợp nhất thành Đảng Cộng sản Việt Nam.',
    detailedContent: {
      meaning: 'Sự ra đời của Đảng đã chấm dứt khủng hoảng về đường lối lãnh đạo cách mạng Việt Nam. Đánh dấu bước ngoặt vĩ đại trong lịch sử dân tộc, mở ra thời kỳ mới - thời kỳ đấu tranh giải phóng dân tộc gắn liền với giải phóng giai cấp và con người, đi lên chủ nghĩa xã hội.',
      lessons: 'Đảng sinh ra từ nhu cầu khách quan của cách mạng Việt Nam và sự vận động tất yếu của lịch sử. Sự lãnh đạo của Đảng là nhân tố quyết định mọi thắng lợi của cách mạng Việt Nam.'
    },
    image: '/images/nguyen-ai-quoc.jpg',
    buttonText: 'Tìm hiểu thêm',
    position: 'right',
    color: '#ff6b6b'
  },
  {
    id: 'event-1945',
    year: 1945,
    title: 'Tuyên Ngôn Độc Lập',
    subtitle: 'Cách Mạng Tháng Tám',
    description: 'Ngày 2/9/1945, tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
    detailedContent: {
      meaning: 'Cách mạng Tháng Tám thành công, lập ra nước Việt Nam Dân chủ Cộng hòa - Nhà nước công nông đầu tiên ở Đông Nam Á. Đây là thắng lợi vĩ đại đầu tiên của đường lối cách mạng đúng đắn, sáng tạo của Đảng.',
      lessons: 'Phải biết nắm bắt thời cơ, tạo ra bước ngoặt lịch sử. Sức mạnh của toàn dân tộc đoàn kết dưới sự lãnh đạo của Đảng là nguồn sức mạnh vô tận để giành thắng lợi.',
      impact: 'Mở ra kỷ nguyên độc lập dân tộc gắn liền với chủ nghĩa xã hội, cổ vũ phong trào giải phóng dân tộc trên thế giới.'
    },
    image: '/images/ba-dinh-square.jpg',
    buttonText: 'Ý nghĩa',
    position: 'left',
    color: '#4ecdc4'
  },
  {
    id: 'event-1954',
    year: 1954,
    title: 'Chấn động Địa Cầu',
    subtitle: 'Chiến thắng Điện Biên Phủ',
    description: 'Ngày 7/5/1954, chiến dịch Điện Biên Phủ kết thúc với thắng lợi hoàn toàn. Đây là chiến thắng "lừng lẫy năm châu, chấn động địa cầu", đánh bại ý chí xâm lược của thực dân Pháp.',
    detailedContent: {
      meaning: 'Chiến thắng Điện Biên Phủ đã buộc thực dân Pháp phải ký Hiệp định Giơ-ne-vơ (1954), công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam. Kết thúc 9 năm kháng chiến chống thực dân Pháp của nhân dân ta.',
      lessons: 'Thắng lợi của nghệ thuật quân sự Việt Nam, của sức mạnh toàn dân. Một dân tộc nhỏ nhưng đoàn kết, kiên cường có thể chiến thắng kẻ thù hùng mạnh.',
      impact: 'Cổ vũ mạnh mẽ phong trào giải phóng dân tộc, góp phần làm tan rã hệ thống thuộc địa cũ trên thế giới.'
    },
    image: '/images/dien-bien-phu-flag.jpg',
    buttonText: 'Bài học',
    position: 'right',
    color: '#ffe66d'
  },
  {
    id: 'event-1975',
    year: 1975,
    title: 'Non Sông Thống Nhất',
    subtitle: 'Đại Thắng Mùa Xuân',
    description: 'Ngày 30/4/1975, chiến dịch Hồ Chí Minh kết thúc với thắng lợi hoàn toàn. Chiếc xe tăng 390 húc đổ cổng Dinh Độc Lập, đánh dấu miền Nam hoàn toàn giải phóng.',
    detailedContent: {
      meaning: 'Đại thắng mùa Xuân 1975 là thắng lợi của đường lối đúng đắn, sáng tạo của Đảng, của sức mạnh toàn dân tộc. Chấm dứt 21 năm chia cắt đất nước, hoàn thành cách mạng dân tộc dân chủ nhân dân trong cả nước.',
      impact: 'Thống nhất đất nước, cả nước đi lên chủ nghĩa xã hội. Góp phần vào thắng lợi chung của phong trào cách mạng thế giới, làm thay đổi cục diện chiến lược ở Đông Nam Á và thế giới.',
      lessons: 'Thắng lợi của ý chí tự lực, tự cường, của tinh thần quyết chiến quyết thắng. Không có gì quý hơn độc lập, tự do.'
    },
    image: '/images/tank-390.jpg',
    buttonText: 'Tác động',
    position: 'left',
    color: '#ff6b9d'
  },
  {
    id: 'event-1986',
    year: 1986,
    title: 'Bước ngoặt Đổi Mới',
    subtitle: 'Đổi Mới',
    description: 'Tháng 12/1986, Đại hội Đảng lần thứ VI đã đề ra đường lối đổi mới toàn diện đất nước, mở ra thời kỳ mới - thời kỳ đẩy mạnh công nghiệp hóa, hiện đại hóa đất nước.',
    detailedContent: {
      meaning: 'Đổi mới là yêu cầu khách quan, xuất phát từ thực tiễn cuộc sống. Đường lối đổi mới đã giải phóng sức sản xuất, phát huy mọi tiềm năng của đất nước, đưa đất nước thoát khỏi khủng hoảng kinh tế - xã hội.',
      impact: 'Đất nước đã đạt được những thành tựu to lớn, có ý nghĩa lịch sử: Kinh tế tăng trưởng nhanh và bền vững, đời sống nhân dân từng bước được cải thiện, vị thế và uy tín của Việt Nam trên trường quốc tế ngày càng được nâng cao.',
      lessons: 'Phải không ngừng đổi mới tư duy, đổi mới mô hình tăng trưởng, cơ cấu lại nền kinh tế. Mở cửa, hội nhập quốc tế là xu thế tất yếu, là con đường đúng đắn để phát triển.'
    },
    image: '/images/doi-moi.jpg',
    buttonText: 'Ý nghĩa ngày nay',
    position: 'right',
    color: '#a8e6cf'
  }
];
