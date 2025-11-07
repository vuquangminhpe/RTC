import Konva from 'konva';
import gsap from 'gsap';
import { BaseIllustration } from './BaseIllustration';
import type { IllustrationConfig } from './BaseIllustration';

// ============================================
// SAIGON 1975 ILLUSTRATION
// Tank 390 breaking through Independence Palace gates
// ============================================

export class Saigon1975Scene extends BaseIllustration {
  private tank: Konva.Group | null = null;
  private gate: Konva.Group | null = null;
  private palace: Konva.Group | null = null;
  private soldiers: Konva.Group[] = [];
  private flagOnTank: Konva.Group | null = null;

  constructor(config: IllustrationConfig) {
    super(config);
  }

  protected async setup(): Promise<void> {
    const bgLayer = this.getLayer('background')!;
    const mainLayer = this.getLayer('main')!;
    const fgLayer = this.getLayer('foreground')!;
    const effectsLayer = this.getLayer('effects')!;

    // Draw victory sky
    this.drawVictorySky(bgLayer);

    // Draw Independence Palace
    this.palace = this.drawPalace(bgLayer);

    // Draw palace gates
    this.gate = this.drawGate(mainLayer);

    // Draw Tank 390
    this.tank = this.drawTank390(mainLayer);

    // Draw victory flag on tank
    this.flagOnTank = this.drawTankFlag(mainLayer);

    // Draw soldiers following tank
    this.drawSoldiersFollowing(mainLayer);

    // Draw soldiers on tank
    this.drawSoldiersOnTank(mainLayer);

    // Draw dust and debris
    this.drawDustEffects(effectsLayer);

    // Draw victory fireworks
    this.drawFireworks(effectsLayer);

    bgLayer.batchDraw();
    mainLayer.batchDraw();
    fgLayer.batchDraw();
    effectsLayer.batchDraw();
  }

  // ============================================
  // BACKGROUND
  // ============================================

