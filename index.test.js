import { describe, it } from 'mocha'
import { equal } from 'assert'
import { JSDOM } from 'jsdom'
import { createElement } from 'react'
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
      equal(text, nodeToReact(text, createElement))
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
      equal(text, nodeToReact(document.createTextNode(text), createElement))
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
      equal(HTML, renderToStaticMarkup(nodeToReact(document.body.firstChild, createElement)))
    })
  })

  it('should return React element without filtered attribute', () => {
    document.body.innerHTML = '<p data-test="true">test</p>'
    equal('<p>test</p>', renderToStaticMarkup(nodeToReact(document.body.firstChild, (type, props, ...children) => {
      delete props['data-test']
      return createElement(type, props, ...children)
    })))
  })

  it('should return React element without filtered child', () => {
    document.body.innerHTML = '<p>test <span data-test="true">test <strong>test</strong></span></p>'
    equal('<p>test </p>', renderToStaticMarkup(nodeToReact(document.body.firstChild, (type, props, ...children) => {
      if (!props['data-test']) {
        return createElement(type, props, ...children)
      }
    })))
  })

  it('should return React element without filtered tag', () => {
    document.body.innerHTML = '<p>test <span data-test="true">test <strong>test</strong></span></p>'
    equal('<p>test test <strong>test</strong></p>', renderToStaticMarkup(nodeToReact(document.body.firstChild, (type, props, ...children) => {
      if (!props['data-test']) {
        return createElement(type, props, ...children)
      } else {
        return children
      }
    })))
  })
})
