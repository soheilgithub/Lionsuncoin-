// AI Emotion Detection System for Lionsun Game
// Uses multiple inputs: camera, audio, gameplay patterns

export interface EmotionData {
  primary: 'happy' | 'excited' | 'frustrated' | 'focused' | 'bored' | 'challenged' | 'calm' | 'angry';
  confidence: number; // 0-1
  secondary?: string[];
  timestamp: number;
  sources: {
    facial?: FacialEmotionData;
    audio?: AudioEmotionData;
    gameplay?: GameplayEmotionData;
    biometric?: BiometricData;
  };
}

interface FacialEmotionData {
  emotions: Record<string, number>;
  landmarks: number[][];
  eyeGaze: { x: number; y: number };
  blinkRate: number;
  expressionIntensity: number;
}

interface AudioEmotionData {
  pitch: number;
  energy: number;
  tempo: number;
  voiceStress: number;
  breathing: number;
  keywords: string[];
}

interface GameplayEmotionData {
  clickIntensity: number;
  mouseMovements: number;
  pauseFrequency: number;
  errorRate: number;
  decisionTime: number;
  retryCount: number;
}

interface BiometricData {
  heartRate?: number;
  skinConductance?: number;
  bodyTemperature?: number;
}

export class EmotionDetectionSystem {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private isDetecting = false;
  private emotionHistory: EmotionData[] = [];
  private callbacks: ((emotion: EmotionData) => void)[] = [];

  // Face detection model (simplified - in real app would use TensorFlow.js)
  private faceModel: any = null;
  
  // Gameplay tracking
  private gameplayMetrics = {
    mouseClicks: 0,
    mouseMovements: 0,
    lastClickIntensity: 0,
    pauseCount: 0,
    errorCount: 0,
    sessionStartTime: Date.now(),
    lastActionTime: Date.now()
  };

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    // Track mouse movements and clicks for gameplay emotion detection
    document.addEventListener('mousemove', (e) => {
      this.gameplayMetrics.mouseMovements++;
      this.gameplayMetrics.lastActionTime = Date.now();
    });

    document.addEventListener('click', (e) => {
      this.gameplayMetrics.mouseClicks++;
      // Calculate click intensity based on rapid clicks
      const now = Date.now();
      const timeSinceLastAction = now - this.gameplayMetrics.lastActionTime;
      this.gameplayMetrics.lastClickIntensity = timeSinceLastAction < 100 ? 1 : 0;
      this.gameplayMetrics.lastActionTime = now;
    });

