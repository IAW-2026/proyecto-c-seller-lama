interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const widthStyles = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'w-full'
};

export function PageContainer({ children, maxWidth = '2xl' }: PageContainerProps) {
  return (
    <div className={`${widthStyles[maxWidth]} mx-auto px-6 md:px-8 w-full`}>
      {children}
    </div>
  );
}
