# @laboratoria/rubric

[![Build Status](https://travis-ci.com/Laboratoria/rubric.svg?token=4uyuoxi9qhvAfjzUTB6y&branch=master)](https://travis-ci.com/Laboratoria/rubric)
[![Coverage Status](https://coveralls.io/repos/github/Laboratoria/rubric/badge.svg?branch=master)](https://coveralls.io/github/Laboratoria/rubric?branch=master)

Este repositorio contienen una _librería_ (_biblioteca_) de JavaScript que
representa la _rúbrica_ que usamos en el Bootcamp de Laboratoria. La _rúbrica_
se mantiene como una [hoja de cálculo en Google Sheets](https://docs.google.com/spreadsheets/d/e/2PACX-1vRktPN4ilZtkRN5tUb3DVhgeihwlzk63_-JI3moA-bXpKDbHDioAK2H3qbrwWNb0Ql4wX22Tgv7-PDv/pubhtml?gid=146943998),
donde los _mantenedores_ de la _currícula_ (tech, ux y habilidades blandas)
también mantienen este documento de la rúbrica.

Los _mantenedores_ del documento de la rúbrica son:

* [@rocioalberdi](https://github.com/rocioalberdi/) (Habilidades blandas)
* [@lupomontero](https://github.com/lupomontero/) (Front-end)
* [@lalogf](https://github.com/lalogf/) (UX)
* [@diegovelezg](https://github.com/diegovelezg/) (General)
* [@CaroLaboratoria](https://github.com/CaroLaboratoria/) (General)

## Instalación

Si solo necesitas la versión más reciente de la _rúbrica_, puedes instalar el
módulo `@laboratoria/rubric` desde el repo de GitHub con los siguientes comandos:

```sh
# con npm
npm install --save @laboratoria/rubric

# con yarn
yarn add @laboratoria/rubric
```

<!--
### Instalación de varias versiones en paralelo

Por otro lado, en muchos casos necesitarás poder usar varias versiones de la
_rúbrica_ en la misma aplicación. Si este es el caso, puedes especificar
diferentes versiones como dependencias separadas cada una apuntando a una _rama_
o _tag_ del repo de `Laboratoria/rubric` en GitHub.

Por ejemplo, en tu `package.json`:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "rubric-v1": "@laboratoria/rubric#v1.0.0",
    "rubric-v2": "@laboratoria/rubric#v2.3.1"
  }
}
```

Y después en tu código:

```js
const rubric = {
  v1: require('rubric-v1'),
  v2: require('rubric-v2'),
};


console.log(rubric.v1.buildTreeWithLocale('es'));
```
-->

## API

### Propiedades

#### `name`

El nombre de la librería: `rubric`.

#### `version`

La versión de la librería: `2.0.0`.

#### `categories`

Objeto (diccionario) con las diferentes categorías en las que se organizan las
_habilidades_ o _skills_.

#### `skills`

Objeto (diccionario) con las diferentes _habilidades_/_skills_.

#### `intl`

Objeto (diccionario) con las traducciones de los nombres de las categorías,
y nombres, descriciones y niveles de cada _habilidad_

### Métodos

#### `buildTree(nodes = categories, parent = undefined)`

Retorna un `Array` con las _categorías raíz_. Por defecto, si omitimos el
argumento `nodes`, las categorías raíz serían las _hojas_ del spreadsheet, y si
omitimos el argumento `parent` estaríamos diciendo que queremos construir el
árbol desde la raíz. El arreglo retornado contiene las categorías raíz, cada una
con sus subcategorías y habilidades correspondientes.

```js
const rubric = require('rubric');

// Build entire tree from the root
console.log(rubric.buildTree());

// Build partial tree (sub-tree) for a given branch
console.log(rubric.buildTree(undefined, 'frontEnd'));
```

Cada categoría/subcategoría (`Category`) tiene las siguientes propiedades:

* `id`: `String`: El _identificador_ de la categoría.
* `order`: `Number`: El orden de la categoría dentro de su categoría _madre_.
* `children`: `Array` `[Category]`: Un arreglo con subcategorías que sean
  _hijas_ de la categoría.
* `skills` `Array` `[Skill]`: Un arreglo de objetos de tipo `Skill` detallados
  más abajo.

Cada habilidad (`Skill`) tiene las siguientes propiedades:

* `id`: `String`: El _identificador_ de la habilidad.
* `core`: `Boolean`: Un booleano (`true` o `false`) que indica si la habilidad
  en cuestión es considerada _central_ al programa de formación.
* `cc`: `Number`: Expectativa de nivel al final del _common core_.
* `bc`: `Number`: Expectativa de nivel al final del _bootcamp_.
* `order`: `Number`: El orden de la habilidad dentro de su categoría _madre_.
* `category`: `String`: La categoría a la que pertenece la habilidad.

Ejemplo de un objeto `Category` conteniendo un objeto `Skill`:

```js
// Objeto `Category`
{
  id: 'cs',
  parent: 'frontEnd',
  order: 0,
  children: [],
  skills: [
    // Objeto `Skill`
    {
      id: 'logic',
      core: true,
      cc: 1,
      bc: 2,
      order: 0,
      category: 'cs'
    }
  ]
}
```

#### `buildTreeWithLocale(locale, nodes, parent)`

Igual que `buildTree`, pero agrega todos los textos (títulos, descripcciones,
niveles, ...) en el idioma (`locale`) seleccionado.

Cada categoría (`Category`) tiene las mismas propiedades que las categorías que
retorna `buildTree()`, pero además incluye la propiedad `title` en el idioma
seleccionado:

* `id`: `String`: El _identificador_ de la categoría.
* `order`: `Number`: El orden de la categoría dentro de su categoría _madre_.
* `children`: `Array` `[Category]`: Un arreglo con subcategorías que sean
  _hijas_ de la categoría.
* `skills` `Array` `[Skill]`: Un arreglo de objetos de tipo `Skill` detallados
  más abajo.
* `title`: `String`: El _título_ de la categoría en el idioma seleccionado.

Cada habilidad (`Skill`) tiene las mismas propiedades que las habilidades que
retorna `buildTree()`, pero además incluye las propiedades`title`,
`description` y `levels`:

* `id`: `String`: El _identificador_ de la habilidad.
* `core`: `Boolean`: Un booleano (`true` o `false`) que indica si la habilidad
  en cuestión es considerada _central_ al programa de formación.
* `cc`: `Number`: Expectativa de nivel al final del _common core_.
* `bc`: `Number`: Expectativa de nivel al final del _bootcamp_.
* `order`: `Number`: El orden de la habilidad dentro de su categoría _madre_.
* `category`: `String`: La categoría a la que pertenece la habilidad.
* `title`: `String`: El _título_ de la habilidad en el idioma seleccionado.
* `description`: `String`: Descripcción de la habilidad en el idioma
  seleccionado.
* `levels`: `Array` `[String]`: Un arreglo de _strings_ con las descripcciones
  de cada _nivel_ en el idioma seleccionado.

Ejemplo de un objeto `Category` (con traducción) conteniendo un objeto `Skill`
(con traducción):

```js
// Objeto `Category` con traducción
{
  id: 'cs',
  parent: 'frontEnd',
  order: 0,
  title: 'Computer Science (CS)',
  children: [],
  skills:[
    // Objeto `Skill` con traducción
    {
      id: 'logic',
      core: true,
      cc: 1,
      bc: 2,
      order: 0,
      category: 'cs',
      title: 'Lógica / Algoritmia',
      description: 'Capacidad de expresión lógica, ...',
      levels: [
        'Código no sigue ninguna convención o patrón común...',
        'Demuestra uso de convenciones de JavaScript idiomático...',
        'Es consciente de la diferencia entre estilos...',
        'Demuestra soltura pasando de un estilo/paradigma a otro...',
        'Demuestra soltura y profundidad con diferentes convenciones...',
     ],
    },
  ],
};
```

#### `applyLocale(tree, locale)`

Dado un árbol creado con `buildTree`, aplica los textos (títulos,
descripcciones, niveles, ...) en el idioma (`locale`) seleccionado.

***

## Tareas de desarrollo

### Pruebas unitarias

```
yarn test
```

### Desarga de datos de Google Sheets

```
yarn fetch-data
```

### Procesado de data descargada de Google Sheets

```
yarn process-data
```
