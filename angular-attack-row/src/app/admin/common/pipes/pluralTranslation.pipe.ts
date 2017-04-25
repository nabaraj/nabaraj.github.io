import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'pluralTranslation', pure: false })
export class PluralTranslation implements PipeTransform {
  plural = {
    '(quiz)$': '$1zes',
    '^(ox)$': '$1en',
    '([m|l])ouse$': '$1ice',
    '(matr|vert|ind)ix|ex$': '$1ices',
    '(x|ch|ss|sh)$': '$1es',
    '([^aeiouy]|qu)y$': '$1ies',
    '(hive)$': '$1s',
    '(?:([^f])fe|([lr])f)$': '$1$2ves',
    '(shea|lea|loa|thie)f$': '$1ves',
    'sis$': 'ses',
    '([ti])um$': '$1a',
    '(tomat|potat|ech|her|vet)o$': '$1oes',
    '(bu)s$': '$1ses',
    '(alias)$': '$1es',
    '(octop)us$': '$1i',
    '(ax|test)is$': '$1es',
    '(us)$': '$1es',
    '([^s]+)$': '$1s'
  };

  singular = {
    '(quiz)zes$': '$1',
    '(matr)ices$': '$1ix',
    '(vert|ind)ices$': '$1ex',
    '^(ox)en$': '$1',
    '(alias)es$': '$1',
    '(octop|vir)i$': '$1us',
    '(cris|ax|test)es$': '$1is',
    '(shoe)s$': '$1',
    '(o)es$': '$1',
    '(bus)es$': '$1',
    '([m|l])ice$': '$1ouse',
    '(x|ch|ss|sh)es$': '$1',
    '(m)ovies$': '$1ovie',
    '(s)eries$': '$1eries',
    '([^aeiouy]|qu)ies$': '$1y',
    '([lr])ves$': '$1f',
    '(tive)s$': '$1',
    '(hive)s$': '$1',
    '(li|wi|kni)ves$': '$1fe',
    '(shea|loa|lea|thie)ves$': '$1f',
    '(^analy)ses$': '$1sis',
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
    '([ti])a$': '$1um',
    '(n)ews$': '$1ews',
    '(h|bl)ouses$': '$1ouse',
    '(corpse)s$': '$1',
    '(us)es$': '$1',
    's$': ''
  };

  irregular = {
    'move': 'moves',
    'foot': 'feet',
    'goose': 'geese',
    'sex': 'sexes',
    'child': 'children',
    'man': 'men',
    'tooth': 'teeth',
    'person': 'people'
  };

  uncountable = [
    'sheep',
    'fish',
    'deer',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment'
  ];

  transform(value: any, args: any[] = null): any {
    // save some time in the case that singular and plural are the same
    if (this.uncountable.indexOf(value.toLowerCase()) >= 0) {
      return value;
    }

    let isSingular: boolean = (args && args.indexOf('singular') > -1) ? true : false;
    let pattern: any;
    let replace: any;
    let modelArray: any;

    for (let word in this.irregular) {

      if (isSingular) {
        pattern = new RegExp(this.irregular[word] + '$', 'i');
        replace = word;
      } else {
        pattern = new RegExp(word + '$', 'i');
        replace = this.irregular[word];
      }

      if (pattern.test(value)) {
        return value.replace(pattern, replace);
      }
    }

    if (isSingular) {
      modelArray = this.singular;
    } else {
      modelArray = this.plural;
    }

    // check for matches using regular expressions
    for (let reg in modelArray) {
      pattern = new RegExp(reg, 'i');

      if (pattern.test(this)) {
        return value.replace(pattern, modelArray[reg]);
      }
    }

    return value;
  }
}
