import React, { useEffect, useRef, useState } from 'react';

const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...props }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ animationDelay: `${delay}ms`, ...(props.style || {}) }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
