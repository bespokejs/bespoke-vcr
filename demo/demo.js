bespoke.from('article', [
  bespoke.plugins.classes(),
  bespoke.plugins.keys(),
  bespoke.plugins.vcr()
]);

window.vcr = bespoke.plugins.vcr;
