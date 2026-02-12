
/**
 * Logica del sito di compleanno
 * - Countdown personalizzabile e salvato in localStorage
 * - Carosello foto (da assets/photos/photos.json + upload locale)
 * - Timeline (da assets/timeline.json)
 * - Animazioni decorative (cuori e fiori)
 */

// Utilità
const $ = (sel: string, root: Document | HTMLElement = document) => root.querySelector(sel) as HTMLElement;
const $$ = (sel: string, root: Document | HTMLElement = document) => Array.from(root.querySelectorAll(sel)) as HTMLElement[];

// ------------------ Countdown ------------------
function initCountdown(){
  const wrap = document.getElementById('countdown') as HTMLElement | null;
  if(!wrap) return;

  const saved = localStorage.getItem('surpriseDateISO');
  let targetISO = saved || wrap.dataset.target || '';

  const dtInput = document.getElementById('surprise-datetime') as HTMLInputElement | null;
  const saveBtn = document.getElementById('save-surprise') as HTMLButtonElement | null;

  if(dtInput){
    if(targetISO){
      const d = new Date(targetISO);
      const pad = (n: number) => String(n).padStart(2,'0');
      const local = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      dtInput.value = local;
    }
    saveBtn?.addEventListener('click', ()=>{
      if(!dtInput.value) return;
      const iso = new Date(dtInput.value).toISOString();
      localStorage.setItem('surpriseDateISO', iso);
      targetISO = iso;
    });
  }

  const daysEl = document.getElementById('cd-days')!;
  const hoursEl = document.getElementById('cd-hours')!;
  const minsEl = document.getElementById('cd-mins')!;
  const secsEl = document.getElementById('cd-secs')!;

  function tick(){
    if(!targetISO){
      daysEl.textContent = '0'; hoursEl.textContent = '0'; minsEl.textContent = '0'; secsEl.textContent = '0';
      return;
    }
    const now = new Date();
    const target = new Date(targetISO);
    const diff = target.getTime() - now.getTime();
    if(diff <= 0){
      daysEl.textContent = '0'; hoursEl.textContent = '0'; minsEl.textContent = '0'; secsEl.textContent = '0';
      return;
    }
    const s = Math.floor(diff/1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400)/3600);
    const m = Math.floor((s % 3600)/60);
    const sec = s % 60;
    daysEl.textContent = String(d);
    hoursEl.textContent = String(h);
    minsEl.textContent = String(m);
    secsEl.textContent = String(sec);
  }

  tick();
  setInterval(tick, 1000);
}

// ------------------ Carosello ------------------
interface PhotoItem { src: string; alt?: string }

async function loadPhotosFromJSON(): Promise<PhotoItem[]>{
  try{
    const res = await fetch('assets/photos/photos.json', {cache: 'no-store'});
    if(!res.ok) return [];
    const arr = await res.json();
    if(Array.isArray(arr)){
      return arr.filter(Boolean).map((p: any)=> ({src: String(p.src || p), alt: p.alt ? String(p.alt) : 'Ricordo'}));
    }
    return [];
  }catch{ return [] }
}

function buildCarousel(items: PhotoItem[]){
  const track = document.getElementById('carousel-track');
  if(!track) return;
  track.innerHTML = '';
  items.forEach((it)=>{
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = it.src;
    img.alt = it.alt || 'Ricordo';
    track.appendChild(img);
  });
}

function bindCarouselControls(){
  const track = document.getElementById('carousel-track') as HTMLElement | null;
  const prev = document.querySelector('.carousel__btn.prev') as HTMLButtonElement | null;
  const next = document.querySelector('.carousel__btn.next') as HTMLButtonElement | null;
  if(!track || !prev || !next) return;

  const slideW = () => track.clientWidth;
  prev.addEventListener('click', ()=> track.scrollBy({left: -slideW(), behavior:'smooth'}));
  next.addEventListener('click', ()=> track.scrollBy({left: slideW(), behavior:'smooth'}));

  // Auto-play leggero
  let auto = setInterval(()=> track.scrollBy({left: slideW(), behavior:'smooth'}), 5000);
  track.addEventListener('mouseenter', ()=> clearInterval(auto));
  track.addEventListener('mouseleave', ()=> auto = setInterval(()=> track.scrollBy({left: slideW(), behavior:'smooth'}), 5000));

  // Swipe touch
  let startX = 0;
  track.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx > 0) prev.click(); else next.click();
    }
  });
}

