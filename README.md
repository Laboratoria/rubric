# rubric

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

La versión de la librería: `1.0.0`.

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

Retorna un objeto que representa el árbol de categorías con sus habilidades
correspondientes.

#### `buildTreeWithLocale(locale, nodes, parent)`

Igual que `buildTree`, pero agrega todos los textos (títulos, descripcciones,
niveles, ...) en el idioma (`locale`) seleccionado.

#### `applyLocale(tree, locale)`

Dado un árbol creado con `buildTree`, aplica los textos (títulos,
descripcciones, niveles, ...) en el idioma (`locale`) seleccionado.
