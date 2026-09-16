/**
 * AETHER OS — YOUTUBE MUSIC & CURATED FOCUS STATIONS
 * Official player embed + direct deep-link workflow
 */

export const FOCUS_STATIONS = [
  {
    id: 'lofi',
    title: 'Lofi Girl — Deep Focus Beats',
    genre: 'Lo-Fi Chill',
    youtubeId: 'jfKfPfyJRdk',
    streamUrl: 'https://music.youtube.com/search?q=lofi+deep+focus'
  },
  {
    id: 'synthwave',
    title: 'Cyberpunk & Synthwave Coding',
    genre: 'Synth / Retrowave',
    youtubeId: '4xDzrJKXOOY',
    streamUrl: 'https://music.youtube.com/search?q=synthwave+coding'
  },
  {
    id: 'space',
    title: 'Deep Space Ambient Drone',
    genre: 'Cosmic Ambient',
    youtubeId: '2OEL4P1Rz04',
    streamUrl: 'https://music.youtube.com/search?q=space+ambient+focus'
  },
  {
    id: 'classical',
    title: 'Modern Neo-Classical Piano',
    genre: 'Classical Focus',
    youtubeId: 'WJ3-F02-UWP',
    streamUrl: 'https://music.youtube.com/search?q=peaceful+piano+focus'
  }
];

class MusicController {
  constructor() {
    this.currentStation = FOCUS_STATIONS[0];
    this.isPlaying = false;
    this.listeners = new Set();
  }

  getStations() {
    return FOCUS_STATIONS;
  }

  getCurrentStation() {
    return this.currentStation;
  }

  selectStation(stationId) {
    const station = FOCUS_STATIONS.find(s => s.id === stationId);
    if (station) {
      this.currentStation = station;
      this.notify();
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.notify();
    return this.isPlaying;
  }

  openExternalMusic(query = '') {
    const targetUrl = query
      ? `https://music.youtube.com/search?q=${encodeURIComponent(query)}`
      : this.currentStation.streamUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const l of this.listeners) {
      try {
        l(this.currentStation, this.isPlaying);
      } catch (e) {
        console.error('MusicController listener error:', e);
      }
    }
  }
}

export const musicController = new MusicController();
