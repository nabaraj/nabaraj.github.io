// angular
import { FormGroup, Validators } from '@angular/forms';

// 3rd party
import * as changeCase from 'change-case';
import { CustomValidators } from 'ng2-validation';

export class ValidationService {//extends Validators {

  static addFormError(formErrors, fieldKey, validationType, customValidationMessages, formMetaData) {
    console.log('addFormError');
    //if custom validation message exists use that
    formErrors.properties[fieldKey]['x-ncg'].errors.push({
      field: fieldKey,
      message: formMetaData.properties[fieldKey]['x-ncg'].validations[validationType]
        && formMetaData.properties[fieldKey]['x-ncg'].validations[validationType].message ?
        formMetaData.properties[fieldKey]['x-ncg'].validations[validationType].message :
        ValidationService.getGenericValidationMessage(fieldKey, validationType, formMetaData)
    });
  }

  // this is English. should have diff providers for different languages???
  // TODO: move to service
  static getGenericValidationMessage(fieldKey, validationType, formMetaData): string {
    console.log('getGenericValidationMessage');
    let errorMessage: string = '';
    let label = ValidationService.getLabel(fieldKey, formMetaData);

    //http://json-schema.org/latest/json-schema-validation.html - JSON Schema Validation: A Vocabulary for Structural Validation of JSON
    //https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject - Swagger Schema Object
    switch (validationType) {
      case 'minLength':
        errorMessage = `"${label}" must be at least ${formMetaData.properties[fieldKey]['x-ncg'].validations.minLength.value} characters.`;
        break;
      case 'maxLength':
        errorMessage = `"${label}" must be at most ${formMetaData.properties[fieldKey]['x-ncg'].validations.maxLength.value} characters.`;
        break;
      case 'minimum':
        errorMessage = `"${label}" must be at least ${formMetaData.properties[fieldKey]['x-ncg'].validations.minimum.value}.`;
        break;
      case 'maximum':
        errorMessage = `"${label}" must be at most ${formMetaData.properties[fieldKey]['x-ncg'].validations.maximum.value}.`;
        break;
      case 'required':
        errorMessage = `"${label}" is required.`;
        break;
      case 'pattern':
        errorMessage = `"${formMetaData.properties[fieldKey]['x-ncg'].validations.pattern.value}" is required.`;
        break;
      default:

    }
    return errorMessage;
  }

  static getLabel(fieldKey, formMetaData) {
    return formMetaData.properties[fieldKey]['x-ncg'].label ? formMetaData.properties[fieldKey]['x-ncg'].label : changeCase.title(fieldKey);
  }

  generateValidators(validations): any[] {
    let validators = [];

    for (const validationKey in validations) {
      if (validationKey === 'required') {
        validators.push(Validators.required);
      }
      if (validationKey === 'minLength') {
        validators.push(Validators.minLength(validations.minLength.value));
      }
      if (validationKey === 'maxLength') {
        validators.push(Validators.maxLength(validations.maxLength.value));
      }
      // if (validationKey === 'minimum') {
      //    validators.push(CustomValidators.min(validations.minimum.value));
      // }
      // if (validationKey === 'maximum') {
      //   validators.push(CustomValidators.max(validations.maximum.value));
      // }
      if (validationKey === 'minimum') {
        validators.push(ValidationService.min(validations.minimum.value));
      }
      if (validationKey === 'maximum') {
        validators.push(ValidationService.max(validations.maximum.value));
      }
      if (validationKey === 'pattern') {
        validators.push(Validators.pattern(validations.pattern.value));
      }

      // if (validationKey === 'minimum') {
      //   validators.push(ValidationService.minimumValidator(validations.minimum.value));
      // }
      // if (validationKey === 'maximum') {
      //   validators.push(ValidationService.maximumValidator(validations.maximum.value));
      // }
    }

    return validators;
  }







