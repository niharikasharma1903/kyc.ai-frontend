// src/components/ReportNavBar.tsx

interface Tab {
  key: string;
  label: string;
}

interface ReportNavBarProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function ReportNavBar({
  tabs,
  activeKey,
  onChange,
}: ReportNavBarProps) {
  return (
    <nav className="bg-card shadow-sm mb-6 py-2">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`whitespace-nowrap px-4 py-2 rounded ${
                tab.key === activeKey
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
