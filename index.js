const { categories, skills, intl } = require('./data/processed');
const pkg = require('./package.json');


const skillIds = Object.keys(skills);


const buildTree = (parent, nodes = categories) => Object.keys(nodes).reduce(
  (memo, key) => (
    (nodes[key].parent !== parent)
      ? memo
      : [
        ...memo,
        {
          id: key,
          ...nodes[key],
          children: buildTree(nodes, key),
          skills: skillIds
            .filter(id => skills[id].category === key)
            .map(id => ({
              id,
              ...skills[id],
            })),
        },
      ]
  ),
  [],
);


const buildTreeWithLocale = (
  parent,
  locale = 'es',
  nodes = categories,
) => Object.keys(nodes).reduce(
  (memo, key) => (
    (nodes[key].parent !== parent)
      ? memo
      : [
        ...memo,
        {
          id: key,
          ...nodes[key],
          title: intl[locale][`categories.${key}`],
          children: buildTreeWithLocale(locale, nodes, key),
          skills: skillIds
            .filter(id => skills[id].category === key)
            .map(id => ({
              id,
              ...skills[id],
              title: intl[locale][`skills.${id}`],
              description: intl[locale][`skills.${id}.description`],
              levels: [0, 1, 2, 3, 4].map(
                idx => intl[locale][`skills.${id}.levels.${idx}`],
              ),
            })),
        },
      ]
  ),
  [],
);


const applyLocale = (tree, locale) => tree.map(node => ({
  ...node,
  title: intl[locale][`categories.${node.id}`],
  children: applyLocale(node.children, locale),
  skills: (node.skills || []).map(skill => ({
    ...skill,
    title: intl[locale][`skills.${skill.id}`],
    description: intl[locale][`skills.${skill.id}.description`],
    levels: [0, 1, 2, 3, 4].map(idx => intl[locale][`skills.${skill.id}.levels.${idx}`]),
  })),
}));


module.exports = {
  name: pkg.name,
  version: pkg.version,
  categories,
  skills,
  intl,
  buildTree,
  buildTreeWithLocale,
  applyLocale,
};
