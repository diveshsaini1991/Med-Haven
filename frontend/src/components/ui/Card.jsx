import React from 'react';

const Card = ({ as: Tag = 'div', className = '', children, ...props }) => (
  <Tag className={`surface-card rounded-3xl ${className}`} {...props}>
    {children}
  </Tag>
);

export default Card;
