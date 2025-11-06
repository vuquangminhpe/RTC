import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';
import gsap from 'gsap';

// ============================================
// BASE ILLUSTRATION CLASS
// All historical illustrations extend this
// ============================================

export interface IllustrationConfig {
  width: number;
  height: number;
  container: string;
  backgroundColor?: string;
}

export abstract class BaseIllustration {
  protected stage: Stage | null = null;
  protected layers: Map<string, Layer> = new Map();
  protected animations: gsap.core.Timeline[] = [];
  protected config: IllustrationConfig;
  protected isInitialized = false;
  protected isAnimating = false;

  constructor(config: IllustrationConfig) {
    this.config = config;
  }

  /**
   * Initialize the Konva stage and layers
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Create stage
    const container = document.getElementById(this.config.container);
    if (!container) {
      throw new Error(`Container ${this.config.container} not found`);
    }

    this.stage = new Konva.Stage({
      container: this.config.container,
      width: this.config.width,
      height: this.config.height,
    });

    // Create layers
    this.createLayers();

    // Setup the scene
    await this.setup();

    this.isInitialized = true;
  }

  /**
   * Create layers for the illustration
   * Override this to add custom layers
   */
  protected createLayers(): void {
    const backgroundLayer = new Konva.Layer();
    const mainLayer = new Konva.Layer();
    const foregroundLayer = new Konva.Layer();
    const effectsLayer = new Konva.Layer();

    this.layers.set('background', backgroundLayer);
    this.layers.set('main', mainLayer);
    this.layers.set('foreground', foregroundLayer);
    this.layers.set('effects', effectsLayer);

    // Add layers to stage
    this.stage?.add(backgroundLayer);
    this.stage?.add(mainLayer);
    this.stage?.add(foregroundLayer);
    this.stage?.add(effectsLayer);

    // Draw background color
    if (this.config.backgroundColor) {
      const bg = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.config.width,
        height: this.config.height,
        fill: this.config.backgroundColor,
      });
      backgroundLayer.add(bg);
    }
  }

  /**
   * Setup the illustration - draw elements
   * Override this in child classes
   */
  protected abstract setup(): Promise<void>;

  /**
   * Play the animation
   */
  public async play(): Promise<void> {
    if (this.isAnimating) return;

    this.isAnimating = true;

    // Stop all existing animations
    this.animations.forEach((anim) => anim.kill());
    this.animations = [];

    // Create and play new animations
    await this.createAnimations();

    // Play all animations
    this.animations.forEach((anim) => anim.play());
  }

  /**
   * Create animations for the illustration
   * Override this in child classes
   */
  protected abstract createAnimations(): Promise<void>;

  /**
   * Stop all animations
   */
  public stop(): void {
    this.animations.forEach((anim) => anim.kill());
    this.animations = [];
    this.isAnimating = false;
  }

  /**
   * Pause animations
   */
  public pause(): void {
    this.animations.forEach((anim) => anim.pause());
    this.isAnimating = false;
  }

  /**
   * Resume animations
   */
  public resume(): void {
    this.animations.forEach((anim) => anim.resume());
    this.isAnimating = true;
  }

  /**
   * Reset illustration to initial state
   */
  public reset(): void {
    this.stop();
    this.layers.forEach((layer) => layer.destroyChildren());
    this.setup();
  }

  /**
   * Resize illustration
   */
  public resize(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;
    this.stage?.size({ width, height });

    // Redraw background
    const bgLayer = this.layers.get('background');
    const bg = bgLayer?.findOne('Rect');
    if (bg) {
      bg.size({ width, height });
      bgLayer?.batchDraw();
    }
  }

  /**
   * Destroy illustration and cleanup
   */
  public destroy(): void {
    this.stop();
    this.stage?.destroy();
    this.stage = null;
    this.layers.clear();
    this.isInitialized = false;
  }

  /**
   * Get layer by name
   */
  protected getLayer(name: string): Layer | undefined {
    return this.layers.get(name);
  }

  /**
   * Helper: Draw gradient sky
   */
  protected drawGradientSky(layer: Layer, colors: string[]): void {
    const sky = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height * 0.6,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: this.config.height * 0.6 },
      fillLinearGradientColorStops: this.createGradientStops(colors),
    });
    layer.add(sky);
  }

  /**
   * Helper: Draw ground
   */
  protected drawGround(layer: Layer, color: string, y: number): void {
    const ground = new Konva.Rect({
      x: 0,
      y: y,
      width: this.config.width,
      height: this.config.height - y,
      fill: color,
    });
    layer.add(ground);
  }

  /**
   * Helper: Draw mountain silhouette
   */
  protected drawMountains(
    layer: Layer,
    points: number[],
    fill: string,
    opacity: number = 1
  ): Konva.Line {
    const mountain = new Konva.Line({
      points: points,
      fill: fill,
      opacity: opacity,
      closed: true,
      strokeWidth: 0,
    });
    layer.add(mountain);
    return mountain;
  }

  /**
   * Helper: Draw stars
   */
  protected drawStars(layer: Layer, count: number, color: string = '#ffffff'): void {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.config.width;
      const y = Math.random() * (this.config.height * 0.4);
      const radius = Math.random() * 2 + 1;

      const star = new Konva.Star({
        x: x,
        y: y,
        numPoints: 5,
        innerRadius: radius * 0.5,
        outerRadius: radius,
        fill: color,
        opacity: Math.random() * 0.5 + 0.5,
      });

      layer.add(star);

      // Twinkle animation
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(star, {
        opacity: Math.random() * 0.3 + 0.2,
        duration: Math.random() * 2 + 1,
        ease: 'sine.inOut',
      });
      this.animations.push(tl);
    }
  }

  /**
   * Helper: Create gradient stops array
   */
  private createGradientStops(colors: string[]): number[] {
    const stops: number[] = [];
    colors.forEach((color, index) => {
      stops.push(index / (colors.length - 1));
      stops.push(color as any);
    });
    return stops;
  }

  /**
   * Helper: Draw cloud
   */
  protected drawCloud(layer: Layer, x: number, y: number, scale: number = 1): Konva.Group {
    const cloud = new Konva.Group({
      x: x,
      y: y,
      scaleX: scale,
      scaleY: scale,
    });

    const circles = [
      { x: 0, y: 0, radius: 20 },
      { x: 25, y: -5, radius: 25 },
      { x: 50, y: 0, radius: 20 },
      { x: 35, y: 5, radius: 18 },
      { x: 15, y: 5, radius: 15 },
    ];

    circles.forEach((c) => {
      const circle = new Konva.Circle({
        x: c.x,
        y: c.y,
        radius: c.radius,
        fill: '#ffffff',
        opacity: 0.8,
      });
      cloud.add(circle);
    });

    layer.add(cloud);
    return cloud;
  }

  /**
   * Helper: Draw sun/moon
   */
  protected drawSun(layer: Layer, x: number, y: number, radius: number, color: string): Konva.Circle {
    const sun = new Konva.Circle({
      x: x,
      y: y,
      radius: radius,
      fill: color,
      shadowColor: color,
      shadowBlur: 30,
      shadowOpacity: 0.5,
    });
    layer.add(sun);
    return sun;
  }

  /**
   * Helper: Create simple person silhouette
   */
  protected createPerson(x: number, y: number, scale: number = 1, color: string = '#000000'): Konva.Group {
    const person = new Konva.Group({
      x: x,
      y: y,
      scaleX: scale,
      scaleY: scale,
    });

    // Head
    const head = new Konva.Circle({
      x: 0,
      y: -30,
      radius: 8,
      fill: color,
    });

    // Body
    const body = new Konva.Rect({
      x: -5,
      y: -22,
      width: 10,
      height: 20,
      fill: color,
    });

    // Legs
    const leftLeg = new Konva.Line({
      points: [0, -2, -5, 10],
      stroke: color,
      strokeWidth: 3,
    });

    const rightLeg = new Konva.Line({
      points: [0, -2, 5, 10],
      stroke: color,
      strokeWidth: 3,
    });

    // Arms
    const leftArm = new Konva.Line({
      points: [0, -18, -8, -10],
      stroke: color,
      strokeWidth: 3,
    });

    const rightArm = new Konva.Line({
      points: [0, -18, 8, -10],
      stroke: color,
      strokeWidth: 3,
    });

    person.add(head, body, leftLeg, rightLeg, leftArm, rightArm);

    return person;
  }
}
