import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AILevelGenerator } from '../components/AILevelGenerator';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  overflow-x: hidden;
`;

const Header = styled(motion.div)`
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  
  h1 {
    font-size: 3.5rem;
    background: linear-gradient(45deg, #ffd700, #ffed4e, #ff6b35);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  .subtitle {
    font-size: 1.4rem;
    color: #a0a0a0;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .features {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  
  .feature {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem 1.5rem;
    border-radius: 25px;
    border: 1px solid rgba(255, 215, 0, 0.3);
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const DemoSection = styled(motion.div)`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const InfoCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const InfoCard = styled(motion.div)`
  background: linear-gradient(135deg, #2a2a4e 0%, #1e1e3f 100%);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid #4a4a6a;
  
  h3 {
    color: #ffd700;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin: 0.8rem 0;
      padding-left: 1.5rem;
      position: relative;
      color: #e0e0e0;
      
      &::before {
        content: "✨";
        position: absolute;
        left: 0;
      }
    }
  }
  
  .highlight {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  }
`;

const TechStack = styled(motion.div)`
  background: linear-gradient(135deg, #4a90e2 0%, #7b68ee 100%);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  
  h3 {
    color: white;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
  
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .tech-item {
    background: rgba(255, 255, 255, 0.2);
    padding: 1rem;
    border-radius: 10px;
    font-weight: bold;
    color: white;
  }
`;

const Demo = styled.div`
  margin: 3rem 0;
`;

export const LionsunAIDemo: React.FC = () => {
  const [demoStats, setDemoStats] = useState({
    levelsGenerated: 0,
    emotionsDetected: 0,
    adaptationsExecuted: 0
  });

  useEffect(() => {
    // Simulate real-time stats for demo
    const interval = setInterval(() => {
      setDemoStats(prev => ({
        levelsGenerated: prev.levelsGenerated + Math.floor(Math.random() * 2),
        emotionsDetected: prev.emotionsDetected + Math.floor(Math.random() * 3),
        adaptationsExecuted: prev.adaptationsExecuted + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>🦁 Lionsun: AI-Powered Level Generation</h1>
        <p className="subtitle">
          انقلاب در دنیای گیمینگ - مراحل هوشمند و شخصی‌سازی‌شده توسط AI<br/>
          هر بازیکن تجربه‌ای منحصر به فرد خواهد داشت!
        </p>
        
        <div className="features">
          <div className="feature">
            🤖 AI Level Generation
          </div>
          <div className="feature">
            😊 Real-time Emotion Detection
          </div>
          <div className="feature">
            🎯 Adaptive Difficulty
          </div>
          <div className="feature">
            🔒 Privacy-First Design
          </div>
          <div className="feature">
            ⚡ Instant Adaptation
          </div>
        </div>
      </Header>

      <DemoSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* Real-time Demo Stats */}
        <div style={{ 
          display: 'flex', 
          justify: 'center', 
          gap: '2rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            background: 'linear-gradient(45deg, #00ff00, #00cc00)', 
            color: '#000', 
            padding: '1rem 2rem', 
            borderRadius: '15px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            <div style={{ fontSize: '2rem' }}>{demoStats.levelsGenerated}</div>
            <div>Levels Generated</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)', 
            color: '#fff', 
            padding: '1rem 2rem', 
            borderRadius: '15px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            <div style={{ fontSize: '2rem' }}>{demoStats.emotionsDetected}</div>
            <div>Emotions Detected</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(45deg, #4a90e2, #7b68ee)', 
            color: '#fff', 
            padding: '1rem 2rem', 
            borderRadius: '15px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            <div style={{ fontSize: '2rem' }}>{demoStats.adaptationsExecuted}</div>
            <div>AI Adaptations</div>
          </div>
        </div>

        <InfoCards>
          <InfoCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3>🧠 AI-Driven Level Generation</h3>
            <ul>
              <li>مراحل <span className="highlight">کاملاً دینامیک</span> بر اساس رفتار بازیکن</li>
              <li>تحلیل میزان مهارت و <span className="highlight">تنظیم سختی</span></li>
              <li>انتخاب محیط بر اساس <span className="highlight">حالت روانی</span></li>
              <li>تولید دشمن‌ها، موانع و جایزه‌های <span className="highlight">شخصی‌سازی‌شده</span></li>
              <li>موسیقی و جلوه‌های صوتی <span className="highlight">تطبیقی</span></li>
            </ul>
          </InfoCard>

          <InfoCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h3>😊 Real-time Emotion Detection</h3>
            <ul>
              <li>تشخیص احساسات از طریق <span className="highlight">الگوهای بازی</span></li>
              <li>پشتیبانی از دوربین و میکروفون (<span className="highlight">اختیاری</span>)</li>
              <li>حالت <span className="highlight">Privacy-First</span> - بدون دسترسی به حریم خصوصی</li>
              <li>تحلیل کلیک‌ها، حرکات ماوس و <span className="highlight">رفتار کاربر</span></li>
              <li>تطبیق فوری مراحل با <span className="highlight">حالت عاطفی</span></li>
            </ul>
          </InfoCard>

          <InfoCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3>🎯 Adaptive Difficulty System</h3>
            <ul>
              <li>سیستم <span className="highlight">خودتنظیم</span> بر اساس عملکرد</li>
              <li>جلوگیری از <span className="highlight">ناامیدی</span> و <span className="highlight">کسالت</span></li>
              <li>حفظ تعادل <span className="highlight">چالش بهینه</span></li>
              <li>تنظیم سرعت بازی و <span className="highlight">پیچیدگی</span></li>
              <li>پاداش‌های <span className="highlight">متناسب با مهارت</span></li>
            </ul>
          </InfoCard>

          <InfoCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <h3>🔮 Future AI Features</h3>
            <ul>
              <li>ادغام با <span className="highlight">GPT-4</span> برای تولید داستان</li>
              <li>تولید موسیقی <span className="highlight">در زمان واقعی</span></li>
              <li>طراحی کاراکتر <span className="highlight">بر اساس شخصیت</span></li>
              <li>سیستم <span className="highlight">یادگیری تقویتی</span></li>
              <li>پشتیبانی از <span className="highlight">VR/AR</span></li>
            </ul>
          </InfoCard>
        </InfoCards>

        <TechStack
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
        >
          <h3>🛠️ Technology Stack</h3>
          <div className="tech-grid">
            <div className="tech-item">React + TypeScript</div>
            <div className="tech-item">TensorFlow.js</div>
            <div className="tech-item">Web Audio API</div>
            <div className="tech-item">Canvas 2D</div>
            <div className="tech-item">Framer Motion</div>
            <div className="tech-item">Styled Components</div>
            <div className="tech-item">MediaStream API</div>
            <div className="tech-item">Machine Learning</div>
          </div>
        </TechStack>

        <Demo>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
          >
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              marginBottom: '2rem',
              background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎮 Live Demo - Try It Now!
            </h2>
            <AILevelGenerator />
          </motion.div>
        </Demo>

        {/* Instructions */}
        <InfoCard
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          style={{ marginTop: '3rem' }}
        >
          <h3>📋 How to Use the Demo</h3>
          <ul>
            <li>روی دکمه <span className="highlight">"Enable AI Detection"</span> کلیک کنید</li>
            <li>با ماوس حرکت کنید و کلیک کنید تا الگوهای رفتاری تحلیل شوند</li>
            <li>حالت عاطفی خود را تغییر دهید یا بگذارید AI خودکار تشخیص دهد</li>
            <li>روی <span className="highlight">"Generate New AI Level"</span> کلیک کنید</li>
            <li>مرحله شخصی‌سازی‌شده خود را مشاهده کنید!</li>
          </ul>
        </InfoCard>
      </DemoSection>
    </Container>
  );
};