  private drawVictorySky(layer: Konva.Layer): void {
    // Spring victory sky
    const sky = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height * 0.7,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: this.config.height * 0.7 },
      fillLinearGradientColorStops: [
        0,
        '#1e3a8a', // Deep blue
        0.4,
        '#3b82f6', // Blue
        0.7,
        '#93c5fd', // Light blue
        1,
        '#dbeafe', // Very light blue
      ],
    });
    layer.add(sky);

    // Victory sun
    this.drawSun(layer, this.config.width * 0.7, this.config.height * 0.2, 45, '#fbbf24');

    // Clouds
    for (let i = 0; i < 5; i++) {
      this.drawCloud(layer, Math.random() * this.config.width, Math.random() * (this.config.height * 0.3), 0.8 + Math.random() * 0.4);
    }
  }

  private drawPalace(layer: Konva.Layer): Konva.Group {
    const palace = new Konva.Group({
      x: this.config.width * 0.5,
      y: this.config.height * 0.45,
    });

    // Main building (simplified Independence Palace)
    const mainBuilding = new Konva.Rect({
      x: -150,
      y: -80,
      width: 300,
      height: 120,
      fill: '#F5F5DC',
      stroke: '#D3D3D3',
      strokeWidth: 2,
    });

    // Windows (grid pattern)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        const window = new Konva.Rect({
          x: -130 + col * 35,
          y: -70 + row * 25,
          width: 15,
          height: 20,
          fill: '#4682B4',
          stroke: '#2F4F4F',
          strokeWidth: 1,
        });
        palace.add(window);
      }
    }

    // Roof
    const roof = new Konva.Line({
      points: [-160, -80, 0, -110, 160, -80],
      fill: '#8B4513',
      stroke: '#654321',
      strokeWidth: 2,
      closed: true,
    });

    // Central tower
    const tower = new Konva.Rect({
      x: -30,
      y: -130,
      width: 60,
      height: 50,
      fill: '#F5F5DC',
      stroke: '#D3D3D3',
      strokeWidth: 2,
    });

    // Balcony
    const balcony = new Konva.Rect({
      x: -170,
      y: 40,
      width: 340,
      height: 10,
      fill: '#D2691E',
      stroke: '#8B4513',
      strokeWidth: 2,
    });

    // Pillars
    for (let i = 0; i < 6; i++) {
      const pillar = new Konva.Rect({
        x: -140 + i * 56,
        y: 0,
        width: 12,
        height: 40,
        fill: '#FFFFFF',
        stroke: '#D3D3D3',
        strokeWidth: 1,
      });
      palace.add(pillar);
    }

    palace.add(mainBuilding, roof, tower, balcony);
    layer.add(palace);

    return palace;
  }

  // ============================================
  // MAIN ELEMENTS
  // ============================================

  private drawGate(layer: Konva.Layer): Konva.Group {
    const gate = new Konva.Group({
      x: this.config.width * 0.5,
      y: this.config.height * 0.7,
    });

    // Gate posts
    const leftPost = new Konva.Rect({
      x: -150,
      y: -80,
      width: 20,
      height: 80,
      fill: '#8B4513',
      stroke: '#654321',
      strokeWidth: 2,
    });

    const rightPost = new Konva.Rect({
      x: 130,
      y: -80,
      width: 20,
      height: 80,
      fill: '#8B4513',
      stroke: '#654321',
      strokeWidth: 2,
    });

    // Gate bars (metal)
    const gateLeft = new Konva.Group({ x: -130, y: -80 });
    const gateRight = new Konva.Group({ x: 10, y: -80 });

    // Vertical bars
    for (let i = 0; i < 8; i++) {
      const barLeft = new Konva.Rect({
        x: i * 15,
        y: 0,
        width: 4,
        height: 80,
        fill: '#2F4F4F',
        stroke: '#1C1C1C',
        strokeWidth: 1,
      });

      const barRight = new Konva.Rect({
        x: i * 15,
        y: 0,
        width: 4,
        height: 80,
        fill: '#2F4F4F',
        stroke: '#1C1C1C',
        strokeWidth: 1,
      });

      gateLeft.add(barLeft);
      gateRight.add(barRight);
    }

    // Horizontal bars
    for (let i = 0; i < 3; i++) {
      const hBarLeft = new Konva.Rect({
        x: 0,
        y: i * 30,
        width: 120,
        height: 3,
        fill: '#2F4F4F',
      });

      const hBarRight = new Konva.Rect({
        x: 0,
        y: i * 30,
        width: 120,
        height: 3,
        fill: '#2F4F4F',
      });

      gateLeft.add(hBarLeft);
      gateRight.add(hBarRight);
    }

    gate.add(leftPost, rightPost, gateLeft, gateRight);
    layer.add(gate);

    return gate;
  }

  private drawTank390(layer: Konva.Layer): Konva.Group {
    const tank = new Konva.Group({
      x: this.config.width * 0.2, // Start from left
      y: this.config.height * 0.78,
    });

    // Tank body (T-54 style)
    const body = new Konva.Rect({
      x: -60,
      y: -30,
      width: 120,
      height: 40,
      fill: '#556B2F',
      stroke: '#3D4F1F',
      strokeWidth: 2,
      cornerRadius: 5,
    });

    // Tank turret
    const turret = new Konva.Ellipse({
      x: 0,
      y: -30,
      radiusX: 35,
      radiusY: 20,
      fill: '#6B8E23',
      stroke: '#4F6F1F',
      strokeWidth: 2,
    });

    // Tank cannon
    const cannon = new Konva.Rect({
      x: 0,
      y: -35,
      width: 70,
      height: 8,
      fill: '#2F4F2F',
      stroke: '#1C1C1C',
      strokeWidth: 1,
      offsetY: 4,
    });

    // Tracks (wheels)
    const wheelPositions = [-40, -20, 0, 20, 40];
    wheelPositions.forEach((xPos) => {
      const wheel = new Konva.Circle({
        x: xPos,
        y: -5,
        radius: 8,
        fill: '#1C1C1C',
        stroke: '#000000',
        strokeWidth: 2,
      });

      const innerWheel = new Konva.Circle({
        x: xPos,
        y: -5,
        radius: 4,
        fill: '#4F4F4F',
      });

      tank.add(wheel, innerWheel);
    });

    // Track belt
    const trackTop = new Konva.Line({
      points: [-50, -5, 50, -5],
      stroke: '#1C1C1C',
      strokeWidth: 12,
      lineCap: 'round',
    });

    const trackBottom = new Konva.Line({
      points: [-50, 5, 50, 5],
      stroke: '#1C1C1C',
      strokeWidth: 12,
      lineCap: 'round',
    });

    // Tank number "390"
    const number = new Konva.Text({
      x: -20,
      y: -25,
      text: '390',
      fontSize: 18,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#FFFFFF',
    });

    // Details (hatches, vents)
    const hatch = new Konva.Circle({
      x: 0,
      y: -30,
      radius: 5,
      fill: '#4F4F4F',
      stroke: '#2F2F2F',
      strokeWidth: 1,
    });

    // Add dust behind wheels
    this.addTankDust(tank);

    tank.add(trackBottom, trackTop, body, turret, cannon, hatch, number);
    layer.add(tank);

    return tank;
  }

  private addTankDust(tank: Konva.Group): void {
    for (let i = 0; i < 10; i++) {
      const dust = new Konva.Circle({
        x: -70 - i * 5,
        y: 0 + Math.random() * 10,
        radius: 5 + Math.random() * 10,
        fill: '#D2B48C',
        opacity: 0.3 - i * 0.02,
      });
      tank.add(dust);
    }
  }

  private drawTankFlag(layer: Konva.Layer): Konva.Group {
    const flagGroup = new Konva.Group({
      x: this.config.width * 0.2,
      y: this.config.height * 0.78 - 50,
    });

    // Flag pole
    const pole = new Konva.Line({
      points: [0, 0, 0, -40],
      stroke: '#8B7355',
      strokeWidth: 3,
    });

    // Flag
    const flag = new Konva.Rect({
      x: 0,
      y: -40,
      width: 50,
      height: 33,
      fill: '#da251d',
    });

    // Star
    const star = new Konva.Star({
      x: 25,
      y: -40 + 16.5,
      numPoints: 5,
      innerRadius: 5,
      outerRadius: 10,
      fill: '#ffcd00',
    });

    flagGroup.add(pole, flag, star);
    layer.add(flagGroup);

    return flagGroup;
  }

  private drawSoldiersFollowing(layer: Konva.Layer): void {
    // Soldiers running behind tank
    for (let i = 0; i < 8; i++) {
      const x = this.config.width * 0.1 - i * 25;
      const y = this.config.height * 0.8 + (Math.random() - 0.5) * 20;

      const soldier = this.createPerson(x, y, 0.7, '#4a5f3a');

      // Add rifle
      const rifle = new Konva.Line({
        points: [10, -25, 20, -15],
        stroke: '#2a2a2a',
        strokeWidth: 3,
      });
      soldier.add(rifle);

      // Running animation
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(soldier, {
        x: x + 10,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'none',
      });
      this.animations.push(tl);

      layer.add(soldier);
      this.soldiers.push(soldier);
    }
  }

  private drawSoldiersOnTank(layer: Konva.Layer): void {
    // Soldiers sitting on tank
    const positions = [
      { x: -40, y: -40 },
      { x: -20, y: -45 },
      { x: 20, y: -45 },
    ];

    positions.forEach((pos) => {
      const soldier = new Konva.Group({
        x: this.config.width * 0.2 + pos.x,
        y: this.config.height * 0.78 + pos.y,
      });

      // Simplified seated soldier
      const head = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 6,
        fill: '#d4a574',
      });

      const helmet = new Konva.Arc({
        x: 0,
        y: -3,
        innerRadius: 0,
        outerRadius: 7,
        angle: 180,
        fill: '#4a5f3a',
        rotation: 180,
      });

      const body = new Konva.Rect({
        x: -5,
        y: 6,
        width: 10,
        height: 15,
        fill: '#4a5f3a',
      });

      // Arm raised (celebrating)
      const arm = new Konva.Line({
        points: [0, 10, -10, -5],
        stroke: '#4a5f3a',
        strokeWidth: 3,
        lineCap: 'round',
      });

      soldier.add(body, head, helmet, arm);
      layer.add(soldier);

      // Celebrate animation
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(arm, {
        rotation: 20,
        duration: 0.5,
        ease: 'sine.inOut',
      });
      this.animations.push(tl);
    });
  }

  // ============================================
  // EFFECTS
  // ============================================

  private drawDustEffects(layer: Konva.Layer): void {
    // Dust clouds from tank movement
    for (let i = 0; i < 20; i++) {
      const dust = new Konva.Circle({
        x: this.config.width * 0.2 - 80,
        y: this.config.height * 0.8,
        radius: 10 + Math.random() * 20,
        fill: '#D2B48C',
        opacity: 0.4,
      });

      layer.add(dust);

      // Dust spread animation
      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 2 });
      tl.to(dust, {
        radius: dust.radius() + 30,
        opacity: 0,
        duration: 2,
        ease: 'power1.out',
        onComplete: () => {
          dust.radius(10 + Math.random() * 20);
          dust.opacity(0.4);
        },
      });
      this.animations.push(tl);
    }
  }

  private drawFireworks(layer: Konva.Layer): void {
    // Victory fireworks in sky
    const fireworkCount = 5;
    for (let i = 0; i < fireworkCount; i++) {
      const x = this.config.width * (0.3 + Math.random() * 0.4);
      const y = this.config.height * (0.2 + Math.random() * 0.3);

      // Create firework burst
      this.createFireworkBurst(layer, x, y, i);
    }
  }

  private createFireworkBurst(layer: Konva.Layer, x: number, y: number, delay: number): void {
    const colors = ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF', '#FF6BCF'];
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;

      const particle = new Konva.Circle({
        x: x,
        y: y,
        radius: 3,
        fill: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
      });

      layer.add(particle);

      const tl = gsap.timeline({ repeat: -1, delay: delay * 1.5 });
      tl.to(particle, {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        opacity: 0,
        radius: 0,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          particle.x(x);
          particle.y(y);
          particle.opacity(1);
          particle.radius(3);
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

    // 1. Tank charges forward
    if (this.tank) {
      masterTimeline.to(this.tank, {
        x: this.config.width * 0.5,
        duration: 3,
        ease: 'power2.inOut',
      });

      // Flag moves with tank
      if (this.flagOnTank) {
        masterTimeline.to(
          this.flagOnTank,
          {
            x: this.config.width * 0.5,
            duration: 3,
            ease: 'power2.inOut',
          },
          '<'
        );
      }

      // Soldiers move with tank
      this.soldiers.forEach((soldier, _i) => {
        masterTimeline.to(
          soldier,
          {
            x: soldier.x() + this.config.width * 0.3,
            duration: 3,
            ease: 'power2.inOut',
          },
          '<'
        );
      });
    }

    // 2. Gate breaks/opens
    if (this.gate) {
      masterTimeline.to(
        this.gate.children![2], // Left gate part
        {
          x: this.gate.children![2].x() - 80,
          rotation: -30,
          duration: 0.8,
          ease: 'bounce.out',
        },
        '-=0.5'
      );

      masterTimeline.to(
        this.gate.children![3], // Right gate part
        {
          x: this.gate.children![3].x() + 80,
          rotation: 30,
          duration: 0.8,
          ease: 'bounce.out',
        },
        '<'
      );
    }

    // 3. Flash effect on impact
    const effectsLayer = this.getLayer('effects')!;
    const flash = new Konva.Circle({
      x: this.config.width * 0.5,
      y: this.config.height * 0.7,
      radius: 0,
      fill: '#FFFFFF',
      opacity: 0.8,
    });
    effectsLayer.add(flash);

    masterTimeline.to(
      flash,
      {
        radius: 150,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.8'
    );

    // 4. Camera shake effect (simulate)
    if (this.palace) {
      masterTimeline.to(
        this.palace,
        {
          x: this.palace.x() + 5,
          y: this.palace.y() + 5,
          duration: 0.05,
          yoyo: true,
          repeat: 10,
        },
        '-=0.5'
      );
    }

    // 5. Flag wave on tank
    if (this.flagOnTank) {
      const flagWave = gsap.timeline({ repeat: -1, yoyo: true });
      flagWave.to(this.flagOnTank.children![1], {
        // Flag rect
        skewX: 10,
        duration: 0.6,
        ease: 'sine.inOut',
      });
      flagWave.to(
        this.flagOnTank.children![2],
        {
          // Star
          x: this.flagOnTank.children![2].x() + 3,
          duration: 0.6,
          ease: 'sine.inOut',
        },
        '<'
      );
      this.animations.push(flagWave);
    }

    this.animations.push(masterTimeline);
  }
}
