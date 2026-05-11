/*
Componente reutilizable para encabezados de página.
Estandariza títulos, descripciones y acciones
manteniendo un layout responsive y consistente.
*/

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-8">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-[#37413d] mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-base text-[#6f7f6d]">
            {description}
          </p>
        )}
      </div>
      
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
