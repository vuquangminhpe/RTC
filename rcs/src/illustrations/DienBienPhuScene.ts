import Konva from 'konva';
import gsap from 'gsap';
import { BaseIllustration, IllustrationConfig } from './BaseIllustration';

// ============================================
// DIEN BIEN PHU ILLUSTRATION
// Soldier raising flag on De Castries bunker
// ============================================

export class DienBienPhuScene extends BaseIllustration {
  private flagPole: Konva.Line | null = null;
  private flag: Konva.Group | null = null;
  private mainSoldier: Konva.Group | null = null;
  private bunker: Konva.Group | null = null;

  constructor(config: IllustrationConfig) {
    super(config);
  }

  protected async setup(): Promise<void> {
    const bgLayer = this.getLayer('background')!;
    const mainLayer = this.getLayer('main')!;
    const fgLayer = this.getLayer('foreground')!;
    const effectsLayer = this.getLayer('effects')!;

    // Draw sky (dawn/victory colors)
    this.drawVictorySky(bgLayer);

    // Draw mountains
    this.drawDienBienMountains(bgLayer);

    // Draw battlefield smoke/fog
    this.drawBattlefieldSmoke(bgLayer);

    // Draw De Castries bunker
    this.bunker = this.drawBunker(mainLayer);

    // Draw supporting soldiers
    this.drawSupportingSoldiers(mainLayer);

    // Draw main soldier climbing with flag
    this.mainSoldier = this.drawMainSoldier(mainLayer);

    // Draw flag pole and flag
    this.flagPole = this.drawFlagPole(mainLayer);
    this.flag = this.drawVietnamFlag(mainLayer);

    // Draw explosion effects
    this.drawExplosions(effectsLayer);

    // Draw victory particles
    this.drawVictoryParticles(effectsLayer);

    // Initial state: flag not raised yet
    if (this.flag) {
      this.flag.opacity(0);
    }

    bgLayer.batchDraw();
    mainLayer.batchDraw();
    fgLayer.batchDraw();
    effectsLayer.batchDraw();
  }

  // ============================================
  // BACKGROUND ELEMENTS
  // ============================================

