import { describe, it } from 'mocha'
import { equal } from 'assert'
import { JSDOM } from 'jsdom'
import { renderToStaticMarkup } from 'react-dom/server'

import { nodeToReact } from '.'

const { window } = new JSDOM()
const { document } = window

describe('nodeToReact()', () => {
  [ // Empty
    {
      description: 'should return null for null',
      value: null
    },
    {
      description: 'should return null for non-node',
      value: 'not a node'
    }
  ].forEach(({ description, text }) => {
    it(description, () => {
      equal(text, nodeToReact(text))
    })
  });

  [ // Text
    {
      description: 'should return empty string for empty text node',
      text: ''
    },
    {
      description: 'should return string for text node',
      text: 'test'
    }
  ].forEach(({ description, text }) => {
    it(description, () => {
      equal(text, nodeToReact(document.createTextNode(text)))
    })
  });

  [ // Elements
    {
      description: 'should return React element for DOM element',
      HTML: '<p>test</p>'
    },
    {
      description: 'should return React element with props for DOM element with attributes',
      HTML: '<p class="test">test</p>'
    },
    {
      description: 'should return React element with children for DOM element with children',
      HTML: '<p>test <strong>test</strong></p>'
    },
    {
      description: 'should return React element with children for DOM element with children',
      HTML: '<p>test <strong>test</strong></p>'
    }
  ].forEach(({ description, HTML }) => {
    it(description, () => {
      document.body.innerHTML = HTML
      equal(HTML, renderToStaticMarkup(nodeToReact(document.body.firstChild)))
    })
  })
})
