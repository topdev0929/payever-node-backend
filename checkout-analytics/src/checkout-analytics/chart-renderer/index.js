const { renderGoogleChart } = require('./lib/render');

async function renderGoogleChartHttp(req, res) {
  let data = req.query;
  if (req.method === 'POST') {
    data = req.body;
  }

  try {
    const packages = data.packages ? data.packages.split(',') : ['corechart'];
    const opts = {
      height: data.height,
      mapsApiKey: data.mapsApiKey,
      packages,
      width: data.width,
    };
    const buf = await renderGoogleChart(data.code, opts);
    res.type('image/png').send(buf);
  } catch (err) {
    if (err.toString().indexOf('TimeoutError') > -1) {
      return res.status(500).send('Your chart was not rendered because it loaded too slowly.');
    }
    res.status(500).send(err.toString());
  }
}

module.exports = {
  render: renderGoogleChart,
  renderHttp: renderGoogleChartHttp,
};
