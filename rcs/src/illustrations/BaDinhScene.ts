import Konva from 'konva';
import gsap from 'gsap';
import { BaseIllustration, IllustrationConfig } from './BaseIllustration';

// ============================================
// BA DINH SQUARE ILLUSTRATION
// Ho Chi Minh reading Declaration of Independence
// ============================================

export class BaDinhScene extends BaseIllustration {
  private hoChiMinh: Konva.Group | null = null;
  private microphone: Konva.Group | null = null;
  private flag: Konva.Group | null = null;
  private crowd: Konva.Group[] = [];
  private speechBubble: Konva.Group | null = null;

  constructor(config: IllustrationConfig) {
    super(config);
  }

  protected async setup(): Promise<void> {
    const bgLayer = this.getLayer('background')!;
    const mainLayer = this.getLayer('main')!;
    const fgLayer = this.getLayer('foreground')!;
    const effectsLayer = this.getLayer('effects')!;

    // Draw sky (historic moment - golden hour)
    this.drawHistoricSky(bgLayer);

    // Draw Ba Dinh Square
    this.drawSquare(bgLayer);

    // Draw podium/stage
    this.drawPodium(mainLayer);

    // Draw Ho Chi Minh figure
    this.hoChiMinh = this.drawHoChiMinh(mainLayer);

    // Draw microphone
    this.microphone = this.drawMicrophone(mainLayer);

    // Draw Vietnamese flags
    this.drawFlags(mainLayer);

    // Draw massive crowd
    this.drawCrowd(mainLayer);

    // Draw confetti/celebration
    this.drawCelebrationElements(effectsLayer);

    // Draw sunrays
    this.drawSunRays(bgLayer);

    bgLayer.batchDraw();
    mainLayer.batchDraw();
    fgLayer.batchDraw();
    effectsLayer.batchDraw();
  }

  // ============================================
  // BACKGROUND
  // ============================================