  static getValidatorErrorMessage(code: string, errorValue: any) {
    console.log('getValidatorErrorMessage code:' + code);
    // TODO: find out how to get more specific, like exact min or max length, and what if more than 1 control which has different requirements, how to do per control
    let config = {
      // built-in
      maxlength: 'Maximum length is ' + errorValue.requiredLength,
      minlength: 'Minimum length is ' + errorValue.requiredLength,
      // https://github.com/angular/angular/blob/master/modules/angular2/src/common/forms/validators.ts
      // looking at the source code, we see the minlength error return object has info like requiredLength
      required: 'Required',

      // custom
      invalidCreditCard: 'Invalid credit card number',
      invalidEmailAddress: 'Invalid email address',
      invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      dateAfterValidator: 'Invalid date. Date must be greater than ' + errorValue.dateAfterString,
      dateBeforeValidator: 'Invalid date. Date must be greater than ' + errorValue.dateBeforeString,
      dateFormatValidator: 'Invalid date. Date must be in format "' + errorValue.formatString + '"',
      numberValidator: 'Invalid value. The value must be a number.',
      minimumValidator: 'Invalid value. The value must be equal or greater than ' + errorValue.minimumValue,
      maximumValidator: 'Invalid value. The value must be equal or less than ' + errorValue.maximumValue,
      postalCodeValidator: 'Invalid postal code. Postal code must be in format of ' + errorValue.countryCode,
    };

    return config[code];
  }

