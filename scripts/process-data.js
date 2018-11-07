#! /usr/bin/env node


const fromSpreadsheet = require('../data/gsheets.json');


const categoryToIdMap = {
  General: 'general',
  'Habilidades Técnicas (Front End)': 'frontEnd',
  'Habilidades Blandas (Soft Skills)': 'soft',
  'Habilidades Técnicas (UX)': 'ux',

  'Nivel de logro general para cada proyecto': 'xxx',

  'Computer Science (CS)': 'cs',
  'Source Code Managment (SCM)': 'scm',
  JavaScript: 'js',
  'HTML/CSS': 'html', // css??

  'Habilidades de Autogestión': 'selfManagement',
  'Habilidades para las Relaciones interpersonales': 'interpersonalRelationships',

  'UX Design': 'uxDesign',
  Research: 'research',
  'Interaction design': 'interactionDesign',
  'Visual design': 'visualDesign',
  'Business mindset': 'businessMindset',
  'Tech understanding': 'techUnderstanding',
};


const categoryToId = (str) => {
  const trimmed = str.trim();

  if (categoryToIdMap[trimmed]) {
    return categoryToIdMap[trimmed];
  }

  return str;
};


const skillToIdMap = {
  Completitud: 'completeness',
  'Documentación (producción)': 'documentation',
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
  SEO: 'seo',

  'Planificación y manejo del tiempo': 'softPlanning',
  Autoaprendizaje: 'selfLearning',
  Presentaciones: 'presentations',
  Adaptabilidad: 'adaptability',
  'Solución de problemas': 'problemSolving',
  'Trabajo en equipo: colaborativo': 'collaboration',
  'Trabajo en equipo: responsabilidad': 'teamWork',
  'Dar y recibir feedback': 'feedback',
  'Comunicación eficaz': 'communication',

  'User centricity': 'userCentricity',
  Planificación: 'uxPlanning',
  Analítica: 'analytics',
  Entrevistas: 'interviews',
  Observación: 'observation',
  Testing: 'uxTesting',
  'Síntesis de resultados': 'synthesis',
  'Flujos de usuario': 'userFlow',
  'Uso de componentes': 'useOfComponents',
  'Arquitectura de la información': 'informationArchitecture',
  Prototyping: 'prototyping',
  Contraste: 'contrast',
  Alineación: 'alignment',
  Jerarquías: 'hierarchy',
  Tipografías: 'typography',
  Color: 'color',
  Accesibilidad: 'accessibility',
  Usabilidad: 'usability',
  'Objetivos de negocio + KPIs': 'businessObjectivesKPI',
  'Relación con Stakeholders': 'stakeholdersRelationships',
  Priorización: 'priorization',
  'Otras tecnologías': 'otherTechnologies',

  'Entrevistas y testing': 'interviews',
  'Visual Design': 'visualDesign',
  'Business mindset': 'businessMindset',
};


const skillToId = (str) => {
  const trimmed = str.trim();

  if (skillToIdMap[trimmed]) {
    return skillToIdMap[trimmed];
  }

  return str;
};


const isHeadingRow = row => (
  row[0] === ''
  || row[0] === 'Habilidad'
  || /^Nivel de logro/.test(row[0])
);


const data = fromSpreadsheet.map((rows) => {
  // const rootCategoryId = (idx === arr.length - 1) ? 'ux-2' : categoryToId(rows[0][0]);
  const rootCategoryId = categoryToId(rows[0][0]);
  const rootCategoryDescription = rows[1][0] || '';
  const { categories, skills, intl } = rows.slice(2)
    .filter(row => !isHeadingRow(row)) // ignore headings...
    .reduce((memo, row) => (
      (row.length === 1) // category
        ? {
          ...memo,
          currentCategory: categoryToId(row[0]),
          categories: {
            ...memo.categories,
            [categoryToId(row[0])]: { parent: rootCategoryId },
          },
          intl: {
            ...memo.intl,
            [`categories.${categoryToId(row[0])}`]: row[0],
          },
        }
        : {
          ...memo,
          skills: {
            ...memo.skills,
            [skillToId(row[0])]: {
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
        [rootCategoryId]: {},
      },
      skills: {},
      intl: {
        [`categories.${rootCategoryId}`]: rows[0][0],
        [`categories.${rootCategoryId}.description`]: rows[1][0],
      },
      currentCategory: null,
    });

  return {
    id: rootCategoryId,
    description: rootCategoryDescription,
    categories,
    skills,
    intl,
  };
}, []);


const flattened = data.reduce((memo, item) => {
  const duplicates = Object.keys(item.categories)
    .filter(key => Object.prototype.hasOwnProperty.call(memo.categories, key));

  if (duplicates.length) {
    console.error(item.id, duplicates);
  }

  return {
    ...memo,
    categories: { ...memo.categories, ...item.categories },
    skills: { ...memo.skills, ...item.skills },
    intl: { es: { ...memo.intl.es, ...item.intl } },
  };
}, {
  categories: {},
  skills: {},
  intl: { es: {} },
});


console.log(JSON.stringify(flattened, null, 2));
