export type CameraType = 'live' | 'security' | 'traffic' | 'wildlife';

export interface Webcam {
  id: string;
  name: string;
  type: CameraType;
  lat: number;
  lng: number;
  url: string; // The "stream" or image representation
  previewImage: string;
  description?: string;
  distance?: number; // for UI purely
  fps?: number;
  status: 'online' | 'offline';
}

export const MOCK_WEBCAMS: Webcam[] = [
  {
    id: 'cam-1',
    name: 'Tenderloin - EyeRoll',
    type: 'live',
    lat: 37.7833,
    lng: -122.4167,
    url: 'https://eyeroll.live/areas/sfc-tenderloin',
    previewImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=200',
    description: 'Live view of the Tenderloin neighborhood',
    fps: 30,
    status: 'online',
  },
  {
    id: 'cam-2',
    name: 'Pier 39 North',
    type: 'live',
    lat: 37.8086,
    lng: -122.4098,
    url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
    previewImage: 'https://images.unsplash.com/photo-1481018085669-2bc6e4f00fac?auto=format&fit=crop&q=80&w=200',
    description: 'Lofi cam placeholder for Pier 39',
    fps: 30,
    status: 'online',
  },
  {
    id: 'cam-3',
    name: 'Presidio Wildlife Cam',
    type: 'wildlife',
    lat: 37.7989,
    lng: -122.4661,
    url: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1',
    previewImage: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&q=80&w=200',
    description: 'Trail camera near the coastal edge (Placeholder)',
    fps: 15,
    status: 'online',
  },
  {
    id: 'cam-4',
    name: 'Golden Gate Security',
    type: 'security',
    lat: 37.8199,
    lng: -122.4782,
    url: 'https://images.unsplash.com/photo-1542045952-32b0fe07dc30?auto=format&fit=crop&q=80&w=800',
    previewImage: 'https://images.unsplash.com/photo-1542045952-32b0fe07dc30?auto=format&fit=crop&q=80&w=200',
    description: 'Toll plaza security camera',
    fps: 24,
    status: 'online',
  },
  {
    id: 'cam-5',
    name: 'Bay Bridge View',
    type: 'traffic',
    lat: 37.7982,
    lng: -122.3779,
    url: 'https://images.unsplash.com/photo-1506869688537-802521c7d2e0?auto=format&fit=crop&q=80&w=800',
    previewImage: 'https://images.unsplash.com/photo-1506869688537-802521c7d2e0?auto=format&fit=crop&q=80&w=200',
    description: 'Skyline and bridge overview',
    fps: 30,
    status: 'online',
  },
  {
    id: 'cam-6',
    name: 'Ghirardelli Square',
    type: 'traffic',
    lat: 37.8059,
    lng: -122.4205,
    url: 'https://images.unsplash.com/photo-1534050359320-02900022671e?auto=format&fit=crop&q=80&w=800',
    previewImage: 'https://images.unsplash.com/photo-1534050359320-02900022671e?auto=format&fit=crop&q=80&w=200',
    description: 'Street view of the main plaza',
    fps: 30,
    status: 'online',
  },
  {
    id: 'cam-7',
    name: 'Ocean Beach Surf Cam',
    type: 'live',
    lat: 37.7594,
    lng: -122.5107,
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800',
    previewImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=200',
    description: 'Live surf conditions',
    fps: 60,
    status: 'online',
  },
  {
    id: 'cam-8',
    name: 'Sutro Baths Trail',
    type: 'wildlife',
    lat: 37.7806,
    lng: -122.5135,
    url: 'https://images.unsplash.com/photo-1469521669194-babbdf9aa9bf?auto=format&fit=crop&q=80&w=800',
    previewImage: 'https://images.unsplash.com/photo-1469521669194-babbdf9aa9bf?auto=format&fit=crop&q=80&w=200',
    description: 'Trail cam in the ruins area',
    fps: 15,
    status: 'online',
  }
];
