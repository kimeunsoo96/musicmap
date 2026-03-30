import dynamic from 'next/dynamic';

const MapDynamic = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface flex items-center justify-center">
      <div className="text-slate-500 flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-spotify border-t-transparent rounded-full animate-spin" />
        <span>Loading map...</span>
      </div>
    </div>
  ),
});

export default MapDynamic;