  static creditCardValidator() {
    return function (control) {
      // Visa, MasterCard, American Express, Diners Club, Discover, JCB
      if (control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )) {
        return null;
      } else {
        return { 'invalidCreditCard': true };
      }
    };
  }

  static emailValidator() {
    return function (control) {
      // RFC 2822 compliant regex
      if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return null;
      } else {
        return { 'invalidEmailAddress': true };
      }
    };
  }

  static passwordValidator() {
    return function (control) {
      // {6,100}           - Assert password is between 6 and 100 characters
      // (?=.*[0-9])       - Assert a string has at least one number
      if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        return null;
      } else {
        return { 'invalidPassword': true };
      }
    };
  }

  // UNDONE: http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields
  static matchingValuesValidator(control1Key: string, control2Key: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let control1 = group.controls[control1Key];
      let control2 = group.controls[control2Key];

      if (control1.value !== control2.value) {
        return {
          mismatchingValues: true
        };
      }
    };
  }

  static numberValidator() {
    return function (control) {
      if (control.value.match(/^\\d+$/)) {
        return null;
      } else {
        return { 'numberValidator': true };
      }
    };
  }

  static postalCodeValidator(countryCode) {
    return function (control) {
      let postalCodeRegex;

      switch (countryCode) {
        case 'US':
          postalCodeRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
          break;
        case 'CA':
          postalCodeRegex = /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/;
          break;
        default:
          postalCodeRegex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/;
      }

      if (control.value.match(postalCodeRegex)) {
        return null;
      } else {
        return { 'postalCodeValidator': { 'countryCode': countryCode } };
      }

    };
  }

  // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
  static dateFormatValidator(formatString) {
    return function (control) {
      let formatStringRegex;

      switch (formatString) {
        case 'mm/dd/yyyy':
          formatStringRegex = /^(((0[13578]|10|12])\/(0[1-9]|[12][0-9]|3[0-1]))|((0[469]|11)\/(0[1-9]|[12][0-9]|30)))|(02\/(0[1-9]|[12][0-9]))\/(1|2)*(?:[0-9][0-9][0-9]?)$/;
          break;

        case 'mm-dd-yyyy':
          formatStringRegex = /^(((0[13578]|10|12])-(0[1-9]|[12][0-9]|3[0-1]))|((0[469]|11)-(0[1-9]|[12][0-9]|30)))|(02-(0[1-9]|[12][0-9]))-(1|2)*(?:[0-9][0-9][0-9]?)$/;
          break;

        case 'yyyy/mm/dd':
          formatStringRegex = /^(1|2)*(?:[0-9][0-9][0-9]?)\/(((0[13578]|10|12])\/(0[1-9]|[12][0-9]|3[0-1]))|((0[469]|11)\/(0[1-9]|[12][0-9]|30)))|(02\/(0[1-9]|[12][0-9]))$/;
          break;

        case 'yyyy-mm-dd':
          formatStringRegex = /^(1|2)*(?:[0-9][0-9][0-9]?)-(((0[13578]|10|12])-(0[1-9]|[12][0-9]|3[0-1]))|((0[469]|11)-(0[1-9]|[12][0-9]|30)))|(02-(0[1-9]|[12][0-9]))$/;
          break;

        default:
          // date format default is mm/dd/yyyy mm-dd-yyyy
          formatStringRegex =
            /^(((0[13578]|10|12])(-|\/)(0[1-9]|[12][0-9]|3[0-1]))|((0[469]|11)(-|\/)(0[1-9]|[12][0-9]|30)))|(02(-|\/)(0[1-9]|[12][0-9]))(-|\/)(1|2)*(?:[0-9][0-9][0-9]?)$/;
          break;
      }

      if (control.value.match(formatStringRegex)) {
        return null;
      } else {
        return { 'dateFormatValidator': { 'formatString': formatString } };
      }
    };
  }

  static dateAfterValidator(dateAfterString) {
    return function (control) {
      let currentDate = Date.parse(control.value),
        afterDate = Date.parse(dateAfterString);

      if (!isNaN(currentDate) && !isNaN(afterDate) && currentDate > afterDate) {
        return null;
      } else {
        return { 'dateAfterValidator': { 'dateAfterString': dateAfterString } };
      }
    };
  }

  static dateBeforeValidator(dateBeforeString) {
    return function (control) {
      let currentDate = Date.parse(control.value),
        beforeDate = Date.parse(dateBeforeString);

      if (!isNaN(currentDate) && !isNaN(beforeDate) && currentDate < dateBeforeString) {
        return null;
      } else {
        return { 'dateBeforeValidator': { 'dateBeforeString': dateBeforeString } };
      }
    };
  }

  // validate value in range
  // static minimumValidator(minimumValue) {
  //   return function (control) {
  //     if (control.value < minimumValue) {
  //       return { 'minimumValidator': { 'minimumValue': minimumValue } };
  //     } else {
  //       return null;
  //     }
  //   };
  // }

  // static maximumValidator(maximumValue) {
  //   return function (control) {
  //     if (control.value > maximumValue) {
  //       return { 'maximumValidator': { 'maximumValue': maximumValue } };
  //     } else {
  //       return null;
  //     }
  //   };
  // }

  static min(minimumValue) {
    return function (control) {
      if (control.value < minimumValue) {
        return { 'minimum': { 'value': minimumValue } };
      } else {
        return null;
      }
    };
  }

  static max(maximumValue) {
    return function (control) {
      if (control.value > maximumValue) {
        return { 'maximum': { 'value': maximumValue } };
      } else {
        return null;
      }
    };
  }


  // UNDONE: Implement validate for phone format
  static phoneFormatValidation(type) {
    return function (control) {
      switch (type) {
        case 'US':
          return undefined;

        default:
          return undefined;
      }
    };
  }

  // UNDONE: Implement validate for range
  static numberRangeValidator(firstValue, secondValue, type) {
    return function (control) {
      switch (type) {
        case '<>':
          // validate value between range
          return undefined;
        case '><':
          // validate value not in range.
          return undefined;
        default:
          return undefined;
      }
    };
  }

  static pattern(regex) {
    return function (control) {
      if (control.value.match(regex)) {
        return undefined;
      } else {
        return {};
      }
    };
  }

  static enum(array) {
    return function (control) {
      return undefined;
    };
  }

  // TODO: DATATYPE number, date, REAL WORLD TYPE zipcode, MULTIPLE/COMPARISON range, GENERIC/FORMAT regEx

}
