#! /usr/bin/env node


const { deepEqual } = require('assert');
const fromSpreadsheet = require('../data/gsheets.json');


const isHeadingRow = row => (
  row[0] === ''
  || row[0] === 'Habilidad'
  || row[0] === 'Habilidade'
);


const objDiff = (a, b) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return aKeys.reduce(
    (memo, key) => {
      if (!bKeys.includes(key)) {
        return { ...memo, removed: [...memo.added, key] };
      }

      try {
        deepEqual(a[key], b[key]);
        return memo;
      } catch (err) {
        return { ...memo, changed: [...memo.changed, key] };
      }
    },
    {
      added: bKeys.reduce(
        (memo, key) => (
          (!aKeys.includes(key))
            ? [...memo, key]
            : memo
        ),
        [],
      ),
      changed: [],
      removed: [],
    },
  );
};

const arrayDiff = (a, b) => a.reduce(
  (memo, item) => (
    !b.includes(item)
      ? { ...memo, removed: [...memo.removed, item] }
      : memo
  ),
  {
    added: b.reduce(
      (memo, item) => (
        !a.includes(item)
          ? item
          : memo
      ),
      [],
    ),
    removed: [],
  },
);


const processTranslation = (data, { categoryToIdMap, skillToIdMap }) => {
  const lowerCasedCategoryToIdMap = Object.keys(categoryToIdMap).reduce(
    (memo, key) => ({
      ...memo,
      [key.toLowerCase()]: categoryToIdMap[key],
    }),
    {},
  );


  const categoryToId = (str) => {
    const trimmed = str.trim().toLowerCase();

    if (lowerCasedCategoryToIdMap[trimmed]) {
      return lowerCasedCategoryToIdMap[trimmed];
    }

    console.warn(`Unknown category ${str}`);

    return str;
  };


  const skillToId = (str) => {
    const trimmed = str.trim();

    if (skillToIdMap[trimmed]) {
      return skillToIdMap[trimmed];
    }

    console.warn(`Unknown skill ${str}`);

    return str;
  };

  return data
    .slice(1)
    .map((rows, sheetIdx) => {
      const rootCategoryId = categoryToId(rows[0][0]);
      // If in 2nd sheet (UX), we skip two rows because we have the legacy
      // "description"
      const hasRootCategoryDescription = [1].includes(sheetIdx);
      const rootCategoryDescription = hasRootCategoryDescription ? rows[1][0] : '';
      const { categories, skills, intl } = rows.slice(hasRootCategoryDescription ? 2 : 1)
        .filter(row => !isHeadingRow(row)) // ignore headings...
        .reduce((memo, row) => (
          (row.length === 1) // category
            ? {
              ...memo,
              currentCategory: categoryToId(row[0]),
              currentCategoryIdx: memo.currentCategoryIdx + 1,
              currentSkillIdx: -1,
              categories: {
                ...memo.categories,
                [categoryToId(row[0])]: {
                  parent: rootCategoryId,
                  order: memo.currentCategoryIdx + 1,
                },
              },
              intl: {
                ...memo.intl,
                [`categories.${categoryToId(row[0])}`]: row[0],
              },
            }
            : {
              ...memo,
              currentSkillIdx: memo.currentSkillIdx + 1,
              skills: {
                ...memo.skills,
                [skillToId(row[0])]: {
                  core: row[7],
                  order: memo.currentSkillIdx + 1,
                  category: (
                    (memo.currentCategory && memo.currentCategory !== 'xxx')
                      ? memo.currentCategory
                      : rootCategoryId
                  ),
                },
              },
              intl: {
                ...memo.intl,
                [`skills.${skillToId(row[0])}`]: row[0],
                [`skills.${skillToId(row[0])}.description`]: row[1],
                [`skills.${skillToId(row[0])}.levels.0`]: row[2],
                [`skills.${skillToId(row[0])}.levels.1`]: row[3],
                [`skills.${skillToId(row[0])}.levels.2`]: row[4],
                [`skills.${skillToId(row[0])}.levels.3`]: row[5],
                [`skills.${skillToId(row[0])}.levels.4`]: row[6],
              },
            }
        ), {
          categories: {
            [rootCategoryId]: {
              order: sheetIdx,
            },
          },
          skills: {},
          intl: {
            [`categories.${rootCategoryId}`]: rows[0][0],
            [`categories.${rootCategoryId}.description`]: rows[1][0],
          },
          currentCategory: null,
          currentCategoryIdx: -1,
          currentSkillIdx: -1,
        });

      return {
        id: rootCategoryId,
        description: rootCategoryDescription,
        categories,
        skills,
        intl,
      };
    })
    .reduce((memo, item) => {
      const duplicates = Object.keys(item.categories)
        .filter(key => Object.prototype.hasOwnProperty.call(memo.categories, key));

      if (duplicates.length) {
        console.error(item.id, duplicates);
      }

      return {
        ...memo,
        categories: { ...memo.categories, ...item.categories },
        skills: { ...memo.skills, ...item.skills },
        intl: { ...memo.intl, ...item.intl },
      };
    }, {
      categories: {},
      skills: {},
      intl: { description: data[0][1][0] },
    });
};


