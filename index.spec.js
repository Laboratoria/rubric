const rubric = require('./');
const pkg = require('./package.json');


describe('rubric', () => {
  it('should export name and version', () => {
    expect(rubric.name).toBe(pkg.name);
    expect(rubric.version).toBe(pkg.version);
  });

  describe('rubric.buildTree', () => {
    it('should build tree based on spreadsheed processed data', () => {
      expect(rubric.buildTree()).toMatchSnapshot();
    });

    it('should build tree with given order', () => {
      const tree = rubric.buildTree({
        foo: { order: 1 },
        bar: { order: 0 },
        baz: { order: 0 },
      });
      expect(tree[0].id).toBe('bar');
      expect(tree[1].id).toBe('baz');
      expect(tree[2].id).toBe('foo');
    });
  });

  describe('rubric.buildTreeWithLocale', () => {
    it('should build tree including localized texts', () => {
      expect(rubric.buildTreeWithLocale('es')).toMatchSnapshot();
    });

    it('should use spanish as default language', () => {
      expect(rubric.buildTreeWithLocale()).toMatchSnapshot();
    });
  });

  describe('rubric.applyLocale', () => {
    it('should...', () => {
      expect(rubric.applyLocale(rubric.buildTree(), 'es'))
        .toEqual(rubric.buildTreeWithLocale('es'));
    });
  });
});