    // Track keyboard patterns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Pause') {
        this.gameplayMetrics.pauseCount++;
      }
      this.gameplayMetrics.lastActionTime = Date.now();
    });
  }

  async initialize(): Promise<boolean> {
    try {
      // Request camera and microphone permissions
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Initialize audio context for voice analysis
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Load AI models (in real implementation)
      await this.loadEmotionModels();
      
      return true;
    } catch (error) {
      console.warn('Emotion detection not available:', error);
      return false;
    }
  }

  private async loadEmotionModels() {
    // In a real implementation, load TensorFlow.js models:
    // - Face emotion recognition model
    // - Audio emotion classification model
    // - Gesture recognition model
    
    // Simulated model loading
    this.faceModel = {
      detectEmotions: this.simulateFaceEmotionDetection.bind(this),
      isLoaded: true
    };
  }

  async startDetection(): Promise<void> {
    if (!this.mediaStream || this.isDetecting) return;
    
    this.isDetecting = true;
    
    // Start video analysis
    const video = document.createElement('video');
    video.srcObject = this.mediaStream;
    video.play();
    
    // Start audio analysis
    this.startAudioAnalysis();
    
    // Main detection loop
    const detectLoop = () => {
      if (!this.isDetecting) return;
      
      this.processFrame(video);
      requestAnimationFrame(detectLoop);
    };
    
    video.onloadedmetadata = () => {
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
      detectLoop();
    };
  }

  private startAudioAnalysis() {
    if (!this.audioContext || !this.mediaStream) return;
    
    const audioStream = this.mediaStream.getAudioTracks()[0];
    const source = this.audioContext.createMediaStreamSource(new MediaStream([audioStream]));
    const analyser = this.audioContext.createAnalyser();
    
    analyser.fftSize = 256;
    source.connect(analyser);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const analyzeAudio = () => {
      if (!this.isDetecting) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Analyze audio for emotion indicators
      const audioEmotion = this.analyzeAudioEmotion(dataArray);
      
      setTimeout(analyzeAudio, 100); // Analyze every 100ms
    };
    
    analyzeAudio();
  }

  private processFrame(video: HTMLVideoElement) {
    // Draw current frame to canvas for analysis
    this.context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
    
    // Get image data for face analysis
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Analyze facial emotions
    const facialEmotion = this.faceModel?.detectEmotions(imageData);
    
    // Analyze gameplay patterns
    const gameplayEmotion = this.analyzeGameplayPatterns();
    
    // Combine all emotion sources
    const combinedEmotion = this.combineEmotionSources(facialEmotion, null, gameplayEmotion);
    
    if (combinedEmotion) {
      this.emotionHistory.push(combinedEmotion);
      this.notifyCallbacks(combinedEmotion);
      
      // Keep only last 50 emotion readings
      if (this.emotionHistory.length > 50) {
        this.emotionHistory.shift();
      }
    }
  }

  private simulateFaceEmotionDetection(imageData: ImageData): FacialEmotionData {
    // Simulated facial emotion detection
    // In real implementation, this would use AI models like FaceAPI.js or TensorFlow.js
    
    const emotions = {
      happy: Math.random() * 0.3,
      excited: Math.random() * 0.4,
      frustrated: Math.random() * 0.2,
      focused: Math.random() * 0.6,
      bored: Math.random() * 0.1,
      calm: Math.random() * 0.4,
      angry: Math.random() * 0.1
    };
    
    // Normalize emotions
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    Object.keys(emotions).forEach(key => {
      emotions[key as keyof typeof emotions] /= total;
    });
    
    return {
      emotions,
      landmarks: [], // Would contain facial landmark points
      eyeGaze: { x: Math.random(), y: Math.random() },
      blinkRate: 15 + Math.random() * 10,
      expressionIntensity: Math.random()
    };
  }

  private analyzeAudioEmotion(audioData: Uint8Array): AudioEmotionData {
    // Analyze audio frequency data for emotional indicators
    const avgFrequency = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
    const pitch = this.calculatePitch(audioData);
    const energy = this.calculateEnergy(audioData);
    
    return {
      pitch,
      energy,
      tempo: 120 + Math.random() * 60, // BPM
      voiceStress: energy > 128 ? 0.7 : 0.3,
      breathing: Math.random(),
      keywords: [] // Would contain detected emotional keywords
    };
  }

  private calculatePitch(audioData: Uint8Array): number {
    // Simplified pitch detection
    let maxIndex = 0;
    let maxValue = 0;
    
    for (let i = 0; i < audioData.length; i++) {
      if (audioData[i] > maxValue) {
        maxValue = audioData[i];
        maxIndex = i;
      }
    }
    
    return maxIndex * (44100 / 2) / audioData.length; // Convert to Hz
  }

  private calculateEnergy(audioData: Uint8Array): number {
    return audioData.reduce((sum, val) => sum + val * val, 0) / audioData.length;
  }

  private analyzeGameplayPatterns(): GameplayEmotionData {
    const now = Date.now();
    const sessionDuration = now - this.gameplayMetrics.sessionStartTime;
    const timeSinceLastAction = now - this.gameplayMetrics.lastActionTime;
    
    // Calculate metrics
    const clicksPerMinute = (this.gameplayMetrics.mouseClicks / sessionDuration) * 60000;
    const movementsPerMinute = (this.gameplayMetrics.mouseMovements / sessionDuration) * 60000;
    
    return {
      clickIntensity: this.gameplayMetrics.lastClickIntensity,
      mouseMovements: movementsPerMinute,
      pauseFrequency: this.gameplayMetrics.pauseCount / (sessionDuration / 60000), // per minute
      errorRate: Math.random() * 0.1, // Would be calculated from actual errors
      decisionTime: Math.max(0, timeSinceLastAction / 1000), // seconds
      retryCount: Math.floor(Math.random() * 3)
    };
  }

  private combineEmotionSources(
    facial?: FacialEmotionData,
    audio?: AudioEmotionData,
    gameplay?: GameplayEmotionData
  ): EmotionData {
    const emotions: Record<string, number> = {};
    let totalWeight = 0;
    
    // Weight facial emotions (40% weight)
    if (facial) {
      Object.entries(facial.emotions).forEach(([emotion, value]) => {
        emotions[emotion] = (emotions[emotion] || 0) + value * 0.4;
      });
      totalWeight += 0.4;
    }
    
    // Infer emotions from gameplay patterns (30% weight)
    if (gameplay) {
      const gameplayEmotions = this.inferEmotionsFromGameplay(gameplay);
      Object.entries(gameplayEmotions).forEach(([emotion, value]) => {
        emotions[emotion] = (emotions[emotion] || 0) + value * 0.3;
      });
      totalWeight += 0.3;
    }
    
    // Infer emotions from audio (30% weight)
    if (audio) {
      const audioEmotions = this.inferEmotionsFromAudio(audio);
      Object.entries(audioEmotions).forEach(([emotion, value]) => {
        emotions[emotion] = (emotions[emotion] || 0) + value * 0.3;
      });
      totalWeight += 0.3;
    }
    
    // Normalize and find primary emotion
    if (totalWeight > 0) {
      Object.keys(emotions).forEach(key => {
        emotions[key] /= totalWeight;
      });
    }
    
    const primaryEmotion = Object.entries(emotions).reduce((max, [emotion, value]) => 
      value > max.value ? { emotion, value } : max
    , { emotion: 'focused', value: 0 });
    
    return {
      primary: primaryEmotion.emotion as any,
      confidence: primaryEmotion.value,
      secondary: Object.entries(emotions)
        .filter(([_, value]) => value > 0.2)
        .map(([emotion, _]) => emotion),
      timestamp: Date.now(),
      sources: { facial, audio, gameplay }
    };
  }

  private inferEmotionsFromGameplay(gameplay: GameplayEmotionData): Record<string, number> {
    const emotions: Record<string, number> = {};
    
    // High click intensity and movement = excited or frustrated
    if (gameplay.clickIntensity > 0.7 && gameplay.mouseMovements > 100) {
      emotions.excited = 0.6;
      emotions.frustrated = 0.3;
    }
    
    // High pause frequency = frustrated or bored
    if (gameplay.pauseFrequency > 2) {
      emotions.frustrated = 0.5;
      emotions.bored = 0.3;
    }
    
    // Long decision times = focused or challenged
    if (gameplay.decisionTime > 3) {
      emotions.focused = 0.4;
      emotions.challenged = 0.3;
    }
    
    // Low activity = bored or calm
    if (gameplay.mouseMovements < 20 && gameplay.clickIntensity < 0.2) {
      emotions.bored = 0.4;
      emotions.calm = 0.3;
    }
    
    return emotions;
  }

  private inferEmotionsFromAudio(audio: AudioEmotionData): Record<string, number> {
    const emotions: Record<string, number> = {};
    
    // High pitch and energy = excited
    if (audio.pitch > 300 && audio.energy > 150) {
      emotions.excited = 0.7;
    }
    
    // High voice stress = frustrated
    if (audio.voiceStress > 0.6) {
      emotions.frustrated = 0.6;
    }
    
    // Low energy = calm or bored
    if (audio.energy < 50) {
      emotions.calm = 0.5;
      emotions.bored = 0.3;
    }
    
    return emotions;
  }

  public getEmotionTrend(duration: number = 30000): string {
    const recentEmotions = this.emotionHistory.filter(
      emotion => Date.now() - emotion.timestamp < duration
    );
    
    if (recentEmotions.length === 0) return 'unknown';
    
    const emotionCounts: Record<string, number> = {};
    recentEmotions.forEach(emotion => {
      emotionCounts[emotion.primary] = (emotionCounts[emotion.primary] || 0) + 1;
    });
    
    return Object.entries(emotionCounts).reduce((max, [emotion, count]) =>
      count > max.count ? { emotion, count } : max
    , { emotion: 'focused', count: 0 }).emotion;
  }

  public onEmotionDetected(callback: (emotion: EmotionData) => void) {
    this.callbacks.push(callback);
  }

  private notifyCallbacks(emotion: EmotionData) {
    this.callbacks.forEach(callback => callback(emotion));
  }

  public stopDetection() {
    this.isDetecting = false;
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  public getCurrentEmotion(): EmotionData | null {
    return this.emotionHistory[this.emotionHistory.length - 1] || null;
  }

  public getEmotionHistory(): EmotionData[] {
    return [...this.emotionHistory];
  }

  // Privacy-friendly emotion detection without camera/microphone
  public enablePrivacyMode() {
    // Only use gameplay patterns for emotion detection
    const analyzeGameplayOnly = () => {
      if (!this.isDetecting) return;
      
      const gameplayEmotion = this.analyzeGameplayPatterns();
      const emotion = this.combineEmotionSources(undefined, undefined, gameplayEmotion);
      
      if (emotion) {
        this.emotionHistory.push(emotion);
        this.notifyCallbacks(emotion);
      }
      
      setTimeout(analyzeGameplayOnly, 2000); // Every 2 seconds
    };
    
    this.isDetecting = true;
    analyzeGameplayOnly();
  }
}

// Singleton instance
export const emotionDetector = new EmotionDetectionSystem();