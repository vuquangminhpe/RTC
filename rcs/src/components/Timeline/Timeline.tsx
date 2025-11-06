import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene } from '../Scene/Scene';
import { EventCard } from './EventCard';
import { Modal } from './Modal';
import { historicalEvents } from '../../data/events';
import { HistoricalEvent } from '../../types';
import '../../styles/timeline.css';

gsap.registerPlugin(ScrollTrigger);

export const Timeline = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [milestoneScales, setMilestoneScales] = useState<number[]>(
    new Array(historicalEvents.length).fill(1)
  );
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    // Main scroll progress animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    // Create milestone scale animations
    historicalEvents.forEach((event, index) => {
      const element = document.getElementById(`card-${event.id}`);
      if (!element) return;

      ScrollTrigger.create({
        trigger: element,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          setMilestoneScales((prev) => {
            const newScales = [...prev];
            newScales[index] = 1.5;
            return newScales;
          });
        },
        onLeave: () => {
          setMilestoneScales((prev) => {
            const newScales = [...prev];
            newScales[index] = 1;
            return newScales;
          });
        },
        onEnterBack: () => {
          setMilestoneScales((prev) => {
            const newScales = [...prev];
            newScales[index] = 1.5;
            return newScales;
          });
        },
        onLeaveBack: () => {
          setMilestoneScales((prev) => {
            const newScales = [...prev];
            newScales[index] = 1;
            return newScales;
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, []);

  return (
    <>
      <Scene scrollProgress={scrollProgress} milestoneScales={milestoneScales} />

      <div ref={timelineRef} className="timeline-container">
        <header className="timeline-header">
          <h1 className="timeline-main-title">
            <span className="title-vietnam">VIỆT NAM</span>
            <span className="title-history">LỊCH SỬ HÀNH TRÌNH</span>
          </h1>
          <p className="timeline-subtitle">
            Những mốc son chói lọi trong lịch sử dân tộc
          </p>
        </header>

        <div className="timeline-events">
          {historicalEvents.map((event) => (
            <div key={event.id} id={`card-${event.id}`}>
              <EventCard event={event} onOpenModal={setSelectedEvent} />
            </div>
          ))}
        </div>

        <footer className="timeline-footer">
          <div className="footer-content">
            <p className="footer-quote">
              "Không có gì quý hơn độc lập, tự do"
            </p>
            <p className="footer-author">- Chủ tịch Hồ Chí Minh</p>
          </div>
        </footer>
      </div>

      <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
};
