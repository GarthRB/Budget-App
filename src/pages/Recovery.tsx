import { Clock, CalendarClock } from 'lucide-react';
import { RECOVERY_PROTOCOLS } from '../data/recovery';
import { Card, PageHeader } from '../components/ui';

export function Recovery() {
  return (
    <div>
      <PageHeader
        title="Recovery"
        subtitle="Recovery is where improvement actually happens. Build these habits around your play."
      />

      <div className="space-y-4">
        {RECOVERY_PROTOCOLS.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-semibold text-white">{p.name}</h2>
              <div className="flex items-center gap-1 text-xs text-sky-300 shrink-0">
                <Clock size={13} />
                {p.duration}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
              <CalendarClock size={13} />
              {p.when}
            </div>
            <p className="text-sm text-slate-400 mb-3">{p.detail}</p>
            <ul className="space-y-1.5">
              {p.steps.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-300 text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
