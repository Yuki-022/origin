const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const mode = process.argv[2] || 'preview';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('overlay.html'));
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
  if (mode === 'preview') {
    for (const t of [1.8, 4.8, 7.5, 10.2, 14.5, 19.3, 21.8, 24.2, 26.6, 29.4]) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: `ov_${t}.png`, omitBackground: true });
    }
  } else {
    const fps = 30, N = 30 * fps;
    const ff = spawn('ffmpeg', ['-y','-loglevel','error','-i','footage.mp4','-f','image2pipe','-framerate','30','-c:v','png','-i','-',
      '-filter_complex','[0:v]trim=duration=30,setpts=PTS-STARTPTS[b];[b][1:v]overlay=0:0:format=auto,format=yuv420p[v]',
      '-map','[v]','-c:v','libx264','-crf','17','-preset','medium','-t','30','video_noaudio.mp4'], { stdio: ['pipe','inherit','inherit'] });
    for (let i = 0; i < N; i++) {
      await page.evaluate(t => render(t), i / fps);
      const buf = await page.screenshot({ type: 'png', omitBackground: true });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log('frame', i);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
