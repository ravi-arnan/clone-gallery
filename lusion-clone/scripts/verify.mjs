import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('=== Checking Lusion Clone Assets & System Integrity ===\n');

const CRITICAL_FILES = [
  'index.html',
  'about/index.html',
  'projects/index.html',
  '_astro/hoisted.CUO_IjfL.js',
  '_astro/about.CNa9RfUh.css',

  // 3D Models (.buf)
  'assets/models/about/bg_box.buf',
  'assets/models/about/camera_spline.buf',
  'assets/models/about/letter_placements.buf',
  'assets/models/about/logo_text.buf',
  'assets/models/about/person.buf',
  'assets/models/about/person_idle.buf',
  'assets/models/about/terrain.buf',
  'assets/models/about/terrain_lines.buf',
  'assets/models/about/rock_0.buf',
  'assets/models/about/rock_1.buf',
  'assets/models/about/rock_2.buf',
  'assets/models/about/rock_3.buf',
  'assets/models/about/sphere_l.buf',
  'assets/models/home/cross.buf',
  'assets/models/home/cross_ld.buf',
  'assets/models/playground/tunnel.buf',
  'assets/models/plant.buf',
  'assets/models/lines/line_reel.buf',
  'assets/models/lines/line_goal.buf',
  'assets/models/lines/line_capability.buf',
  'assets/models/lines/line_office.buf',
  'assets/models/tunnels/astronaut_helmet.buf',
  'assets/models/tunnels/astronaut_helmet_glass.buf',
  'assets/models/tunnels/astronaut_glove_shoes.buf',
  'assets/models/tunnels/astronaut_wearpack.buf',
  'assets/models/tunnels/astronaut_animations.buf',
  'assets/models/tunnels/broken_glass.buf',
  'assets/models/tunnels/diamond.buf',
  'assets/models/tunnels/earth_card.buf',
  'assets/models/tunnels/grid_base_hd.buf',
  'assets/models/tunnels/grid_structure_hd.buf',
  'assets/models/tunnels/tunnel_block_base.buf',
  'assets/models/tunnels/tunnel_block_wall.buf',

  // 3D Textures
  'assets/textures/font.png',
  'assets/textures/LDR_RGB1_0.png',
  'assets/textures/flip_texture.png',
  'assets/textures/award_gradient.png',
  'assets/textures/smaa-area.png',
  'assets/textures/smaa-search.png',
  'assets/textures/home/matcap.exr',
  'assets/textures/home/matcap_ld.exr',
  'assets/textures/about/fog.png',
  'assets/textures/about/ground_person_shadow.webp',
  'assets/textures/about/person.webp',
  'assets/textures/about/person_light.webp',
  'assets/textures/about/rocks.webp',
  'assets/textures/about/terrain_shadow_light_height.webp',
  'assets/textures/tunnels/desktop.png',
  'assets/textures/tunnels/tablet.png',
  'assets/textures/tunnels/earth.webp',
  'assets/textures/tunnels/earth_landscape.jpg',
  'assets/textures/tunnels/stickers.png',
  'assets/textures/tunnels/white_block.webp',
  'assets/textures/tunnels/white_matcap.jpg',
  'assets/textures/tunnels/astronaut/face.png',
  'assets/textures/tunnels/astronaut/astronaut_helmet_base.webp',
  'assets/textures/tunnels/astronaut/astronaut_wearpack_base.webp',
  'assets/textures/tunnels/grids/greeble_base.webp',
  'assets/textures/reel/desktop.mp4',
  'assets/textures/reel/mobile.mp4',

  // Web Audio Files
  'assets/audios/hover_0.ogg',
  'assets/audios/click_0.ogg',
  'assets/audios/focus_0.ogg',
  'assets/audios/glass_broken.ogg',
  'assets/audios/page_0.ogg',
  'assets/audios/generic.ogg',
  'assets/audios/cinematic_0.ogg',
  'assets/audios/cinematic_2.ogg',
  'assets/audios/cinematic_3.ogg',
  'assets/audios/generic_end.ogg',

  // Team Files
  'assets/team/team.json',
  'assets/team/edan.buf',
  'assets/team/ffi.buf',
  'assets/team/pierre.buf',
  'assets/team/yannic.buf',
  'assets/team/paul.buf',
  'assets/team/andrii.buf',
  'assets/team/sunny.buf',

  // Fonts
  'assets/fonts/Aeonik-Medium.woff2',
  'assets/fonts/Aeonik-Regular.woff2',
  'assets/fonts/IBMPlexMono-Medium.woff2',
  'assets/fonts/IBMPlexMono-Regular.woff2',
  'assets/fonts/LusionMono.woff2',

  // Project Depth Cards
  'assets/projects/oryzo_ai/home.webp',
  'assets/projects/oryzo_ai/home_depth.webp',
  'assets/projects/atlas_motion/home.webp',
  'assets/projects/atlas_motion/home_depth.webp',
  'assets/projects/devin_ai/home.webp',
  'assets/projects/devin_ai/home_depth.webp',
  'assets/projects/of_the_oak/home.webp',
  'assets/projects/of_the_oak/home_depth.webp',
  'assets/projects/everswap/home.webp',
  'assets/projects/everswap/home_depth.webp',
  'assets/projects/porsche_dream_machine/home.webp',
  'assets/projects/porsche_dream_machine/home_depth.webp',
  'assets/projects/synthetic_human/home.webp',
  'assets/projects/synthetic_human/home_depth.webp',
  'assets/projects/spatial_fusion/home.webp',
  'assets/projects/spatial_fusion/home_depth.webp',
  'assets/projects/spaace/home.webp',
  'assets/projects/spaace/home_depth.webp',
  'assets/projects/ddd_2024/home.webp',
  'assets/projects/ddd_2024/home_depth.webp',
  'assets/projects/choo_choo_world/home.webp',
  'assets/projects/choo_choo_world/home_depth.webp',
  'assets/projects/soda_experience/home.webp',
  'assets/projects/soda_experience/home_depth.webp',
];

