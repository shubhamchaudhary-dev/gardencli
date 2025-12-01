import { EmotionVector } from './db.js';

interface LSystemRule {
  from: string;
  to: string;
}

interface PlantConfig {
  axiom: string;
  rules: LSystemRule[];
  iterations: number;
  angleVariation: number;
  branchingFactor: number;
  symmetry: number;
}

export class LSystemPlant {
  private emotion: EmotionVector;
  private config: PlantConfig;
  private generated: string;

  constructor(emotion: EmotionVector, health: number, growthStage: number) {
    this.emotion = emotion;
    this.config = this.createConfigFromEmotion(health, growthStage);
    this.generated = this.generate();
  }

  private createConfigFromEmotion(health: number, growthStage: number): PlantConfig {
    const { energy, melancholy, chaos, peace } = this.emotion;

    // Base iterations on growth stage and energy
    const iterations = Math.floor(2 + growthStage * 2 + energy * 2);

    // Angle variation based on chaos
    const angleVariation = 15 + chaos * 30;

    // Branching factor based on energy and chaos
    const branchingFactor = 0.5 + energy * 0.3 + chaos * 0.2;

    // Symmetry based on peace
    const symmetry = peace * 0.8 + 0.2;

    // Choose axiom and rules based on dominant emotion
    let axiom = 'F';
    let rules: LSystemRule[] = [];

    if (melancholy > 0.4) {
      // Drooping, wilted plant
      axiom = 'X';
      rules = [
        { from: 'X', to: 'F[-X][\\X]' },
        { from: 'F', to: 'FF' },
      ];
    } else if (chaos > 0.4) {
      // Wild, tangled plant
      axiom = 'F';
      rules = [
        { from: 'F', to: 'F[+F]F[-F][F]' },
        { from: 'X', to: 'FF-[X+F]+[X-F]' },
      ];
    } else if (peace > 0.4) {
      // Symmetric, balanced plant
      axiom = 'X';
      rules = [
        { from: 'X', to: 'F[+X][-X]FX' },
        { from: 'F', to: 'FF' },
      ];
    } else {
      // Energetic, growing plant
      axiom = 'X';
      rules = [
        { from: 'X', to: 'F+[[X]-X]-F[-FX]+X' },
        { from: 'F', to: 'FF' },
      ];
    }

    // Adjust iterations based on health
    const healthFactor = health / 100;
    const adjustedIterations = Math.max(1, Math.floor(iterations * healthFactor));

    return {
      axiom,
      rules,
      iterations: Math.min(adjustedIterations, 5), // Cap at 5 to prevent explosion
      angleVariation,
      branchingFactor,
      symmetry,
    };
  }

  private generate(): string {
    let current = this.config.axiom;

    for (let i = 0; i < this.config.iterations; i++) {
      let next = '';
      
      for (const char of current) {
        const rule = this.config.rules.find(r => r.from === char);
        next += rule ? rule.to : char;
      }
      
      current = next;
    }

    return current;
  }

  public renderToASCII(width: number = 40, height: number = 20, frame: number = 0): string[] {
    const canvas: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
    
    // Start from bottom center
    let x = Math.floor(width / 2);
    let y = height - 1;
    let angle = -90; // Point up
    
    const stack: Array<{ x: number; y: number; angle: number }> = [];
    
    // Animation sway
    const swayOffset = Math.sin(frame * 0.05) * 2;
    
    const { energy, melancholy, chaos } = this.emotion;
    
    // Step size based on emotions
    const stepSize = 1 + energy * 0.5;
    
    // Angle change
    const angleChange = 20 + chaos * 15;

    for (const char of this.generated) {
      switch (char) {
        case 'F': // Move forward and draw
          const rad = (angle * Math.PI) / 180;
          const newX = Math.round(x + Math.cos(rad) * stepSize);
          const newY = Math.round(y + Math.sin(rad) * stepSize);
          
          // Add sway to x position
          const swayedX = Math.round(newX + swayOffset * (1 - y / height));
          
          if (swayedX >= 0 && swayedX < width && newY >= 0 && newY < height) {
            // Choose character based on position and emotion
            let drawChar = '|';
            
            if (y < height * 0.3) {
              // Top part - leaves and flowers
              if (melancholy > 0.4) {
                drawChar = Math.random() > 0.5 ? '.' : ',';
              } else if (energy > 0.4) {
                drawChar = Math.random() > 0.7 ? '*' : Math.random() > 0.5 ? '+' : '❀';
              } else {
                drawChar = Math.random() > 0.6 ? 'o' : '@';
              }
            } else if (y < height * 0.7) {
              // Middle - branches
              if (Math.abs(angle) > 45) {
                drawChar = angle > 0 ? '/' : '\\';
              } else {
                drawChar = '|';
              }
            } else {
              // Bottom - trunk
              drawChar = melancholy > 0.5 ? '|' : '‖';
            }
            
            canvas[newY][swayedX] = drawChar;
            x = newX;
            y = newY;
          }
          break;
          
        case '+': // Turn right
          angle += angleChange;
          break;
          
        case '-': // Turn left
          angle -= angleChange;
          break;
          
        case '[': // Push position
          stack.push({ x, y, angle });
          break;
          
        case ']': // Pop position
          if (stack.length > 0) {
            const pos = stack.pop()!;
            x = pos.x;
            y = pos.y;
            angle = pos.angle;
          }
          break;
          
        case '\\': // Small turn
          angle += angleChange / 2;
          break;
      }
    }

    // Add roots at the bottom
    const rootY = height - 1;
    const rootChars = ['~', '≈', '∼'];
    for (let i = -3; i <= 3; i++) {
      const rootX = Math.floor(width / 2) + i;
      if (rootX >= 0 && rootX < width) {
        canvas[rootY][rootX] = rootChars[Math.abs(i) % rootChars.length];
      }
    }

    // Convert canvas to strings
    return canvas.map(row => row.join(''));
  }

  public getComplexity(): number {
    return this.generated.length;
  }

  public getDescription(): string {
    const { energy, melancholy, chaos, peace } = this.emotion;
    
    const descriptions: string[] = [];
    
    if (melancholy > 0.4) descriptions.push('wilted');
    if (energy > 0.4) descriptions.push('vibrant');
    if (chaos > 0.4) descriptions.push('wild');
    if (peace > 0.4) descriptions.push('serene');
    
    if (descriptions.length === 0) descriptions.push('growing');
    
    return descriptions.join(', ');
  }
}
