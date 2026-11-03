const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');
const build = path.join(root, 'build');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function main() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'gruvi-public-render-'));
  try {
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(temporary, 'node_modules'), 'junction');
    await new Promise((resolve, reject) => {
      const compiler = webpack({
        mode: 'production', target: 'node', context: root,
        entry: './scripts/public-render.jsx',
        output: { path: temporary, filename: 'render.cjs', library: { type: 'commonjs2' } },
        externals: [({ request }, callback) => request && !request.startsWith('.') && !path.isAbsolute(request) ? callback(null, 'commonjs ' + request) : callback()],
        resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'], alias: { [path.join(root, 'src/utils/googleAuth.ts')]: path.join(__dirname, 'static-auth.cjs') } },
        module: { rules: [
          { test: /\.[jt]sx?$/, exclude: /node_modules/, use: { loader: require.resolve('babel-loader'), options: { babelrc: false, configFile: false, presets: [[require.resolve('babel-preset-react-app'), { runtime: 'automatic' }]] } } },
          { test: /\.css$/, type: 'asset/source' },
          { test: /\.(svg|png|jpe?g|webp|gif)$/, type: 'asset/inline' },
        ] },
      });
      compiler.run((error, stats) => compiler.close(() => error ? reject(error) : stats.hasErrors() ? reject(new Error(stats.toString({ all: false, errors: true }))) : resolve()));
    });
    const renderer = require(temporary + '/render.cjs');
    const template = fs.readFileSync(build + '/index.html', 'utf8');
    if (!template.includes('<div id="root"></div>')) throw new Error('Run react-scripts build before generating public HTML');
    const sitemap = [...fs.readFileSync(root + '/public/sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/agentgruvi\.com([^<]*)<\/loc>/g)].map(m => m[1] || '/');
    if (JSON.stringify(sitemap.slice().sort()) !== JSON.stringify(renderer.publicRoutes.slice().sort())) throw new Error('Public renderer and sitemap routes must match');
    fs.mkdirSync(build + '/_public', { recursive: true });
    const manifest = {};
    for (const route of renderer.publicRoutes) {
      const { markup, metadata: seo } = renderer.renderPublicPage(route);
      if (!/<h1[\s>]/.test(markup)) throw new Error('Missing heading: ' + route);
      const canonical = 'https://agentgruvi.com' + route;
      const image = new URL(seo.ogImage || '/gruvi-social.png', canonical).href;
      const metas = [
        ['name', 'description', seo.description], ['name', 'robots', seo.robots || 'index, follow'],
        ['property', 'og:title', seo.ogTitle || seo.title], ['property', 'og:description', seo.ogDescription || seo.description],
        ['property', 'og:url', canonical], ['property', 'og:type', seo.ogType || 'website'], ['property', 'og:image', image],
        ['property', 'og:image:width', seo.ogImageWidth || '1200'], ['property', 'og:image:height', seo.ogImageHeight || '630'], ['property', 'og:image:alt', seo.ogImageAlt || 'Gruvi content distribution for agents'],
        ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', seo.twitterTitle || seo.title],
        ['name', 'twitter:description', seo.twitterDescription || seo.description], ['name', 'twitter:image', image],
        ['name', 'twitter:image:alt', seo.ogImageAlt || 'Gruvi content distribution for agents'],
      ].map(([attribute, key, value]) => `<meta ${attribute}="${key}" content="${escape(value)}">`).join('');
      let html = template.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '').replace(/<meta\b[^>]*(?:name|property)="(?:description|robots|og:[^"]*|twitter:[^"]*)"[^>]*>/gi, '').replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, '');
      const schema = seo.structuredData ? `<script id="gruvi-page-schema" type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, '\\u003c')}</script>` : '';
      html = html.replace('</head>', `<title>${escape(seo.title)}</title>${metas}<link rel="canonical" href="${canonical}">${schema}</head>`).replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
      const file = route === '/' ? '/_public/index.html' : '/_public' + route + '.html';
      fs.mkdirSync(path.dirname(build + file), { recursive: true });
      fs.writeFileSync(build + file, html);
      // Keep index.html as the SPA fallback for private workspace routes.
      // The public homepage is served from /_public/index.html at the edge.
      manifest[route] = file;
      console.log('Rendered ' + route + ' (' + Buffer.byteLength(html) + ' bytes)');
    }
    fs.writeFileSync(build + '/_public/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