  private drawVictorySky(layer: Konva.Layer): void {
    // Dawn sky with victory colors
    const sky = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height * 0.7,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: this.config.height * 0.7 },
      fillLinearGradientColorStops: [
        0,
        '#ff6b35', // Orange dawn
        0.3,
        '#f7931e',
        0.6,
        '#ffd93d', // Yellow
        1,
        '#6dd5ed', // Blue sky
      ],
    });
    layer.add(sky);

    // Add sun breaking through
    this.drawSun(layer, this.config.width * 0.8, this.config.height * 0.15, 40, '#fff44f');
  }

  private drawDienBienMountains(layer: Konva.Layer): void {
    const h = this.config.height;
    const w = this.config.width;

    // Far mountains (lighter)
    const farMountains = this.drawMountains(
      layer,
      [
        0,
        h * 0.6,
        w * 0.15,
        h * 0.45,
        w * 0.3,
        h * 0.5,
        w * 0.5,
        h * 0.4,
        w * 0.7,
        h * 0.48,
        w,
        h * 0.55,
        w,
        h * 0.7,
        0,
        h * 0.7,
      ],
      '#4a5568',
      0.6
    );

    // Mid mountains
    const midMountains = this.drawMountains(
      layer,
      [
        0,
        h * 0.65,
        w * 0.2,
        h * 0.5,
        w * 0.4,
        h * 0.55,
        w * 0.6,
        h * 0.48,
        w * 0.8,
        h * 0.52,
        w,
        h * 0.6,
        w,
        h * 0.7,
        0,
        h * 0.7,
      ],
      '#2d3748',
      0.8
    );

    // Near mountains (darker)
    const nearMountains = this.drawMountains(
      layer,
      [
        0,
        h * 0.7,
        w * 0.25,
        h * 0.58,
        w * 0.5,
        h * 0.62,
        w * 0.75,
        h * 0.56,
        w,
        h * 0.65,
        w,
        h * 0.7,
        0,
        h * 0.7,
      ],
      '#1a202c',
      1
    );
  }

  private drawBattlefieldSmoke(layer: Konva.Layer): void {
    const smokeCount = 8;
    for (let i = 0; i < smokeCount; i++) {
      const x = Math.random() * this.config.width;
      const y = this.config.height * 0.6 + Math.random() * (this.config.height * 0.2);

      const smoke = new Konva.Circle({
        x: x,
        y: y,
        radius: 30 + Math.random() * 40,
        fill: '#8b8b8b',
        opacity: 0.2 + Math.random() * 0.2,
      });

      layer.add(smoke);

      // Animate smoke rising
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(smoke, {
        y: y - 50,
        opacity: 0,
        duration: 4 + Math.random() * 2,
        ease: 'power1.out',
        onComplete: () => {
          smoke.y(y);
          smoke.opacity(0.2 + Math.random() * 0.2);
        },
      });
      this.animations.push(tl);
    }
  }

  // ============================================
  // MAIN ELEMENTS
  // ============================================

  private drawBunker(layer: Konva.Layer): Konva.Group {
    const bunker = new Konva.Group({
      x: this.config.width * 0.5,
      y: this.config.height * 0.7,
    });

    // Bunker base (concrete structure)
    const base = new Konva.Rect({
      x: -80,
      y: 0,
      width: 160,
      height: 60,
      fill: '#4a4a4a',
      stroke: '#2a2a2a',
      strokeWidth: 2,
    });

    // Entrance
    const entrance = new Konva.Rect({
      x: -30,
      y: 20,
      width: 60,
      height: 40,
      fill: '#1a1a1a',
    });

    // Sandbags
    const sandbags: Konva.Rect[] = [];
    for (let i = 0; i < 8; i++) {
      const sandbag = new Konva.Rect({
        x: -90 + i * 22,
        y: -10,
        width: 20,
        height: 12,
        fill: '#8b7355',
        stroke: '#6b5345',
        strokeWidth: 1,
        cornerRadius: 2,
      });
      sandbags.push(sandbag);
      bunker.add(sandbag);
    }

    // Top platform for flag
    const platform = new Konva.Rect({
      x: -40,
      y: -20,
      width: 80,
      height: 15,
      fill: '#5a5a5a',
      stroke: '#3a3a3a',
      strokeWidth: 2,
    });

    // Battle damage (bullet holes, cracks)
    for (let i = 0; i < 10; i++) {
      const bulletHole = new Konva.Circle({
        x: -70 + Math.random() * 140,
        y: 10 + Math.random() * 40,
        radius: 2 + Math.random() * 3,
        fill: '#2a2a2a',
        opacity: 0.8,
      });
      bunker.add(bulletHole);
    }

    bunker.add(base, entrance, platform);
    layer.add(bunker);

    return bunker;
  }

  private drawMainSoldier(layer: Konva.Layer): Konva.Group {
    const soldier = new Konva.Group({
      x: this.config.width * 0.5 - 10,
      y: this.config.height * 0.7 - 20,
    });

    // Soldier body (detailed)
    const body = new Konva.Group();

    // Head with helmet
    const head = new Konva.Circle({
      x: 0,
      y: -45,
      radius: 10,
      fill: '#d4a574', // Skin tone
    });

    const helmet = new Konva.Arc({
      x: 0,
      y: -50,
      innerRadius: 0,
      outerRadius: 12,
      angle: 180,
      fill: '#4a5f3a', // Army green
      rotation: 180,
    });

    // Body (uniform)
    const torso = new Konva.Rect({
      x: -8,
      y: -35,
      width: 16,
      height: 25,
      fill: '#4a5f3a',
      cornerRadius: 2,
    });

    // Legs (climbing position)
    const leftLeg = new Konva.Line({
      points: [0, -10, -10, 5],
      stroke: '#3a4f2a',
      strokeWidth: 5,
      lineCap: 'round',
    });

    const rightLeg = new Konva.Line({
      points: [0, -10, 10, 0],
      stroke: '#3a4f2a',
      strokeWidth: 5,
      lineCap: 'round',
    });

    // Arms (reaching up to plant flag)
    const leftArm = new Konva.Line({
      points: [-5, -30, -15, -50],
      stroke: '#4a5f3a',
      strokeWidth: 4,
      lineCap: 'round',
    });

    const rightArm = new Konva.Line({
      points: [5, -30, 10, -55],
      stroke: '#4a5f3a',
      strokeWidth: 4,
      lineCap: 'round',
    });

    // Hand holding flag pole
    const hand = new Konva.Circle({
      x: 10,
      y: -55,
      radius: 4,
      fill: '#d4a574',
    });

    body.add(leftLeg, rightLeg, torso, leftArm, rightArm, head, helmet, hand);
    soldier.add(body);

    layer.add(soldier);

    return soldier;
  }

  private drawFlagPole(layer: Konva.Layer): Konva.Line {
    const pole = new Konva.Line({
      points: [
        this.config.width * 0.5,
        this.config.height * 0.7 - 75,
        this.config.width * 0.5,
        this.config.height * 0.7 - 150,
      ],
      stroke: '#8b7355',
      strokeWidth: 3,
      lineCap: 'round',
      opacity: 0, // Start hidden
    });

    layer.add(pole);

    return pole;
  }

  private drawVietnamFlag(layer: Konva.Layer): Konva.Group {
    const flagGroup = new Konva.Group({
      x: this.config.width * 0.5,
      y: this.config.height * 0.7 - 150,
    });

    // Flag rectangle (red background)
    const flagRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 60,
      height: 40,
      fill: '#da251d', // Vietnam red
      shadowColor: '#000',
      shadowBlur: 5,
      shadowOpacity: 0.3,
    });

    // Yellow star (5 points)
    const star = new Konva.Star({
      x: 30,
      y: 20,
      numPoints: 5,
      innerRadius: 6,
      outerRadius: 12,
      fill: '#ffcd00', // Vietnam yellow
    });

    flagGroup.add(flagRect, star);
    layer.add(flagGroup);

    return flagGroup;
  }

  private drawSupportingSoldiers(layer: Konva.Layer): void {
    // Soldiers celebrating in background
    const positions = [
      { x: 0.3, y: 0.75 },
      { x: 0.35, y: 0.73 },
      { x: 0.65, y: 0.73 },
      { x: 0.7, y: 0.75 },
      { x: 0.25, y: 0.77 },
      { x: 0.75, y: 0.77 },
    ];

    positions.forEach((pos, i) => {
      const soldier = this.createPerson(
        this.config.width * pos.x,
        this.config.height * pos.y,
        0.8 + Math.random() * 0.3,
        '#4a5f3a'
      );

      // Add weapons (rifles)
      const rifle = new Konva.Line({
        points: [5, -20, 15, -35],
        stroke: '#2a2a2a',
        strokeWidth: 2,
      });
      soldier.add(rifle);

      // Animate soldiers (cheering)
      const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 0.2 });
      tl.to(soldier, {
        y: soldier.y() - 5,
        duration: 0.5,
        ease: 'power1.inOut',
      });
      this.animations.push(tl);

      layer.add(soldier);
    });
  }

  // ============================================
  // EFFECTS
  // ============================================

  private drawExplosions(layer: Konva.Layer): void {
    // Background explosions/fire
    const explosionCount = 5;
    for (let i = 0; i < explosionCount; i++) {
      const x = Math.random() * this.config.width;
      const y = this.config.height * 0.65 + Math.random() * (this.config.height * 0.15);

      const explosion = new Konva.Circle({
        x: x,
        y: y,
        radius: 0,
        fill: '#ff6b35',
        opacity: 0.8,
      });

      layer.add(explosion);

      // Animate explosion
      const tl = gsap.timeline({ repeat: -1, delay: i * 0.5 });
      tl.to(explosion, {
        radius: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          explosion.radius(0);
          explosion.opacity(0.8);
        },
      });
      this.animations.push(tl);
    }
  }

  private drawVictoryParticles(layer: Konva.Layer): void {
    // Sparks, debris flying up
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const x = this.config.width * 0.5 + (Math.random() - 0.5) * 100;
      const y = this.config.height * 0.7;

      const particle = new Konva.Circle({
        x: x,
        y: y,
        radius: 2 + Math.random() * 3,
        fill: Math.random() > 0.5 ? '#ffcd00' : '#ff6b35',
        opacity: 1,
      });

      layer.add(particle);

      // Animate particles flying up
      const targetY = y - (100 + Math.random() * 150);
      const targetX = x + (Math.random() - 0.5) * 100;

      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 2 });
      tl.to(particle, {
        x: targetX,
        y: targetY,
        opacity: 0,
        duration: 2 + Math.random(),
        ease: 'power1.out',
        onComplete: () => {
          particle.x(x);
          particle.y(y);
          particle.opacity(1);
        },
      });
      this.animations.push(tl);
    }
  }

  // ============================================
  // ANIMATIONS
  // ============================================

  protected async createAnimations(): Promise<void> {
    const masterTimeline = gsap.timeline();

    // 1. Soldier climbs up (1s)
    if (this.mainSoldier) {
      masterTimeline.to(this.mainSoldier, {
        y: this.config.height * 0.7 - 40,
        duration: 1,
        ease: 'power2.inOut',
      });
    }

    // 2. Flag pole appears (0.5s)
    if (this.flagPole) {
      masterTimeline.to(
        this.flagPole,
        {
          opacity: 1,
          duration: 0.5,
        },
        '-=0.5'
      );
    }

    // 3. Flag unfurls (1s)
    if (this.flag) {
      masterTimeline.to(
        this.flag,
        {
          opacity: 1,
          scaleX: 1.2,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
        },
        '-=0.3'
      );

      // Flag wave animation (continuous)
      const flagWave = gsap.timeline({ repeat: -1, yoyo: true });
      flagWave.to(this.flag, {
        skewX: 5,
        scaleX: 1.1,
        duration: 0.8,
        ease: 'sine.inOut',
      });
      this.animations.push(flagWave);
    }

    // 4. Victory light burst
    const effectsLayer = this.getLayer('effects')!;
    const lightBurst = new Konva.Circle({
      x: this.config.width * 0.5,
      y: this.config.height * 0.7 - 150,
      radius: 0,
      fill: '#ffcd00',
      opacity: 0.5,
    });
    effectsLayer.add(lightBurst);

    masterTimeline.to(
      lightBurst,
      {
        radius: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
      },
      '-=0.5'
    );

    this.animations.push(masterTimeline);
  }
}
