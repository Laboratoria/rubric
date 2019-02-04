# rubric

[![Build Status](https://travis-ci.com/Laboratoria/rubric.svg?token=4uyuoxi9qhvAfjzUTB6y&branch=master)](https://travis-ci.com/Laboratoria/rubric)

## Instalación

```sh
# con npm
npm install --save Laboratoria/rubric

# con yarn
yarn add Laboratoria/rubric
```

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

#### `buildTree(nodes, parent)`

Retorna un arreglo que representa el árbol de categorías con sus habilidades
correspondientes.

Cada categoría (`Category`) tiene las siguientes propiedades:

* `id`: `String`
* `order`: `Number`
* `children`: `Array`
* `skills` `Array` de `Skill`s

Cada habilidad (`Skill`) tiene las siguientes propiedades:

* `id`: `String`
* `core`: `Boolean`
* `cc`: `Number`
* `bc`: `Number`
* `order`: `Number`
* `category`: `String`

```js
// Objeto `category`
{
  id: 'cs',
  parent: 'frontEnd',
  order: 0,
  children: [],
  skills: [
    // Objeto `skill`
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

* `id`: `String`
* `order`: `Number`
* `children`: `Array`
* `skills` `Array` de `Skill`s
* `title`: `String`

Cada habilidad (`Skill`) tiene las mismas propiedades que las habilidades que
retorna `buildTree()`, pero además incluye las propiedades`title`,
`description` y `levels`:

* `id`: `String`
* `core`: `Boolean`
* `cc`: `Number`
* `bc`: `Number`
* `order`: `Number`
* `category`: `String`
* `title`: `String`
* `description`: `String`
* `levels`: `Array` de `String`s

```js
// Objeto `category` con traducción
{
  id: 'cs',
  parent: 'frontEnd',
  order: 0,
  title: 'Computer Science (CS)',
  children: [],
  skills:[
    // Objeto `skill` con traducción
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
