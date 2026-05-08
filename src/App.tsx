import React, { useState, useMemo } from 'react';
import { Camera, Search, Heart, Activity, CloudRain, Settings, Star, StarOff, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_WEBCAMS, CameraType, Webcam } from './data/webcams';
import Map from './components/Map';

export default function App() {
  const [activeFilters, setActiveFilters] = useState<Set<CameraType>>(new Set());
  const [selectedCam, setSelectedCam] = useState<Webcam | null>(MOCK_WEBCAMS[0]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFilter = (type: CameraType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredWebcams = useMemo(() => {
    if (activeFilters.size === 0) return MOCK_WEBCAMS;
    return MOCK_WEBCAMS.filter(cam => activeFilters.has(cam.type));
  }, [activeFilters]);

  // Keep favorite map fast
  const favoriteWebcams = MOCK_WEBCAMS.filter(cam => favorites.has(cam.id));

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CamSight<span className="text-indigo-400 font-normal">.io</span></span>
        </div>
        <div className="flex-1 max-w-md mx-12">
          <div className="relative border border-slate-800 rounded-full focus-within:border-indigo-500 transition-colors">
            <input type="text" placeholder="Search city, landmark, or zip code..." className="w-full bg-slate-800/50 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-0" />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">{filteredWebcams.length} Cams Online</span>
          </div>
          <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition">
            <Settings className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className={`flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 overflow-y-auto md:overflow-hidden h-full transition-all duration-300 ${selectedCam ? 'md:pr-96' : ''}`}>
          
          {/* Map Visualization */}
          <div className="col-span-1 md:col-span-8 md:row-span-4 bg-slate-900 rounded-3xl border border-slate-800 relative min-h-[300px] overflow-hidden shadow-sm">
            {/* Subtle grid background to match bento aesthetic behind map when loading */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 z-0 map-wrapper">
               <Map 
                 webcams={filteredWebcams} 
                 onMarkerClick={(cam) => setSelectedCam(cam)} 
                 selectedCamId={selectedCam?.id || null} 
               />
            </div>
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur p-3 rounded-xl border border-slate-800 z-[400] shadow-xl pointer-events-none">
              <p className="text-xs text-slate-400 mb-1 tracking-widest uppercase">Current Viewport</p>
              <p className="text-sm font-bold text-white tracking-wide">San Francisco Bay Area</p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="col-span-1 md:col-span-4 md:row-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col min-h-[150px] justify-center shadow-sm">
            <div className="flex justify-between items-center mb-5">
               <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Type Filters</p>
               <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-bold tracking-widest">{filteredWebcams.length} MATCHES</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {(['live', 'security', 'traffic', 'wildlife'] as CameraType[]).map((type) => {
                const isActive = activeFilters.has(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide border transition-all capitalize ${
                      isActive 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500' 
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Favorites List */}
          <div className="col-span-1 md:col-span-4 md:row-span-4 bg-slate-900 rounded-3xl border border-slate-800 p-5 flex flex-col gap-3 min-h-[250px] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center shrink-0 mb-1">
              Saved Favorites
              <Heart className="w-3 h-3 text-rose-500 ml-2" />
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
              {favoriteWebcams.length > 0 ? (
                favoriteWebcams.map(cam => (
                   <motion.div 
                    key={cam.id} 
                    onClick={() => setSelectedCam(cam)}
                    initial={false}
                    animate={{ 
                      scale: selectedCam?.id === cam.id ? 1.02 : 1,
                      backgroundColor: selectedCam?.id === cam.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                      borderColor: selectedCam?.id === cam.id ? 'rgba(99, 102, 241, 0.3)' : 'rgba(30, 41, 59, 1)'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex items-center justify-between p-2 rounded-2xl border cursor-pointer hover:bg-slate-800 hover:border-slate-700 relative group/item overflow-hidden"
                  >
                    {selectedCam?.id === cam.id && (
                      <motion.div 
                        layoutId="active-favorite"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <img src={cam.previewImage} alt={cam.name} className="w-14 h-14 object-cover rounded-xl bg-slate-700 border border-slate-800/50" />
                      <div>
                        <p className={`text-sm font-semibold truncate max-w-[150px] tracking-tight transition-colors ${selectedCam?.id === cam.id ? 'text-indigo-300' : 'text-slate-200'}`}>{cam.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-widest font-bold">{cam.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => toggleFavorite(cam.id, e)}
                      className="p-2 text-slate-600 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors relative z-10"
                    >
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 drop-shadow-sm opacity-90 group-hover/item:opacity-100" />
                    </button>
                  </motion.div>
                ))
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600">
                     <StarOff className="w-10 h-10 mb-4 opacity-10" />
                     <p className="text-sm text-center font-medium opacity-80">No favorites saved.</p>
                     <p className="text-xs text-center mt-1.5 opacity-60 font-medium">Star a camera to add it.</p>
                  </div>
              )}
            </div>
          </div>

          {/* Weather / Status Stats */}
          <div className="col-span-1 md:col-span-8 md:row-span-2 flex flex-col sm:flex-row gap-4 h-full min-h-[150px]">
             <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                  <CloudRain className="w-24 h-24 text-sky-400" />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weather</span>
                  <CloudRain className="w-5 h-5 text-sky-400" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-light tracking-tight text-white mb-0.5">18°<span className="text-lg text-slate-500 font-medium ml-1">C</span></p>
                    <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Overcast • SF, CA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Visibility</p>
                    <p className="text-[15px] font-medium text-slate-300">10 Miles</p>
                  </div>
                </div>
             </div>

             <div className="flex-1 bg-indigo-600 rounded-3xl border border-indigo-500 p-5 text-white shadow-[0_0_30px_rgba(79,70,229,0.2)] relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-50 z-0"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-1 flex items-center gap-1.5 opacity-90">
                    <Activity className="w-3 h-3" /> Latency
                  </p>
                  <p className="text-4xl font-black tracking-tight mt-1">24<span className="text-sm tracking-wide text-indigo-300 font-bold ml-1">ms</span></p>
                </div>
                <div className="h-8 flex items-end gap-2 relative z-10 justify-between items-center mt-4">
                  <div className="w-full h-[40%] bg-white/20 rounded-t-sm"></div>
                  <div className="w-full h-[60%] bg-indigo-300/60 rounded-t-sm"></div>
                  <div className="w-full h-[100%] bg-white rounded-t-sm shadow-[0_0_10px_rgba(255,255,255,0.6)]"></div>
                  <div className="w-full h-[80%] bg-indigo-200/50 rounded-t-sm"></div>
                  <div className="w-full h-[50%] bg-white/30 rounded-t-sm"></div>
                  <div className="w-full h-[30%] bg-white/20 rounded-t-sm"></div>
                </div>
             </div>
          </div>

        </main>

        {/* Selected Camera Drawer */}
        <aside 
          className={`absolute top-0 right-0 h-full w-full md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-[500] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${
            selectedCam ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedCam && (
            <>
              {/* Header */}
              <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur shrink-0">
                <h2 className="font-bold text-lg text-white tracking-tight truncate pr-4">{selectedCam.name}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => toggleFavorite(selectedCam.id, e)}
                    className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-full transition-colors shrink-0 cursor-pointer"
                  >
                    {favorites.has(selectedCam.id) ? (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
                    ) : (
                      <Heart className="w-4 h-4 text-slate-400 hover:text-rose-400 transition-colors" />
                    )}
                  </button>
                  <button 
                    onClick={() => setSelectedCam(null)}
                    className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-full transition-colors shrink-0 text-slate-400 cursor-pointer"
                  >
                     <span className="sr-only">Close</span>
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-12">
                {/* Camera View */}
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg relative group">
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-600/90 backdrop-blur rounded text-[10px] font-black flex items-center gap-1.5 z-10 shadow-md tracking-widest">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_4px_rgba(255,255,255,0.8)]"></span> LIVE
                  </div>
                  {selectedCam.url.includes('youtube.com') || selectedCam.url.includes('eyeroll.live') ? (
                    <iframe 
                      src={selectedCam.url} 
                      title={selectedCam.name}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="w-full aspect-video border-0"
                    />
                  ) : (
                    <img src={selectedCam.url} alt={selectedCam.name} className="w-full aspect-video object-cover" />
                  )}
                  <div className="absolute bottom-2 right-2 text-[10px] font-bold tracking-widest text-white/50 bg-black/40 backdrop-blur px-2 py-1 rounded">
                    {selectedCam.fps} FPS
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {selectedCam.type}
                  </span>
                  <span className="px-3 py-1.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    1080P HD
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {selectedCam.status}
                  </span>
                </div>

                {/* Details Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</h3>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">{selectedCam.description || 'No detailed description available.'}</p>
                  </div>
                  <div className="border-t border-slate-800 pt-4 flex gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Latitude</h4>
                      <p className="text-sm font-medium text-slate-200 font-mono tracking-tight">{selectedCam.lat.toFixed(4)}°</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Longitude</h4>
                      <p className="text-sm font-medium text-slate-200 font-mono tracking-tight">{selectedCam.lng.toFixed(4)}°</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2">
                  <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide text-sm transition-colors shadow-[0_0_20px_rgba(79,70,229,0.2)] flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" /> Open Full Screen
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>

      </div>
      {/* Some quick custom styling for scrollbars to stay true to Bento */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5); 
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8); 
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8); 
        }
        /* Leaflet popup dark mode override */
        .leaflet-popup-content-wrapper {
          background: #0f172a;
          color: #e2e8f0;
          border: 1px solid #1e293b;
          border-radius: 1rem;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6);
        }
        .leaflet-popup-tip {
          background: #0f172a;
          border: 1px solid #1e293b;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #64748b;
          padding: 6px;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #f8fafc;
        }
        
        .map-wrapper .leaflet-container {
            background-color: transparent; /* allow grid to show behind before load */
        }
        .map-wrapper .leaflet-layer,
        .map-wrapper .leaflet-control-zoom-pane,
        .map-wrapper .leaflet-control-container,
        .map-wrapper .leaflet-pane {
            z-index: 100 !important;
        }
        .map-wrapper .leaflet-popup-pane {
          z-index: 600 !important;
        }
      `}</style>
    </div>
  );
}