  private drawHistoricSky(layer: Konva.Layer): void {
    // Golden hour sky
    const sky = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height * 0.6,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: this.config.height * 0.6 },
      fillLinearGradientColorStops: [
        0,
        '#87CEEB', // Sky blue
        0.5,
        '#FFD700', // Golden
        1,
        '#FFA500', // Orange
      ],
    });
    layer.add(sky);

    // Sun
    this.drawSun(layer, this.config.width * 0.75, this.config.height * 0.2, 50, '#FFD700');
  }

  private drawSquare(layer: Konva.Layer): void {
    // Ground - Ba Dinh Square
    const ground = new Konva.Rect({
      x: 0,
      y: this.config.height * 0.6,
      width: this.config.width,
      height: this.config.height * 0.4,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: this.config.height * 0.4 },
      fillLinearGradientColorStops: [0, '#8B8680', 0.5, '#A09C98', 1, '#8B8680'],
    });
    layer.add(ground);

    // Grid lines (square tiles)
    for (let i = 0; i < 10; i++) {
      const line = new Konva.Line({
        points: [0, this.config.height * 0.6 + i * 30, this.config.width, this.config.height * 0.6 + i * 30],
        stroke: '#7B7670',
        strokeWidth: 1,
        opacity: 0.3,
      });
      layer.add(line);
    }
  }

  private drawSunRays(layer: Konva.Layer): void {
    const centerX = this.config.width * 0.75;
    const centerY = this.config.height * 0.2;
    const rayCount = 12;

    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const length = 100 + Math.random() * 50;
      const endX = centerX + Math.cos(angle) * length;
      const endY = centerY + Math.sin(angle) * length;

      const ray = new Konva.Line({
        points: [centerX, centerY, endX, endY],
        stroke: '#FFD700',
        strokeWidth: 2,
        opacity: 0.3,
        lineCap: 'round',
      });

      layer.add(ray);

      // Animate rays
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(ray, {
        opacity: 0.6,
        duration: 2 + Math.random(),
        ease: 'sine.inOut',
      });
      this.animations.push(tl);
    }
  }

  // ============================================
  // MAIN ELEMENTS
  // ============================================

  private drawPodium(layer: Konva.Layer): Konva.Group {
    const podium = new Konva.Group({
      x: this.config.width * 0.5,
      y: this.config.height * 0.6,
    });

    // Stage platform
    const platform = new Konva.Rect({
      x: -100,
      y: 0,
      width: 200,
      height: 15,
      fill: '#8B4513',
      stroke: '#654321',
      strokeWidth: 2,
    });

    // Podium stand
    const stand = new Konva.Rect({
      x: -40,
      y: 15,
      width: 80,
      height: 60,
      fill: '#654321',
      stroke: '#4a3319',
      strokeWidth: 2,
    });

    // Podium top
    const top = new Konva.Rect({
      x: -50,
      y: 60,
      width: 100,
      height: 10,
      fill: '#8B4513',
      stroke: '#654321',
      strokeWidth: 2,
    });

    // Red cloth draping
    const clothPoints = [];
    for (let i = 0; i <= 20; i++) {
      const x = -100 + (i / 20) * 200;
      const y = 5 + Math.sin((i / 20) * Math.PI * 4) * 5;
      clothPoints.push(x, y);
    }
    clothPoints.push(100, 15, -100, 15);

    const cloth = new Konva.Line({
      points: clothPoints,
      fill: '#da251d',
      closed: true,
    });

    podium.add(platform, cloth, stand, top);
    layer.add(podium);

    return podium;
  }

  private drawHoChiMinh(layer: Konva.Layer): Konva.Group {
    const hoChiMinh = new Konva.Group({
      x: this.config.width * 0.5,
      y: this.config.height * 0.6 + 20,
    });

    // Body (traditional Vietnamese outfit - áo dài)
    const body = new Konva.Rect({
      x: -15,
      y: -30,
      width: 30,
      height: 50,
      fill: '#D2B48C', // Khaki color
      cornerRadius: 3,
    });

    // Head
    const head = new Konva.Circle({
      x: 0,
      y: -50,
      radius: 12,
      fill: '#D4A574',
    });

    // Iconic beard
    const beard = new Konva.Path({
      x: 0,
      y: -42,
      data: 'M -6,-2 Q -8,5 -5,10 L -3,8 L 0,10 L 3,8 L 5,10 Q 8,5 6,-2 Z',
      fill: '#FFFFFF',
      scale: { x: 1, y: 1 },
    });

    // Hair
    const hair = new Konva.Arc({
      x: 0,
      y: -56,
      innerRadius: 0,
      outerRadius: 13,
      angle: 180,
      rotation: 180,
      fill: '#FFFFFF',
    });

    // Arms (one raised, one holding paper)
    const leftArm = new Konva.Line({
      points: [-10, -25, -25, -15],
      stroke: '#D2B48C',
      strokeWidth: 5,
      lineCap: 'round',
    });

    const rightArm = new Konva.Line({
      points: [10, -25, 25, -35],
      stroke: '#D2B48C',
      strokeWidth: 5,
      lineCap: 'round',
    });

    // Hand holding declaration paper
    const paper = new Konva.Rect({
      x: 18,
      y: -40,
      width: 15,
      height: 20,
      fill: '#FFFAF0',
      stroke: '#000',
      strokeWidth: 0.5,
    });

    // Lines on paper
    for (let i = 0; i < 5; i++) {
      const line = new Konva.Line({
        points: [20, -38 + i * 4, 31, -38 + i * 4],
        stroke: '#000',
        strokeWidth: 0.5,
      });
      hoChiMinh.add(line);
    }

    hoChiMinh.add(body, leftArm, rightArm, paper, head, beard, hair);
    layer.add(hoChiMinh);

    return hoChiMinh;
  }

  private drawMicrophone(layer: Konva.Layer): Konva.Group {
    const mic = new Konva.Group({
      x: this.config.width * 0.5 - 35,
      y: this.config.height * 0.6,
    });

    // Mic stand
    const stand = new Konva.Line({
      points: [0, 20, 0, -20],
      stroke: '#4a4a4a',
      strokeWidth: 3,
    });

    // Mic head
    const head = new Konva.Circle({
      x: 0,
      y: -25,
      radius: 5,
      fill: '#2a2a2a',
      stroke: '#1a1a1a',
      strokeWidth: 1,
    });

    // Mic grill
    for (let i = 0; i < 3; i++) {
      const line = new Konva.Line({
        points: [-3, -25 + i * 2, 3, -25 + i * 2],
        stroke: '#fff',
        strokeWidth: 0.5,
        opacity: 0.3,
      });
      mic.add(line);
    }

    mic.add(stand, head);
    layer.add(mic);

    return mic;
  }

  private drawFlags(layer: Konva.Layer): void {
    // Multiple flags around the square
    const flagPositions = [
      { x: 0.15, y: 0.55 },
      { x: 0.25, y: 0.55 },
      { x: 0.75, y: 0.55 },
      { x: 0.85, y: 0.55 },
    ];

    flagPositions.forEach((pos, i) => {
      const flagGroup = new Konva.Group({
        x: this.config.width * pos.x,
        y: this.config.height * pos.y,
      });

      // Flag pole
      const pole = new Konva.Line({
        points: [0, 0, 0, -80],
        stroke: '#8B7355',
        strokeWidth: 4,
      });

      // Flag
      const flag = new Konva.Rect({
        x: 0,
        y: -80,
        width: 40,
        height: 27,
        fill: '#da251d',
      });

      // Star
      const star = new Konva.Star({
        x: 20,
        y: -80 + 13.5,
        numPoints: 5,
        innerRadius: 4,
        outerRadius: 8,
        fill: '#ffcd00',
      });

      flagGroup.add(pole, flag, star);
      layer.add(flagGroup);

      // Wave animation
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(flag, {
        skewX: 8,
        duration: 1 + Math.random() * 0.5,
        ease: 'sine.inOut',
      });
      tl.to(
        star,
        {
          x: 22,
          duration: 1 + Math.random() * 0.5,
          ease: 'sine.inOut',
        },
        '<'
      );
      this.animations.push(tl);
    });
  }

  private drawCrowd(layer: Konva.Layer): void {
    // Draw massive crowd (hundreds of people)
    const rows = 5;
    const personsPerRow = 15;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < personsPerRow; col++) {
        const x = (this.config.width / personsPerRow) * col + 20;
        const y = this.config.height * 0.68 + row * 15;
        const scale = 0.4 - row * 0.05; // Smaller in background

        const person = this.createPerson(x, y, scale, '#2d3748');

        // Random raised arms (cheering)
        if (Math.random() > 0.5) {
          const arm = new Konva.Line({
            points: [0, -20, 0, -35],
            stroke: '#2d3748',
            strokeWidth: 3,
          });
          person.add(arm);
        }

        // Animate (subtle wave motion)
        const tl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
        });
        tl.to(person, {
          y: y - 3,
          duration: 0.8 + Math.random() * 0.4,
          ease: 'sine.inOut',
        });
        this.animations.push(tl);

        layer.add(person);
        this.crowd.push(person);
      }
    }
  }

  private drawCelebrationElements(layer: Konva.Layer): void {
    // Confetti falling
    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
      const colors = ['#da251d', '#ffcd00', '#0066CC', '#FFFFFF'];
      const confetti = new Konva.Rect({
        x: Math.random() * this.config.width,
        y: -20,
        width: 4,
        height: 8,
        fill: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      });

      layer.add(confetti);

      // Fall animation
      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 5 });
      tl.to(confetti, {
        y: this.config.height + 20,
        rotation: confetti.rotation() + 360 + Math.random() * 360,
        x: confetti.x() + (Math.random() - 0.5) * 100,
        duration: 5 + Math.random() * 3,
        ease: 'none',
        onComplete: () => {
          confetti.y(-20);
          confetti.x(Math.random() * this.config.width);
        },
      });
      this.animations.push(tl);
    }

    // Floating text "FREEDOM!" / "ĐỘC LẬP!"
    const text = new Konva.Text({
      x: this.config.width * 0.5 - 80,
      y: this.config.height * 0.4,
      text: 'ĐỘC LẬP!',
      fontSize: 48,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#FFD700',
      stroke: '#da251d',
      strokeWidth: 2,
      opacity: 0,
    });

    layer.add(text);

    // Text appear animation
    const textTl = gsap.timeline({ delay: 1 });
    textTl.to(text, {
      opacity: 1,
      y: this.config.height * 0.35,
      duration: 1,
      ease: 'back.out',
    });
    textTl.to(text, {
      scale: 1.2,
      duration: 0.5,
      yoyo: true,
      repeat: 3,
      ease: 'sine.inOut',
    });
    this.animations.push(textTl);
  }

  // ============================================
  // ANIMATIONS
  // ============================================

  protected async createAnimations(): Promise<void> {
    const masterTimeline = gsap.timeline();

    // 1. Ho Chi Minh steps forward
    if (this.hoChiMinh) {
      masterTimeline.from(this.hoChiMinh, {
        x: this.config.width * 0.3,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
      });
    }

    // 2. Raises paper
    if (this.hoChiMinh) {
      masterTimeline.to(
        this.hoChiMinh.findOne((node: any) => node.getClassName() === 'Line' && node.points()[2] === 25),
        {
          rotation: -20,
          duration: 0.8,
          ease: 'back.out',
        },
        '-=0.5'
      );
    }

    // 3. Crowd reacts (wave)
    this.crowd.forEach((person, i) => {
      masterTimeline.to(
        person,
        {
          y: person.y() - 10,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        },
        `-=${0.5 - i * 0.01}`
      );
    });

    // 4. Light rays intensify
    const bgLayer = this.getLayer('background')!;
    const rays = bgLayer.find('Line');
    rays.forEach((ray: any) => {
      masterTimeline.to(
        ray,
        {
          opacity: 0.8,
          strokeWidth: 4,
          duration: 1,
          ease: 'power2.out',
        },
        '-=1'
      );
    });

    this.animations.push(masterTimeline);
  }
}
