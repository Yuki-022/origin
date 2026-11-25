const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const mode = process.argv[2] || 'preview';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('scene.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  if (mode === 'preview') {
    for (const t of [1.6, 5.4, 9, 15.5, 21.5, 26.5, 29.4]) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: `prev_${t}.png` });
    }
  } else {
    const fps = 30, N = 30 * fps;
    const ff = spawn('ffmpeg', ['-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-preset','medium','-crf','18','silent.mp4'], { stdio: ['pipe','ignore','inherit'] });
    for (let i = 0; i < N; i++) {
      await page.evaluate(t => render(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log('frame', i);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
