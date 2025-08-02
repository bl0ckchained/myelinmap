import React from 'react';

interface HomeSectionProps {
  title: string;
  children: React.ReactNode;
}

const HomeSection = ({ title, children }: HomeSectionProps) => {
  return (
    <section className="py-16 px-6 md:px-20 max-w-4xl mx-auto text-left space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default HomeSection;