const es = processTranslation(fromSpreadsheet.slice(0, 4), {
  categoryToIdMap: {
    'Habilidades Técnicas (Front-end)': 'frontEnd',
    'Habilidades Técnicas (UX)': 'ux',
    'Habilidades Blandas (Soft Skills)': 'soft',

    // Tech
    'Computer Science (CS)': 'cs',
    'Source Code Management (SCM)': 'scm',
    JavaScript: 'js',
    'HTML/CSS': 'html',

    // UX
    Research: 'research',
    'Interaction design': 'interactionDesign',
    'Visual design': 'visualDesign',
    'Business mindset': 'businessMindset',

    // Soft
    'Habilidades de Autogestión': 'selfManagement',
    'Habilidades para relaciones interpersonales': 'interpersonalRelationships',
  },
  skillToIdMap: {
    // Tech
    'Lógica / Algoritmia': 'logic',
    Arquitectura: 'architecture',
    'Patrones/Paradigmas': 'softwareDesign',
    Git: 'git',
    GitHub: 'github',
    'Estilo (linter js)': 'jsStyle',
    'Nomenclatura / semántica': 'jsSemantics',
    'Uso de funciones / modularidad': 'modularity',
    'Estructuras de datos': 'dataStructures',
    Tests: 'jsTesting',
    'Correctitud / Validación': 'htmlValidation',
    'Estilo (linter html)': 'htmlStyle',
    'Semántica / Arquitectura de información': 'htmlSemantics',
    'DRY (CSS)': 'cssDry',
    'Responsive Web Design': 'cssResponsive',

    // UX
    'User centricity': 'userCentricity',
    Entrevistas: 'interviews',
    Testing: 'uxTesting',
    'Planeamiento y ejecución': 'uxPlanning',
    'Síntesis de resultados': 'synthesis',
    'Diseño de interacción': 'interactionDesign',
    'Arquitectura de la información': 'informationArchitecture',
    Prototyping: 'prototyping',
    'Visual Design': 'visualDesign',
    'Business mindset': 'businessMindset',

    // Soft
    'Planificación, organización y manejo del tiempo': 'softPlanning',
    Autoaprendizaje: 'selfLearning',
    Presentaciones: 'presentations',
    Adaptabilidad: 'adaptability',
    'Solución de problemas': 'problemSolving',
    'Trabajo en equipo': 'teamWork',
    Responsabilidad: 'responsibility',
    'Dar y recibir feedback': 'feedback',
    'Comunicación eficaz': 'communication',
  },
});


const pt = processTranslation(fromSpreadsheet.slice(4), {
  categoryToIdMap: {
    'Habilidades Técnicas (Front-end)': 'frontEnd',
    'Habilidades Técnicas (UX)': 'ux',
    'Habilidades Interpessoais (Soft Skills)': 'soft',

    // Tech
    'Computer Science (CS)': 'cs',
    'Source Code Management (SCM)': 'scm',
    JavaScript: 'js',
    'HTML/CSS': 'html',

    // UX
    Research: 'research',
    'Interaction design': 'interactionDesign',
    'Visual design': 'visualDesign',
    'Business mindset': 'businessMindset',

    // Soft
    'Habilidades de Autogestión': 'selfManagement',
    'Habilidades para as Relações interpessoais': 'interpersonalRelationships',
  },
  skillToIdMap: {
    // Tech
    'Lógica / Algoritmos': 'logic',
    Arquitetura: 'architecture',
    'Padrões/Paradigmas': 'softwareDesign',
    Git: 'git',
    GitHub: 'github',
    'Estilo (linter js)': 'jsStyle',
    'Nomenclatura / semântica': 'jsSemantics',
    'Uso de funções / modularidade': 'modularity',
    'Estruturas de dados': 'dataStructures',
    Testes: 'jsTesting',
    'Exatidão / Validação': 'htmlValidation',
    'Estilo (linter html)': 'htmlStyle',
    'Semântica / Arquitetura de Informação': 'htmlSemantics',
    'DRY (CSS)': 'cssDry',
    'Responsive Web Design': 'cssResponsive',

    // UX
    'User centricity': 'userCentricity',
    Entrevistas: 'interviews',
    Testing: 'uxTesting',
    'Planeamiento y ejecución': 'uxPlanning',
    'Síntesis de resultados': 'synthesis',
    'Diseño de interacción': 'interactionDesign',
    'Arquitectura de la información': 'informationArchitecture',
    Prototyping: 'prototyping',
    'Visual Design': 'visualDesign',
    'Business mindset': 'businessMindset',

    // Soft
    'Planejamento e administração do tempo': 'softPlanning',
    Autoaprendizado: 'selfLearning',
    Apresentações: 'presentations',
    Adaptabilidade: 'adaptability',
    'Solução de problemas': 'problemSolving',
    'Trabalho em equipe': 'teamWork',
    Responsabilidade: 'responsibility',
    'Dar e receber feedback': 'feedback',
    'Comunicação eficaz': 'communication',
  },
});


['categories', 'skills'].forEach((prop) => {
  const { added, changed, removed } = objDiff(es[prop], pt[prop]);
  if (added.length || changed.length || removed.length) {
    console.error(`Discrepancies in ${prop}`, { added, changed, removed });
    process.exit(1);
  }
});

const intlDiff = arrayDiff(Object.keys(es.intl), Object.keys(pt.intl));
if (intlDiff.added.length || intlDiff.removed.length) {
  console.error('Discrepancies in skills translations', intlDiff);
  process.exit(1);
}


console.log(JSON.stringify(
  { ...es, intl: { es: es.intl, pt: pt.intl } },
  null,
  2,
));
