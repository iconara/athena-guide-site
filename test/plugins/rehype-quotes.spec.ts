import each from 'jest-each'
import u from 'unist-builder'
import rehypeQuotes from '~/plugins/rehype-quotes'

const PREFIXES = [
  [' ', 'space'],
  ['(', 'parenthesis'],
  ['', 'start of the string'],
]

const SUFFIXES = [
  [' ', 'space'],
  ['.', 'full stop'],
  [',', 'comma'],
  [';', 'semi-colon'],
  [':', 'colon'],
  ['!', 'exclamation point'],
  ['?', 'question mark'],
  [')', 'parenthesis'],
  ['', 'end of the string'],
]

describe('rehype-quotes', () => {
  each([
    ...PREFIXES.map(([char, name]) => [`a straight double quote before a letter with a start double quote when preceded by a ${name}`, `${char}"quoted`, `${char}“quoted`]),
    ...PREFIXES.map(([char, name]) => [`a straight double quote before a number with a start double quote when preceded by a ${name}`, `${char}"123`, `${char}“123`]),
    ...PREFIXES.map(([char, name]) => [`a straight single quote before a letter with a start single quote when preceded by a ${name}`, `${char}'quoted`, `${char}‘quoted`]),
    ...PREFIXES.map(([char, name]) => [`a straight single quote before a number with a start single quote when preceded by a ${name}`, `${char}'123`, `${char}‘123`]),
    ...SUFFIXES.map(([char, name]) => [`a straight double quote before a letter with an end double quote when followed by a ${name}`, `quoted"${char}`, `quoted”${char}`]),
    ...SUFFIXES.map(([char, name]) => [`a straight double quote before a number with an end double quote when followed by a ${name}`, `123"${char}`, `123”${char}`]),
    ...SUFFIXES.map(([char, name]) => [`a straight single quote before a letter with an end single quote when followed by a ${name}`, `quoted'${char}`, `quoted’${char}`]),
    ...SUFFIXES.map(([char, name]) => [`a straight single quote before a number with an end single quote when followed by a ${name}`, `123'${char}`, `123’${char}`]),
    ['a straight single quote with an apostrophe when between two letters', 'that\'s a word', 'that’s a word'],
  ]).it('replaces %s', (_description, input, output) => {
    const tree = u('tree', [u('text', input as string)])
    rehypeQuotes()(tree)
    expect(tree.children[0].value).toBe(output)
  })

  describe('when inside of a <code> element', () => {
    it('does not replace any double quotes', () => {
      const tree = u('tree', [
        u('element', {tagName: 'code'}, [
          u('text', 'a "quoted" word'),
        ]),
      ])
      rehypeQuotes()(tree)
      expect(tree.children[0].children[0].value).toBe('a "quoted" word')
    })

    it('does not replace any single quotes', () => {
      const tree = u('tree', [
        u('element', {tagName: 'code'}, [
          u('text', 'that\'s a word'),
        ]),
      ])
      rehypeQuotes()(tree)
      expect(tree.children[0].children[0].value).toBe('that\'s a word')
    })

    describe('and it\'s not the direct parent', () => {
      it('does not replace any double quotes', () => {
        const tree: any = u('tree', [
          u('element', {tagName: 'code'}, [
            u('text', 'foo'),
            u('element', {tagName: 'span'}, [
              u('text', 'a "quoted" word'),
            ]),
          ]),
        ])
        rehypeQuotes()(tree)
        expect(tree.children[0].children[1].children[0].value).toBe('a "quoted" word')
      })

      it('does not replace any single quotes', () => {
        const tree: any = u('tree', [
          u('element', {tagName: 'code'}, [
            u('text', 'foo'),
            u('element', {tagName: 'span'}, [
              u('text', 'that\'s a word'),
            ]),
          ]),
        ])
        rehypeQuotes()(tree)
        expect(tree.children[0].children[1].children[0].value).toBe('that\'s a word')
      })
    })
  })
})
