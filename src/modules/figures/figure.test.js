const Figure = require('./figure.js');

describe('modules/figures/figure', () => {

  test('constructor test', () => {
    const fig = new Figure();
    expect(fig).not.toBe(null);
    expect(fig).not.toBe(undefined);
  });

})