function enableLocalUploads(current: PhotoItem[]){
  const input = document.getElementById('photo-input') as HTMLInputElement | null;
  if(!input) return;
  input.addEventListener('change', ()=>{
    const files = input.files; if(!files || !files.length) return;
    const readers: Promise<PhotoItem>[] = Array.from(files).map(file=> new Promise((resolve)=>{
      const fr = new FileReader();
      fr.onload = ()=> resolve({src: String(fr.result), alt: file.name});
      fr.readAsDataURL(file);
    }));
    Promise.all(readers).then(added=>{
      buildCarousel([...current, ...added]);
    });
  });
}

// ------------------ Timeline ------------------
interface TimelineItem { date: string; title: string; description?: string }

async function loadTimeline(): Promise<TimelineItem[]>{
  try{
    const res = await fetch('assets/timeline.json', {cache: 'no-store'});
    if(!res.ok) return [];
    const arr = await res.json();
    if(Array.isArray(arr)) return arr;
    return [];
  }catch{ return [] }
}

function renderTimeline(items: TimelineItem[]){
  const list = document.getElementById('timeline') as HTMLOListElement | null;
  if(!list) return;
  list.innerHTML = '';
  items.sort((a,b)=> a.date.localeCompare(b.date));
  for(const it of items){
    const li = document.createElement('li');
    const dot = document.createElement('div'); dot.className = 'timeline__dot'; li.appendChild(dot);
    const card = document.createElement('div'); card.className = 'timeline__card'; li.appendChild(card);
    const date = document.createElement('div'); date.className = 'timeline__date'; date.textContent = new Date(it.date).toLocaleDateString('it-IT', {year:'numeric', month:'long', day:'numeric'});
    const title = document.createElement('div'); title.className = 'timeline__title'; title.textContent = it.title;
    const desc = document.createElement('p'); desc.className = 'timeline__desc'; desc.textContent = it.description || '';
    card.append(date, title, desc);
    list.appendChild(li);
  }
}

// ------------------ Decorazioni (cuori & fiori) ------------------
function spawnFloating(){
  const heartsLayer = document.querySelector('.floating--hearts') as HTMLElement | null;
  const flowersLayer = document.querySelector('.floating--flowers') as HTMLElement | null;
  if(!heartsLayer || !flowersLayer) return;

  const W = window.innerWidth; const H = window.innerHeight;
  const rand = (min:number, max:number)=> Math.random()*(max-min)+min;

  for(let i=0; i<18; i++){
    const h = document.createElement('div'); h.className = 'heart';
    h.style.left = rand(0, W-20)+'px';
    h.style.bottom = rand(-40, 40)+'px';
    h.style.animation = `floatUp ${rand(14, 26)}s linear ${rand(0, 12)}s infinite, drift ${rand(6, 12)}s ease-in-out ${rand(0, 8)}s infinite alternate`;
    heartsLayer.appendChild(h);
  }
  for(let i=0; i<26; i++){
    const f = document.createElement('div'); f.className = 'flower';
    f.style.left = rand(0, W-20)+'px';
    f.style.bottom = rand(-40, 40)+'px';
    f.style.animation = `floatUp ${rand(18, 30)}s linear ${rand(0, 14)}s infinite, drift ${rand(5, 10)}s ease-in-out ${rand(0, 8)}s infinite alternate`;
    flowersLayer.appendChild(f);
  }
}

// ------------------ Boot ------------------
(async function(){
  initCountdown();

  const photos = await loadPhotosFromJSON();
  buildCarousel(photos);
  bindCarouselControls();
  enableLocalUploads(photos);

  const timeline = await loadTimeline();
  renderTimeline(timeline);

  spawnFloating();
})();
