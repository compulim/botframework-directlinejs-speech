import create from './create';

export {
  create
}

if (typeof HTMLDocument !== 'undefined' && typeof document !== 'undefined' && document instanceof HTMLDocument) {
  const meta = document.createElement('meta');

  meta.setAttribute('name', 'botframework-directline:version');
  meta.setAttribute('content', process.env.NPM_PACKAGE_VERSION);

  document.head.appendChild(meta);
}
