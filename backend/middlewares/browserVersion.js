// Código gerado por IA (Copilot)

// Lista de navegadores suportados e versões mínimas
const supportedBrowsers = {
  Chrome: { minVersion: 130, updateUrl: 'https://www.google.com/chrome/' },
  Firefox: { minVersion: 120, updateUrl: 'https://www.mozilla.org/firefox/' },
  Edg: { minVersion: 130, updateUrl: 'https://www.microsoft.com/edge' }, // Edge
  Safari: {
    minVersion: 16,
    updateUrl: 'https://support.apple.com/downloads/safari',
  },
  Opera: { minVersion: 100, updateUrl: 'https://www.opera.com/download' },
  MSIE: { minVersion: Infinity, updateUrl: 'https://www.microsoft.com/edge' }, // IE  bloqueado
};

// Middleware global para verificar versão do navegador
module.exports = (req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  let outdated = false;
  let browserName = '';
  let updateUrl = '';

  Object.entries(supportedBrowsers).some(([browser, info]) => {
    const match = ua.match(new RegExp(`${browser}/?(\\d+)`));
    if (match) {
      const version = parseInt(match[1], 10);
      if (version < info.minVersion) {
        outdated = true;
        browserName = browser === 'Edg' ? 'Microsoft Edge' : browser;
        updateUrl = info.updateUrl;
      }
      return true; // Para interromper o .some() quando encontrar
    }
    return false;
  });

  if (outdated) {
    return res.status(426).send(`
      <html>
        <head>
          <title>Navegador desatualizado</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: #232323; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #232323; color: #fff; text-decoration: none; border-radius: 5px; }
            a:hover { background: #7b7a7a; }
          </style>
        </head>
        <body>
          <h1>Seu navegador (${browserName}) está desatualizado!</h1>
          <p>Para garantir sua segurança e melhor experiência, atualize para a versão mais recente.</p>
          <a href="${updateUrl}" target="_blank">Atualizar ${browserName}</a>
        </body>
      </html>
    `);
  }

  return next();
};
