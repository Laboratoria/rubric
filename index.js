const { categories, skills, intl } = require('./data/processed.json');
const pkg = require('./package.json');


const skillIds = Object.keys(skills);


const sortByOrder = (a, b) => {
  if (a.order > b.order) {
    return 1;
  }
  if (a.order < b.order) {
    return -1;
  }
  return 0;
};


const buildTree = (nodes = categories, parent) => Object.keys(nodes)
  .reduce(
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
              .map(id => ({ id, ...skills[id] }))
              .sort(sortByOrder),
          },
        ]
    ),
    [],
  )
  .sort(sortByOrder);


const buildTreeWithLocale = (
  locale = 'es',
  nodes = categories,
  parent,
) => Object.keys(nodes)
  .reduce(
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
              }))
              .sort(sortByOrder),
          },
        ]
    ),
    [],
  )
  .sort(sortByOrder);


const applyLocale = (tree, locale) => tree.map(node => ({
  ...node,
  title: intl[locale][`categories.${node.id}`],
  children: applyLocale(node.children, locale),
  skills: node.skills.map(skill => ({
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