let missing = 0;
let checked = 0;

for (const relPath of CRITICAL_FILES) {
  const fullPath = path.join(PUBLIC_DIR, relPath);
  checked++;
  if (!fs.existsSync(fullPath)) {
    console.error(`[MISSING] ${relPath}`);
    missing++;
  } else {
    const size = fs.statSync(fullPath).size;
    if (size === 0) {
      console.error(`[EMPTY] ${relPath}`);
      missing++;
    }
  }
}

// Count all files in public
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const full = path.join(dirPath, file);
    if (fs.statSync(full).isDirectory()) {
      arrayOfFiles = getAllFiles(full, arrayOfFiles);
    } else {
      arrayOfFiles.push(full);
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(PUBLIC_DIR);
let totalBytes = 0;
for (const f of allFiles) {
  totalBytes += fs.statSync(f).size;
}

console.log(`Checked ${checked} critical paths.`);
if (missing === 0) {
  console.log(`All critical assets present and non-empty!`);
} else {
  console.error(`Found ${missing} missing or empty assets!`);
  process.exit(1);
}

console.log('\n--- Repository Asset Stats ---');
console.log(`Total public assets: ${allFiles.length} files`);
console.log(`Total storage size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

// Detailed stats by asset type
const counts = {
  models_buf: allFiles.filter(f => f.endsWith('.buf')).length,
  audio_ogg: allFiles.filter(f => f.endsWith('.ogg')).length,
  textures_webp: allFiles.filter(f => f.endsWith('.webp')).length,
  textures_png_jpg: allFiles.filter(f => f.endsWith('.png') || f.endsWith('.jpg')).length,
  textures_exr: allFiles.filter(f => f.endsWith('.exr')).length,
  videos_mp4: allFiles.filter(f => f.endsWith('.mp4')).length,
  fonts: allFiles.filter(f => f.endsWith('.woff') || f.endsWith('.woff2')).length,
  html_pages: allFiles.filter(f => f.endsWith('.html')).length,
};

console.log('\nAsset Breakdown:');
console.log(`- 3D Buffer Models (.buf): ${counts.models_buf}`);
console.log(`- Audio Stems (.ogg): ${counts.audio_ogg}`);
console.log(`- WebP Textures & Cards: ${counts.textures_webp}`);
console.log(`- PNG/JPG Textures: ${counts.textures_png_jpg}`);
console.log(`- Environment Maps (.exr): ${counts.textures_exr}`);
console.log(`- Project Showcase Videos (.mp4): ${counts.videos_mp4}`);
console.log(`- Web Fonts (.woff2/.woff): ${counts.fonts}`);
console.log(`- HTML Pages & Routes: ${counts.html_pages}`);
console.log('\nVerification PASSED 100%!');
