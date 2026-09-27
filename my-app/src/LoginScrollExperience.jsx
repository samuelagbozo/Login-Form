import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import GlyphPortal from './components/GlyphPortal';
import KineticGrid from './components/KineticGrid';
import LoginForm from './loginForm/loginForm';

export default function LoginScrollExperience({
  theme = 'dark',
  heroWord = 'LOGIN',
  heroCaption = 'Scroll to enter.',
  enterLabel = 'Enter section',
  sectionLabel = '',
  sectionHeadline = 'Welcome back.',
  scrollLength = 1.8,
}) {
  const lightMode = theme === 'light';
  const experienceRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: experienceRef,
    offset: ['start start', 'end end'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0.7, 0.93, 1], [0, 1, 1]);
  const contentY = useTransform(scrollYProgress, [0.7, 0.93, 1], [24, 0, 0]);

  return (
    <div ref={experienceRef} className="login-experience" data-reduced-motion={reduceMotion || undefined}>
      <GlyphPortal
        word={heroWord}
        scrollLength={scrollLength}
        interactive={false}
        annotations={false}
        enterLabel={enterLabel}
        className="login-portal"
        front={<p className="login-portal__caption">{heroCaption}</p>}
        style={{
          '--gp-paper': lightMode ? '#dbeafe' : '#10294d',
          '--gp-ink': lightMode ? '#1e3a65' : '#dbeafe',
          '--gp-field': lightMode ? '#dbeafe' : '#10294d',
          '--gp-foreground': lightMode ? '#172033' : '#dbeafe',
        }}
        background={<KineticGrid theme={theme} />}
      >
        <motion.div
          className="login-portal__content"
          style={reduceMotion ? { opacity: contentOpacity } : { opacity: contentOpacity, y: contentY }}
        >
          <header className="login-portal__heading">
            {sectionLabel && <p>{sectionLabel}</p>}
            <h2>{sectionHeadline}</h2>
          </header>
          <LoginForm />
        </motion.div>
      </GlyphPortal>
    </div>
  );
}
